import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Routing } from "../../../pages/routing";


const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('../../layout.component').then(m => m.LayoutComponent),
        children: Routing
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}