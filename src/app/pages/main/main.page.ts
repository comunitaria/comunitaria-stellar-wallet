import { Component, OnInit } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { ComunitariaService } from 'src/app/services/comunitaria.service';
import { StellarService } from 'src/app/services/stellar.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage  {

  balanceLocal : Observable<any> = new Observable<any>;

  constructor(public estado: StorageService) { }
  
  ionViewWillEnter() {
    console.log('entra en  main');
      

}
      
    
  

}
