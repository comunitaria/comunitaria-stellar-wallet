import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import {NativeAudio} from '@capacitor-community/native-audio'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform:Platform) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      // Se elimina back button
     });
     this.platform.ready().then((p) => {
      NativeAudio.preload({ 
        assetId:'pagoRecibido',
        assetPath: 'assets/sonidos/notificacion.mp3',
        isUrl: false,
        volume: 1.0
     })
     .then((e)=>{console.log('e',e)},(f)=>{console.log('f',f)});
   });
  }
}
