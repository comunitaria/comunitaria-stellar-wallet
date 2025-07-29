import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { StellarService } from 'src/app/services/stellar.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-transfiriendo',
  templateUrl: './transfiriendo.page.html',
  styleUrls: ['./transfiriendo.page.scss'],
})
export class TransfiriendoPage implements OnInit {
  public listo:boolean=false;
  private cuenta:string='';
  private comercio:number=-1;
  public cantidad:string='';
  public cantidadILLA:string='';
  public error:boolean=false;
  constructor(
    private stellar: StellarService,
    public estado: StorageService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
   
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter(){
    this.listo=false;
    this.error=false;
    this.route.queryParams.subscribe(params => {
      if (params && params['idComercio']&& params['cuenta'] && params['cantidad']) {
        this.comercio = params['idComercio'];
        this.cuenta = params['cuenta'];
        this.cantidad = params['cantidad'];
        this.cantidadILLA=parseFloat(this.cantidad).toFixed(2);
      }
   });
   this.realizaPago();
  }
  async realizaPago(){
    try {
      await this.stellar.TransferirCripto(this.cuenta, parseFloat(this.cantidad),'Compra en '+this.estado.comercios[this.comercio].nombre);
        setTimeout(() => {
          this.listo=true;
        }, 5000);
    } catch (error) {
      console.log('ha petao', error);
      this.error=true;
      setTimeout(() => {
      }, 3000);

    }


  }
  salir(){
    this.navCtrl.navigateForward('/main/tiendas');
  }
}
