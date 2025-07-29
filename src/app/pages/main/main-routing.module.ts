import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/main/tiendas',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'tiendas',
        loadChildren: () => import('../tiendas/tiendas.module').then(m => m.TiendasPageModule)
      },
      {
        path: 'test',
        loadChildren: () => import('../test/test.module').then(m => m.TestPageModule)
      },
      {
        path: 'reintegro',
        loadChildren: () => import('../reintegro/reintegro.module').then(m => m.ReintegroPageModule)
      },
      {
        path: 'pagos',
        loadChildren: () => import('../pagos/pagos.module').then( m => m.PagosPageModule)
      },    
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
