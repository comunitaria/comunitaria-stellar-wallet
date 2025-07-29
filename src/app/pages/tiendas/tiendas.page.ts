import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { PagosPage } from '../pagos/pagos.page';
import { environment } from 'src/environments/environment';
import { ReferenciaComercio } from 'src/app/interfaces';


@Component({
  selector: 'app-tiendas',
  templateUrl: './tiendas.page.html',
  styleUrls: ['./tiendas.page.scss'],
})
export class TiendasPage {

  @Input() nombre: string = '';
  //tiendas: Observable<any> = new Observable<any>;

  logo_vacio = environment.logo_vacio;

 
  //stellar: Observable<any> = new Observable<any>;

  constructor(private navCtrl: NavController,
    public estado: StorageService, private modalCtrl: ModalController,  private loadingCtrl: LoadingController,) { }

  //private unaTienda:ReferenciaComercio;

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


  //--------------------------------------------------------------------------------------------------


  seleccionar(unaTienda: ReferenciaComercio) {
    console.log(unaTienda);
    //this.unaTienda = unaTienda;

  }

  comprar(unaTienda: ReferenciaComercio) {
    //this.unaTienda = unaTienda;
    this.realizarPago(unaTienda);

  }
  
  async realizarPago(unaTienda: ReferenciaComercio) {
    this.navCtrl.navigateForward('/main/pagos',{queryParams: {tienda: unaTienda.id}});
    
  }
}
