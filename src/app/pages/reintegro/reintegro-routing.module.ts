import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReintegroPage } from './reintegro.page';

const routes: Routes = [
  {
    path: '',
    component: ReintegroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReintegroPageRoutingModule {}
