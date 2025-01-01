import { Routes } from "@angular/router";

const Routing: Routes = [
    // Define routes with lazy loading for the modules declared in pages Folder
    {
        path: '',
        redirectTo: 'new-installation',
        pathMatch: 'full'
    },
    {
        path: 'settings', 
        loadChildren: () => {
            return import('./settings/settings.module').then((m) => m.SettingsModule);
        }
    },
    {
        path: 'installation-list',
        loadChildren: () => {
            return import('./installation-list/installation-list.module').then((m) => m.InstallationListModule);
        }
    },
    

    {
        path: 'new-installation',
        loadChildren: () => {
            return import('./new-installation/new-installation.module').then((m) => m.NewInstallationModule);
        }
    }

    
];

export { Routing };