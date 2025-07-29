import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransfiriendoPageRoutingModule } from './transfiriendo-routing.module';

import { TransfiriendoPage } from './transfiriendo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransfiriendoPageRoutingModule
  ],
  declarations: [TransfiriendoPage]
})
export class TransfiriendoPageModule {}
