import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";










const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('../../new-installation.component').then(m => m.NewInstallationComponent),
        children: [
            {
                path: '',
                redirectTo: 'select-hierarchy',
                pathMatch: 'full'
            },
            {
                path: 'select-hierarchy',
                loadComponent: () => import('../../component/select-hierarchy/select-hierarchy.component').then(m => m.NewInstallationSelectHierarchyComponent)
            },
            {
                path: 'select-hierarchy/:id',
                loadComponent: () => import('../../component/select-hierarchy/select-hierarchy.component').then(m => m.NewInstallationSelectHierarchyComponent)
            },
            {
                path: 'device-details',
                loadComponent: () => import('../../component/device-details/device-details.component').then(m => m.NewInstallationDeviceDetailsComponent)
            },
            {
                path: 'pole-details',
                loadComponent: () => import('../../component/pole-details/pole-details.component').then(m => m.NewInstallationPoleDetailsComponent)
            },
            {
                path: 'led-load-details',
                loadComponent: () => import('../../component/led-load-details/led-load-details.component').then(m => m.NewInstallationLedLoadDetailsComponent)
            },
            {
                path: 'device-communication-test',
                loadComponent: () => import('../../component/device-communication-test/device-communication-test.component').then(m => m.NewInstallationDeviceCommunicationTestComponent)
            },
            {
                path: 'location',
                loadComponent: () => import('../../component/location/location.component').then(m => m.NewInstallationLocationComponent)
            },
            {
                path: 'preview',
                loadComponent: () => import('../../component/preview/preview.component').then(m => m.NewInstallationPreviewComponent)
            }
        ]
    }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NewInstallationRoutingModule { }