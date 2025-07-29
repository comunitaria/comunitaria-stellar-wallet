import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { timer } from 'rxjs';
import { ComunitariaService } from 'src/app/services/comunitaria.service';
import { StellarService } from 'src/app/services/stellar.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})
export class PasswordPage {

  
  nombre: string = 'Login';

  textoPaso: string = '';
  paso:number=0;
  cuadroCheck:string='';
  usuario = {
    nombre: '',
    clave: '',
    email: ''
  }

  
  constructor(
    private comunitaria: ComunitariaService,
    private estado: StorageService,
    private stellar: StellarService,
    private navCtrl: NavController
  ) { 
    
  }

  ionViewWillEnter(){
    this.paso=0;
  }

  async onClick() {

    let hayError: boolean = false;
    
        console.log("el usuario no existe");
    
        // Creamos la cuenta 
        try {
          this.paso=1;
          this.textoPaso = 'Verificando usuario...';
          this.estado.usuario.password=this.usuario.clave;
          await this.comunitaria.actualizaMisDatos(true);
          this.paso=2;
          this.textoPaso = 'Solicitando monedero...';
          await this.stellar.nuevaCuenta();
          await this.comunitaria.registrarCuenta();
          var intentos=0;
          while(this.estado.usuario.monedero.cuenta.estado!='autorizada'){
            intentos++;
            if (intentos>5) break; //Puede haber un intento inicial fallido, por token caducado
            switch (this.estado.usuario.monedero.cuenta.estado){
              case 'local':
                this.comunitaria.token=''; //Token caducado? se solicita uno nuevo
                this.paso=2;
                this.textoPaso = 'Solicitando monedero...';
                await this.comunitaria.registrarCuenta();
                break;
              case 'creada':
                this.paso=3;
                this.textoPaso = 'Abriendo conexión...';
                await this.stellar.lineaConfianza();
                break;
              case 'trustline':
                this.paso=4;
                this.textoPaso = 'Solicitando autorización...';
                await this.comunitaria.autorizarCuenta();
                break;
            }
          }
          this.estado.archivaUsuarios();
          this.paso=5;
          this.textoPaso = 'Monedero operativo!';
          setTimeout(()=>{
            this.paso=6;
            setTimeout(()=>{
              this.navCtrl.navigateForward('/main/tiendas');
            },3000);
            
          },2000);
          
        } catch (error) {
          this.paso=-1;
          this.textoPaso = "Error creando cuenta de usuario"
          setTimeout(()=>{
            this.paso=0;
          },5000);
          hayError = true;
          console.log(error);
        }
          
  }

  //--------------------------------------------------------------------------------------------------



}
