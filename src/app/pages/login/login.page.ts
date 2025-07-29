import { Component } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';



var md5 = require('md5');

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  {
  nombre: string = 'Login';

  parametros: string = '';
  paso: string = '';
  usuario = {
    nombre: '',
    clave: '',
    email: ''
  }

  
  constructor(
    private estado: StorageService,
    private navCtrl: NavController
  ) { }


  //--------------------------------------------------------------------------------------------------

  async onClick() {
      if (this.usuario.nombre!=''){
        var hayUsuario:boolean=this.estado.activarUsuario(this.usuario.nombre);
        
        if (!hayUsuario) {
          console.log("el usuario no existe");
          let hayError = false;

            this.paso = 'Verificando usuario...';
            this.estado.nuevoUsuario();
            this.estado.usuario.login=this.usuario.nombre;
            this.navCtrl.navigateForward('/password');
          
        } else {
          console.log("el usuario existe", this.usuario.nombre);
          this.navCtrl.navigateForward('/tiendas');
        }
      }
  }

  //--------------------------------------------------------------------------------------------------


}
