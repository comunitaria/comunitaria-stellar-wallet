import { Injectable } from '@angular/core';
import * as StellarSdk from '@stellar/stellar-sdk';
import { Cuenta, Monedero } from '../interfaces';
import { StorageService } from './storage.service';




@Injectable({
  providedIn: 'root'
})

export class StellarService {
  
  constructor(private estado:StorageService) { }

  public nuevaCuenta():boolean {
    //Codigos 20-29
    try{
      const nuevaCuenta = StellarSdk.Keypair.random();
      if ((!this.estado.usuario.monedero.cuenta)||(!this.estado.usuario.monedero.cuenta.privada)){
        this.estado.usuario.monedero.cuenta={} as Cuenta;
      }
      this.estado.usuario.monedero.cuenta.publica = nuevaCuenta.publicKey();
      this.estado.usuario.monedero.cuenta.privada = nuevaCuenta.secret();
      this.estado.usuario.monedero.cuenta.estado='local';
      return true;
    }
    catch(error:any){
      if (error.modulo)
          throw  error;
      else
        throw {codigo: 20,  modulo:'stellar', mensaje:JSON.stringify(error, Object.getOwnPropertyNames(error))};
    }
  }

  //----------------------------------------------------------------------------------------

  async miSaldo():Promise<void> {
    //Codigos 10-19
    try{
      const servidor = new StellarSdk.Horizon.Server(this.estado.usuario.monedero.nodo!);

      var cuentaOrigen = await servidor.loadAccount(this.estado.usuario.monedero.cuenta.publica!);
      cuentaOrigen.balances.forEach((moneda:any) => {
          if (moneda.asset_type == "credit_alphanum4") {
            this.estado.usuario.monedero.cuenta.balanceCripto = moneda.balance;
          }
          if (moneda.asset_type == "native") {
            this.estado.usuario.monedero.cuenta.balanceXLM = moneda.balance;
          }
        });
      
    }
    catch(error:any){
      if (error.modulo)
          throw  error;
      else
        throw {codigo: 10,  modulo:'stellar', mensaje:JSON.stringify(error, Object.getOwnPropertyNames(error))};
    }
    

  }

  async transacciones():Promise<any> {
    //Codigos 40-49
    try{
      const servidor = new StellarSdk.Horizon.Server(this.estado.usuario.monedero.nodo!);

      var lista = await servidor.payments().forAccount(this.estado.usuario.monedero.cuenta.publica!).cursor('now').order('desc').limit(200).call();
      console.log(lista);
      return lista;
    }
    catch(error:any){
      if (error.modulo)
          throw  error;
      else
        throw {codigo: 40,  modulo:'stellar', mensaje:JSON.stringify(error, Object.getOwnPropertyNames(error))};
    }
    

  }

  public avisaDePago(callback:(mensaje:any)=>void):()=>void{
    //Codigos 50-59
    try{
      const servidor = new StellarSdk.Horizon.Server(this.estado.usuario.monedero.nodo!);

      return servidor.payments().forAccount(this.estado.usuario.monedero.cuenta.publica!).cursor('now').stream({onmessage: callback});
    }
    catch(error:any){
      if (error.modulo)
          throw  error;
      else
        throw {codigo: 50,  modulo:'stellar', mensaje:JSON.stringify(error, Object.getOwnPropertyNames(error))};
    }
    
  }

  //------------------------------------------------------------------------------------------------------------

  async TransferirCripto(cobradora = '',  numCriptos = 1, mensaje=''):Promise<boolean> {
    //Codigos 1-9
    let hayError: boolean = false;

    var cargar = numCriptos;

    var parejaPagador = StellarSdk.Keypair.fromSecret(this.estado.usuario.monedero.cuenta.privada!);
    try {
      const servidor = new StellarSdk.Horizon.Server(this.estado.usuario.monedero.nodo!);
      //Creamos un objeto que representa la nueva criptomoneda asociada a la emisora
      const criptomoneda = new StellarSdk.Asset(this.estado.usuario.monedero.nombreMoneda!, this.estado.usuario.monedero.emisora);

      var transaccionDePago: any;
      var cuentaPagadora=await servidor.loadAccount(parejaPagador.publicKey());
      console.log('Cuenta pagadora accesible. Balances', cuentaPagadora.balances)
          //Inicio la transacción como genérica
      transaccionDePago = new StellarSdk.TransactionBuilder(cuentaPagadora, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: (this.estado.usuario.monedero.red=='testnet'?StellarSdk.Networks.TESTNET:StellarSdk.Networks.PUBLIC),
          });
          //La orientamos a crear cuenta
        transaccionDePago= await transaccionDePago.addOperation(StellarSdk.Operation.payment({
            destination: cobradora,
            asset: criptomoneda,
            amount: cargar.toFixed(7),
          }))
            // A memo allows you to add your own metadata to a transaction. It's
            // optional and does not affect how  treats the transaction.
            .addMemo(StellarSdk.Memo.text(mensaje.substring(0,28)))
            .setTimeout(180)
            .build();
          //La firmamos
        await transaccionDePago.sign(parejaPagador);
      var respuesta= await servidor.submitTransaction(transaccionDePago);
          //Si llega aquí, es que tiene exito, pero confirmo
      if (respuesta.successful) {
            return true;
      }
      else {
            console.log('No confirmado', respuesta);
            throw {codigo:1, modulo:'stellar', mensaje:'No confirmado '+JSON.stringify(respuesta)};
          }
    }
    catch (e) {
      hayError = true;
      console.error("ERROR transfiriendo cripto:", e);
      throw {codigo:2,  modulo:'stellar', mensaje:JSON.stringify(e)};
  
    }

    
  }



  //------------------------------------------------------------------------------------------------------------------

  async lineaConfianza():Promise<boolean> {
    //Codigos 30-39
    console.log('Cliente local Stellar: Crear o anular (opción -anular) una línea de confianza\nlineaDeConfianza.js -pbe:[clave publica emisora] -pvd:[Clave privada demandante]  -n:[Nombre moneda] (-anular)\n');

    
    try {
      var demandante = StellarSdk.Keypair.fromSecret(this.estado.usuario.monedero.cuenta.privada!);
      const servidor = new StellarSdk.Horizon.Server(this.estado.usuario.monedero.nodo!);
      //Creamos un objeto que representa la nueva criptomoneda asociada a la emisora
      const criptomoneda = new StellarSdk.Asset(this.estado.usuario.monedero.nombreMoneda!, this.estado.usuario.monedero.emisora);
      //La demandante crea una trustline con la emisora 
      var transaccionLineaDeConfianza: any;
      var cuentaDemandante=await servidor.loadAccount(this.estado.usuario.monedero.cuenta.publica!);
      transaccionLineaDeConfianza = new StellarSdk.TransactionBuilder(cuentaDemandante, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: (this.estado.usuario.monedero.red=='testnet'?StellarSdk.Networks.TESTNET:StellarSdk.Networks.PUBLIC),
        });
        //La orientamos a crear línea de confianza
      var parametros = { asset: criptomoneda };
        //if (anular) parametros ['limit'] = "0";//anular o ilimitada (sin limit)
      transaccionLineaDeConfianza=await transaccionLineaDeConfianza.addOperation(StellarSdk.Operation.changeTrust(parametros))
          .setTimeout(180)
          .build();
      await transaccionLineaDeConfianza.sign(demandante);
      var respuesta= await servidor.submitTransaction(transaccionLineaDeConfianza);
      if (respuesta.successful) {
        this.estado.usuario.monedero.cuenta.estado='trustline';
        return true;
      }
      else {
        console.log('No confirmado', respuesta);
        console.error('Error línea de confianza no establecida:');//+JSON.stringify(respuesta.response)+"\nExtras\n"+JSON.stringify(respuesta.response.extras));
        throw {codigo:30, modulo:'stellar',mensaje:'Error '+JSON.stringify(respuesta)};
      }
    }
    catch (e) {
      console.error("ERROR accediendo a nodo:", e);
      throw {codigo:31, modulo:'stellar',mensaje:'Error '+JSON.stringify(e)};
    }

  }
}
