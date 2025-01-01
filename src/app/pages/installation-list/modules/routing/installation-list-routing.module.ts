import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";


const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('../../installation-list.component').then(m => m.InstallationListComponent)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InstallationListRoutingModule { }