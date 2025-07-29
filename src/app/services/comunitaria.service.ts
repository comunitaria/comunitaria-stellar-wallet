import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Monedero, Comercio, logeoResponse, Usuario, Cuenta } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';
import { interval,firstValueFrom } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';

const SERVIDOR = environment.servidorVst;
const MS_REFRESCO=60000;

@Injectable({
  providedIn: 'root'
})
export class ComunitariaService {
  public token:string='';
  public refrescarUsuario:boolean=false;

  constructor(private http: HttpClient, private estado:StorageService) { 
    interval(MS_REFRESCO).subscribe(()=>{
      if (this.refrescarUsuario){
        this.actualizaMisDatos(true);
      }
    });
  }

  async getEstadoCuenta(cuenta = '', token = '') {
    return new Promise((res, rej) => {    
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);    
    
      this.http.get<logeoResponse>(SERVIDOR + "cuenta/" + cuenta, { headers: headers }).subscribe(
        {
          next: (valor) => {
console.log('valor',valor );
            res(valor);

          }, error: (err) => {
            rej('');
          }
        }
      );


    });

  }

  //-------------------------------------------------------------------------------------------------

  async registrarCuenta():Promise<void> {
  //Codigos 40-49 
  try{
    await this.actualizaToken();
  }
  catch(error){
    throw error;
  }
  if (this.token!=''){
      let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.token);
      headers.append('Content-Type', 'application/json');
      try{
        var respuesta=await firstValueFrom(this.http.post<Monedero>(SERVIDOR + "cuenta/" + this.estado.usuario.monedero.cuenta.publica, null, { headers: headers }));
        if (respuesta.cuenta){
          this.estado.usuario.monedero.emisora=respuesta.emisora||'';
          this.estado.usuario.monedero.distribuidora=respuesta.distribuidora||'';
          this.estado.usuario.monedero.nombreMoneda=respuesta.cripto||'';
          this.estado.usuario.monedero.cuenta.estado=respuesta.cuenta.estado||'local';
        }
        else
          throw {codigo:42, modulo:'comunitaria', mensaje:'No consigo registro'};
      }
      catch(error:any){
        if (error.modulo)
          throw  error;
        else
          throw {codigo:30,  modulo:'comunitaria', mensaje:JSON.stringify(error, Object.getOwnPropertyNames(error))};
      }
    }
  }

  //-------------------------------------------------------------------------------------------------

  async autorizarCuenta():Promise<true> {
    //Codigos 30-39 
    try{
      await this.actualizaToken();
    }
    catch(error){
      throw error;
    }
    if (this.token!=''){
      let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.token);
      headers.append('Content-Type', 'application/json');
      try{
        var respuesta=await firstValueFrom(this.http.post<Monedero>(SERVIDOR + "cuenta/" + this.estado.usuario.monedero.cuenta.publica + "/autorizacion", null, { headers: headers }));
        if (respuesta.cuenta){
          this.estado.usuario.monedero.cuenta.estado=respuesta.cuenta.estado||'trustline';
          return true;
        }
        else
          throw {codigo:32, modulo:'comunitaria', mensaje:'No consigo autorizacion'};
      }
      catch(error:any){
        if (error.modulo)
          throw  error;
        else
          throw {codigo:30,  modulo:'comunitaria', mensaje:JSON.stringify(error, Object.getOwnPropertyNames(error))};
      }
    }
    else{
      throw {codigo:31, modulo:'comunitaria', mensaje:'No consigo token'};
    }

//    headers.set('Accept', '*/*');
//    headers.set('Connection', 'keep-alive');
  
  }

  //-------------------------------------------------------------------------------------------------


  async leeMiInfo():Promise<any> {
    //Codigos 1-9
    try{
        await this.actualizaToken();
    }
    catch(error){
        throw error;
    }
    if (this.token!=''){
      let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.token);
      headers.append('Content-Type', 'application/json');
      try{
        return firstValueFrom(this.http.get<any>(SERVIDOR + "usuario", { headers: headers }));
      }
      catch(error:any){
        if (error.modulo)
          throw  error;
        else
          throw {codigo:2,  modulo:'comunitaria', mensaje:JSON.stringify(error, Object.getOwnPropertyNames(error))};
      }
    }
    else{
      throw {codigo:1, modulo:'comunitaria', mensaje:'No consigo token'};
    }
  }
  //-------------------------------------------------------------------------------------------------
  async actualizaToken():Promise<boolean>{
    //Codigos 10-19
    if (this.token!='') return true;
    let headers = new HttpHeaders();
    const body = new HttpParams()
      .set('username', this.estado.usuario.login||'')
      .set('password', this.estado.usuario.password||'')
      .set('grant_type', 'password');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    try{
      var respuesta:logeoResponse=await firstValueFrom(this.http.post<logeoResponse>(SERVIDOR + "login", body, { headers: headers }));
      if (respuesta.access_token&&respuesta.access_token!=''){
        this.token=respuesta.access_token;
        return true;
      }
      else{
        this.token='';
        throw {codigo:11, modulo:'comunitaria', mensaje:'No consigo token'};
      }
    }
    catch(error:any){
      if (error.modulo)
          throw  error;
      else
        throw {codigo:10,  modulo:'comunitaria', mensaje:JSON.stringify(error, Object.getOwnPropertyNames(error))};
    }
  }
  private async actualizaComercio(id:any){
    const comercio=await this.getUnComercio(id);
    if (comercio){
      this.estado.comercios[id]=comercio;
      this.estado.archivaComercios();
    }
  }
  public async actualizaMisDatos(refrescando=false):Promise<boolean>{
    //Codigos 20-29 
    this.refrescarUsuario=refrescando;
    try{
        var miInfo=await this.leeMiInfo();
        console.log('Ha leido info',this.estado.usuario);
        if (miInfo.moneda){
          let usuario:Usuario={} as Usuario;
          usuario.id=miInfo.id||'';
          usuario.clase=miInfo.clase||'';
          usuario.nombre=miInfo.nombre||'';
          usuario.apellidos=miInfo.apellidos||'';
          usuario.autorizado_en={
              clase: (miInfo.autorizado_en||{clase:''}).clase,
              texto: (miInfo.autorizado_en||{texto:''}).texto
          };
          usuario.correo=miInfo.correo||'';
          usuario.direccion=miInfo.direccion||'';
          usuario.movil=miInfo.movil||'';
          usuario.monedero={
                  nodo:miInfo.moneda.nodo,
                  red: miInfo.moneda.red,
                  nombreMoneda:miInfo.moneda.cripto,
                  emisora:miInfo.moneda.emisora,
                  distribuidora:miInfo.moneda.distribuidora,
                  cuenta: (this.estado.usuario.monedero&&this.estado.usuario.monedero.cuenta&&this.estado.usuario.monedero.cuenta.privada)?JSON.parse(JSON.stringify(this.estado.usuario.monedero.cuenta)):{} as Cuenta};
          usuario.comercios=[];
          if (miInfo.comercios){
            for(var l1 in miInfo.comercios ){
              var estaba=false;
              for(var l2 in this.estado.usuario.comercios){
                if (this.estado.usuario.comercios[l2].id==miInfo.comercios[l1].id){
                  if (this.estado.usuario.comercios[l2].hash!=miInfo.comercios[l1].hash){
                    this.actualizaComercio(miInfo.comercios[l1].id);
                  }
                  estaba=true;
                  break;
                }
              }
              if (!estaba){
                this.actualizaComercio(miInfo.comercios[l1].id);
              }
              if (!this.estado.comercios[miInfo.comercios[l1].id]){
                this.actualizaComercio(miInfo.comercios[l1].id);
              }
            }
          }
          usuario.comercios=JSON.parse(JSON.stringify(miInfo.comercios));
          console.log('Ha leido tiendas');
          await this.estado.actualizaUsuarioYGrabaSiEso(usuario);
        }
        return true;    
      }
      catch(error:any){
        if (error.modulo)
          throw  error;
        else
          throw {codigo:20, modulo:'comunitaria', mensaje:'Fallo datos '+JSON.stringify(error, Object.getOwnPropertyNames(error))};
      }
    
  }

  async getUnComercio(idComercio = '') {
    //Codigos 50-59
    try{
      await this.actualizaToken();
    }
    catch(error){
      throw error;
    }
    if (this.token!=''){
      let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.token);
      headers.append('Content-Type', 'application/json');
      try{
        return firstValueFrom(this.http.get<any>(SERVIDOR + "comercio/" + idComercio, { headers: headers }));
      }
      catch(error:any){
        if (error.modulo)
          throw  error;
        else
          throw {codigo:50,  modulo:'comunitaria', mensaje:JSON.stringify(error, Object.getOwnPropertyNames(error))};
      }
    }
    else{
      throw {codigo:51, modulo:'comunitaria', mensaje:'No consigo token'};
    }

  }

  //-------------------------------------------------------------------------------------------------

}
