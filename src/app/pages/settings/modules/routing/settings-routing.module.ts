import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";





const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('../../settings.component').then(m => m.SettingsComponent),
        children: [
            {
                path: '',
                redirectTo: 'profile',
                pathMatch: 'full'
            },
            {
                path: 'profile',
                loadComponent: () => import('../../components/profile/profile.component').then(m => m.SettingsProfileComponent)
            },
            {
                path: 'terms-and-condition',
                loadComponent: () => import('../../components/terms-and-condition/terms-and-condition.component').then(m => m.SettingsTermsAndConditionComponent)
            },
            {
                path: 'change-password',
                loadComponent: () => import('../../components/change-password/change-password.component').then(m => m.SettingsChangePasswordComponent)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingsRoutingModule { }