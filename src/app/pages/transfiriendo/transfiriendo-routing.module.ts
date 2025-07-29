import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransfiriendoPage } from './transfiriendo.page';

const routes: Routes = [
  {
    path: '',
    component: TransfiriendoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransfiriendoPageRoutingModule {}
