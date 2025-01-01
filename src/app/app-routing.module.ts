import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ifAuthentication } from './guard/authenticated/authenticated.guard';
import { ifNotAuthentication } from './guard/unAuthenticated/unAuthenticated.guard';
import { BluetoothDeviceConnectionComponent } from './testing/bluetooth-device-connection/bluetooth-device-connection.component';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared-component/components/splash-screen/splash-screen.component').then(m => m.SharedSplashScreenComponent)
  },
  // {
  //   path: 'bluetooth-device',
  //   component: BluetoothDeviceConnectionComponent
  // },
  {
    path: 'home',
    canActivate: [ifAuthentication],
    loadChildren: () => {
      return import('./layout/layout.module').then((m) => m.LayoutModule);
    }
  },
  {
    path: 'auth',
    canActivate: [ifNotAuthentication],
    loadChildren: () => {
      return import('./auth/auth.module').then((m) => m.AuthModule);
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
