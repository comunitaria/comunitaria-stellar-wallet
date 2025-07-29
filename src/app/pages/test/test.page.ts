import { Component, OnInit } from '@angular/core';
import { NativeAudio } from '@capacitor-community/native-audio';
import { LoadingController, Platform } from '@ionic/angular';
import { interval, Observable, Subscription } from 'rxjs';

import { StellarService } from 'src/app/services/stellar.service';
import { StorageService } from 'src/app/services/storage.service';


const MS_DESTACADO:number=30000;
  
@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage  {
  public saldoILLA:string = '';
  public transacciones:any[]=[];
  private refresco!: Subscription;
  private aviso!:()=>void;
  mensaje = '';

  constructor(
    private stellar: StellarService, 
    public estado: StorageService, 
    private loadingCtrl: LoadingController,
    public platform: Platform,
  ) {
    
  }

  ionViewWillEnter() {
    console.log('en will enter');
    this.refrescarSaldo();
    this.refrescaTransacciones();
    this.aviso=this.stellar.avisaDePago((mensaje:any)=>{
      console.log(mensaje);
      
      if (mensaje.asset_code==this.estado.usuario.monedero.nombreMoneda){
        this.refrescarSaldo();
        NativeAudio.play({assetId:'pagoRecibido'});
        this.transacciones.unshift(this.elementoTransaccion(mensaje));
      }
    });
    this.refresco=interval(3000).subscribe(()=>{
      for(var t in this.transacciones){
        if (!this.transacciones[t].reciente) break;
        this.transacciones[t].reciente=((new Date().getTime()-this.transacciones[t].momento.getTime())<MS_DESTACADO);
      }
    });
  }
  ionViewWillLeave(){
    this.aviso();
    this.refresco.unsubscribe();
  }
  private elementoTransaccion(transaccion:any):any{
    const pago=(transaccion.from==this.estado.usuario.monedero.cuenta.publica);
    var otro='';
    if (this.estado.usuario.clase=='beneficiario'){
      if (!pago&&this.estado.usuario.monedero.distribuidora==(transaccion.from)){
        otro='Donación de ONG';
      }
      else{
        for(var c in this.estado.usuario.comercios){
          if (this.estado.usuario.comercios[c].clave==(pago?transaccion.to:transaccion.from)){
            otro=(pago?'Compra en ':'Devolucion de')+this.estado.usuario.comercios[c].nombre||'';
            break;
          }
        }
        if (otro==''){
          otro=(pago?'Compra':'Transferencia recibida');
        }
      }

    }
    else{
      if ((this.estado.usuario.monedero.distribuidora==(pago?transaccion.to:transaccion.to))||
      (this.estado.usuario.monedero.distribuidora==(pago?transaccion.to:transaccion.from))){
        otro=pago?'Reintegro a ONG':'Transferencia de ONG';
      }
      else{
        for(var c in this.estado.usuario.comercios){
          if (this.estado.usuario.comercios[c].clave==(pago?transaccion.to:transaccion.from)){
            otro=(pago?'Compra en ':'Transferencia de')+this.estado.usuario.comercios[c].nombre||'';
            break;
          }
        }
        if (otro==''){
          otro=(pago?'Compra':'Pago por compra realizada');
        }
      }
    }
    const reciente=(new Date().getTime()-new Date(transaccion.created_at).getTime())<MS_DESTACADO;
    return {
        reciente: reciente,
        momento: new Date(transaccion.created_at),
        cantidad: parseFloat(transaccion.amount).toFixed(2),
        pago: pago,
        cuentaDe: transaccion.from,
        cuentaA: transaccion.to,
        concepto: otro
    };
  }
  refrescaTransacciones(){
  console.log('Miro pagos');
    this.stellar.transacciones()
    .then((lista)=>{
      this.transacciones=[];
      if (lista.records){
        let hayReciente:boolean=false;
        for(var r in lista.records){
          if (lista.records[r].asset_code==this.estado.usuario.monedero.nombreMoneda){
            this.transacciones.push(this.elementoTransaccion(lista.records[r]));
          }
        }
        if (hayReciente) this.refrescarSaldo(); 
      }
    });
  }
  //--------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------
  async refrescarSaldo() {
    NativeAudio.play({assetId:'pagoRecibido'});
    await this.stellar.miSaldo();
    this.saldoILLA=parseFloat(this.estado.usuario.monedero.cuenta.balanceCripto!).toFixed(2);
    
  }
  //--------------------------------------------------------------------------------------------------

  botonGrabar() {

    
    //this.estado.guardarUsuario(usuario);

  }

  botonLeer() {

    var usuarios = this.estado.cargarUsuarios();

    usuarios.then(function (usuario) {
      console.log("muestro usuarios", usuario);
    })
  }

}
