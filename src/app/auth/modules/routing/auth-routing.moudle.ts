import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";





const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('../../auth.component').then(m => m.AuthComponent),
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            { 
                path: 'login',
                loadComponent: () => import('../../components/login/login.component').then(m => m.AuthLoginComponent)
            },
            {
                path: 'bluetooth-device',
                loadComponent: () => import('../../../testing/bluetooth-device-connection/bluetooth-device-connection.component').then(m => m.BluetoothDeviceConnectionComponent)
            },
            { 
                path: 'forgot-password',
                loadComponent: () => import('../../components/forgot-password/forgot-password.component').then(m => m.AuthForgotPasswordComponent)
            },
            {
                path: 'change-password',
                loadComponent: () => import('../../components/change-password/change-password.component').then(m => m.AuthChangePasswordComponent)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingMoudle { }