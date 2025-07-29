import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { StellarService } from 'src/app/services/stellar.service';
import { ComunitariaService } from 'src/app/services/comunitaria.service';
import { interval, Observable } from 'rxjs';

@Component({
  selector: 'app-inicial',
  templateUrl: './inicial.page.html',
  styleUrls: ['./inicial.page.scss'],
})
export class InicialPage implements OnInit {
private hayLogin:boolean=false;
private iniciado:boolean=false;
private periodico:Observable<number>;
public cargada:boolean=false;

  constructor(
    private navCtrl: NavController,
    private estado: StorageService,
    private loadingCtrl: LoadingController,
    private comunitaria: ComunitariaService
  ) { 
    this.periodico=interval(1000);
  }

  //--------------------------------------------------------------------------------------------------


  //--------------------------------------------------------------------------------------------------

  ngOnInit() {
    this.iniciar();
    const ciclo=this.periodico.subscribe((intervalos)=>{
      if (this.iniciado&&(intervalos>6)){
        ciclo.unsubscribe();
        this.navCtrl.navigateForward(this.hayLogin?'/main'+(this.estado.usuario.clase=='comercio'?'/test':''):'/login');
      }
    });
    
  }


  async iniciar() {
    // Cargamos los parámetros si existen
    console.log('Inicio');
    //try{
      await this.estado.cargar();
      console.log('Cargado');
    // }
    // catch(error){
    //   console.log('hay error');
    // }
   // console.log("el parametro", parametros);
    if (!this.estado.hayUsuario) {
        console.log('No hay usuario, a login');
        // No sabemos el último usuario que entró, nos vamos a la ventana de login

    } else {
        try{
          console.log('Hay usuario, a main',this.estado.usuario);
          await this.comunitaria.actualizaMisDatos(true);
          console.log('Tras actualizar datos');
          this.hayLogin=true;
        }
        catch(error){
          console.log("Error el usuario no existe",error);
        }
    }
    this.iniciado=true;
  }
}
