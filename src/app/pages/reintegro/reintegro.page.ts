import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonInput, LoadingController } from '@ionic/angular';
import { StellarService } from 'src/app/services/stellar.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-reintegro',
  templateUrl: './reintegro.page.html',
  styleUrls: ['./reintegro.page.scss'],
})
export class ReintegroPage  {
  @ViewChild('ipCantidad', { static: false }) ipCantidad: IonInput | undefined;
  mensaje = '';
  esComercio:boolean=false;
  importeTransferencia:number=0;
  public saldoILLA:string='';
  public sinSaldo:boolean=false;

  constructor(
    private stellar: StellarService, 
    public estado: StorageService, 
  private loadingCtrl: LoadingController) { 
    
  }

  ionViewWillEnter() {
    this.importeTransferencia=0;
    this.refrescarSaldo();
    this.esComercio=this.estado.usuario.clase=='comercio';
    
  }
  pulsado(codigo:any){
    console.log(codigo);
    this.ipCantidad!.getInputElement().then(
      inputElement => inputElement.blur()
  );
  }


  //--------------------------------------------------------------------------------------------------

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      showBackdrop: true,
      backdropDismiss: false,
      translucent: true,
      duration: 0,
      mode: "ios"
    });

    loading.present();
  }

  onClick() {


  }

  //--------------------------------------------------------------------------------------------------
  async refrescarSaldo() {
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

  //-----------------------------------------------------------------------

  async transferirDistribuidora() {
    this.sinSaldo=(this.importeTransferencia>parseFloat(this.saldoILLA));
    if (this.sinSaldo) return;
    if (this.importeTransferencia==0) return;
    this.showLoading();
      try {
          
          this.stellar.TransferirCripto(this.estado.usuario.monedero.distribuidora,this.importeTransferencia,'Reintegro de '+this.estado.usuario.nombre);

          setTimeout(() => {
            this.mensaje = 'Transferencia realizada';
            this.refrescarSaldo();
            this.loadingCtrl.dismiss();

          }, 10000);



        } catch (error) {
          this.mensaje = 'Error realizando transferencia';
          console.log('ha petao', error);
          setTimeout(() => {
            this.loadingCtrl.dismiss();
          }, 3000);

        }
      


    }

    

  }


