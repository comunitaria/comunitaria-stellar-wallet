import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TiendasPageRoutingModule } from './tiendas-routing.module';

import { TiendasPage } from './tiendas.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TiendasPageRoutingModule,
    ComponentsModule
  ],
  declarations: [TiendasPage]
})
export class TiendasPageModule {}
