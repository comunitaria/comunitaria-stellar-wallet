import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { IonInput, LoadingController, ModalController, NavController } from '@ionic/angular';
import { StellarService } from 'src/app/services/stellar.service';
import { Comercio, ReferenciaComercio } from 'src/app/interfaces';
import { StorageService } from 'src/app/services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.page.html',
  styleUrls: ['./pagos.page.scss'],
})
export class PagosPage {
  idTienda: string='';
  public cantidad = 0;
  public sinSaldo:boolean=false;
  public saldoILLA:string='';
  mensaje = '';
  @ViewChild('ipCantidad') ipCantidad: IonInput | undefined;

  constructor(
    private stellar: StellarService,
    public estado: StorageService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    ) { 
    this.route.queryParams.subscribe(params => {
      if (params && params['tienda']) {
        this.idTienda = params['tienda'];
      }
   });
  }

  
  //--------------------------------------------------------------------------------------------------

  ionViewWillEnter(){
    this.cantidad=0;
    this.stellar.miSaldo().then(()=>{
      this.saldoILLA=parseFloat(this.estado.usuario.monedero.cuenta.balanceCripto!).toFixed(2);
    });
  }
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

  async pagar() {
    //this.stellar.TransferirXLM(this.laTienda.cuenta ,clave,1);
    this.sinSaldo=(this.cantidad>parseFloat(this.saldoILLA));
    if (this.sinSaldo) return;
    if (this.cantidad==0) return;
    this.mensaje = '';
    this.navCtrl.navigateForward('/transfiriendo',{queryParams: {cuenta: this.estado.comercios[this.idTienda].cuenta, idComercio:this.idTienda, cantidad:this.cantidad.toFixed(7)}});    
  }
  pulsado(codigo:any){
    console.log(codigo);
    this.ipCantidad!.getInputElement().then(
      inputElement => inputElement.blur()
  );
  }


  salirSin() {
    this.navCtrl.navigateForward('/main/tiendas');
    
  }

}
