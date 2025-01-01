import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules

import { LayoutRoutingModule } from './modules/routing/layout-routing.module';

// Component
import { LayoutSidebarComponent } from './conponent/sidebar/sidebar.component';
import { LayoutComponent } from './layout.component';
import { LayoutHeaderComponent } from './conponent/header/header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
    imports: [
    CommonModule,
    LayoutRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    LayoutComponent,
    LayoutSidebarComponent,
    LayoutHeaderComponent
]
})
export class LayoutModule { }
