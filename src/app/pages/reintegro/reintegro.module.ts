import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReintegroPageRoutingModule } from './reintegro-routing.module';

import { ReintegroPage } from './reintegro.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReintegroPageRoutingModule,
    ComponentsModule    
  ],
  declarations: [ReintegroPage]
})
export class ReintegroPageModule {}
