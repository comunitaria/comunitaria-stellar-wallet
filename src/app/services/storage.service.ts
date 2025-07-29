import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';
import {  Comercio, Usuario } from '../interfaces';
import { ComunitariaService } from './comunitaria.service';


@Injectable({
  providedIn: 'root'
})


export class StorageService {
  public comercios:{[id: string]: Comercio}={};
  public usuarios: Usuario[] = [];
  public usuarioActual: number=-1;
  public hayUsuario: boolean=false;

  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    //this.init();
  }

  get usuario():Usuario{
    var vacio={} as Usuario;
    return this.hayUsuario?this.usuarios[this.usuarioActual]:vacio;
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  //-----------------------------------------------------------------------------------------

  async cargarUsuarios():Promise<boolean> {
    //Codigos 1-9
    try{
      this.usuarios = await this._storage?.get("usuarios");
      console.log('leo '+JSON.stringify(this.usuarios)+' usuarios');
      return true;
    }
    catch(error){
      throw {codigo:1,mpdulo:'storage',message:JSON.stringify(error, Object.getOwnPropertyNames(error))};
    }
  }

  //-----------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------

  async cargarTiendas():Promise<void> {
    //Codigos 20-29
    try{
      this.comercios = await this._storage?.get("comercios")||[]
    }
    catch(error){
      throw {codigo:20,mpdulo:'storage',message:JSON.stringify(error, Object.getOwnPropertyNames(error))};
    }
  }

  //-----------------------------------------------------------------------------------------

  async borrarTiendas() {
    await this._storage?.remove("comercios");
  }

  //-----------------------------------------------------------------------------------------

  async borrarUsuarios() {
    await this._storage?.remove("usuarios");
  }

  //-----------------------------------------------------------------------------------------

  async borrarParametros() {
    await this._storage?.remove("login");
  }


  //-----------------------------------------------------------------------------------------
  async cargar() {
    //Codigos: 10-19
    if (!this._storage) await this.init();
    this.hayUsuario=false;
    try{
      await this.cargarUsuarios();
    }
    catch(error){
      throw {codigo:10,mpdulo:'storage',message:JSON.stringify(error, Object.getOwnPropertyNames(error))};
    }
    console.log('miro a ver si hay usuario');
    for(var u in this.usuarios){
      console.log(this.usuarios[u]);
      if (this.usuarios[u].actual){
        this.hayUsuario=true;
        this.usuarioActual=parseInt(u);
        break;
      }
      else{
        console.log('No actual');
      }
    }
    if (this.hayUsuario){
      try{
        await this.cargarTiendas();
      }
      catch(error){
        throw {codigo:11,mpdulo:'storage',message:JSON.stringify(error, Object.getOwnPropertyNames(error))};
      }
    }
  }
  public async archivaUsuarios():Promise<boolean>{
    if (this.usuarios){
      await this._storage?.set("usuarios", this.usuarios.filter((u:Usuario)=>{return u.monedero&&u.monedero.cuenta&&u.monedero.cuenta.privada}));
      return true;
    }
    return false;
  }
  public async archivaComercios():Promise<boolean>{
    if (this.comercios){
      for(var c in this.comercios){
        let mencionado=false;
        for(let u in this.usuarios){
          if (this.usuarios[u].comercios){
            for(let c1 in this.usuarios[u].comercios){
              mencionado=(this.usuarios[u].comercios[c1].id==this.comercios[c].id);
              if (mencionado) break;
            }
          }
          if (mencionado) break;
        }
        if (!mencionado) delete this.comercios[c];
      } 
      await this._storage?.set("comercios", this.comercios);
      return true;
    }
    return false;
  }
  public activarUsuario(login:string):boolean {
    var estaba:boolean=false;
    this.hayUsuario=false;
    for(var u in this.usuarios){
      if (this.usuarios[u].login==login){
        estaba=true;
        this.hayUsuario=true;
        this.usuarios[u].actual=true;
        this.usuarioActual=parseInt(u);
      }
      else{
        this.usuarios[u].actual=false;
      }
    }
    this.archivaUsuarios();
    return estaba;
    
  }
  private actualizaPropiedad(objetoDe:any, objetoA:any, propiedad:any):boolean{
    let cambiado=false;
    if (typeof(objetoDe[propiedad])=='object'){
      if (!objetoA[propiedad]){
        cambiado=true;
        if (Array.isArray(objetoDe[propiedad])){
          objetoA[propiedad]=[];
        }
        else{
          objetoA[propiedad]={};
        }
      }
      for(let subpropiedad in objetoDe[propiedad]){
        if (this.actualizaPropiedad(objetoDe[propiedad],objetoA[propiedad],subpropiedad)){
          cambiado=true;
        }
      }
    }
    else{
      cambiado=(objetoDe[propiedad]!=objetoA[propiedad]);
      if (cambiado) objetoA[propiedad]=objetoDe[propiedad];
    }
    return cambiado;
  }
  public async actualizaUsuarioYGrabaSiEso(usuario:Usuario):Promise<boolean>{
    let cambiado=false;
    if (this.hayUsuario){
      for(let propiedad in usuario){
        const esteCambiado=this.actualizaPropiedad(usuario,this.usuarios[this.usuarioActual],propiedad);
        cambiado||=esteCambiado;
      }
      if (cambiado){
        console.log('Ha grabado');
        await this.archivaUsuarios();
      }
    }
    return cambiado;
  }
  public nuevoUsuario():void{
    if (!this.activarUsuario("")){
      if (!this.usuarios) this.usuarios=[];
      this.usuarios.push({login:""} as Usuario);
      this.activarUsuario("");
    }
  }

}