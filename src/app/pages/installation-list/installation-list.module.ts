import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { InstallationListComponent } from "./installation-list.component";

import { InstallationListRoutingModule } from "./modules/routing/installation-list-routing.module";
import { InstallationListDateFilterComponent } from "./components/date-filter/date-filter.component";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { NgxPullToRefreshModule } from 'ngx-pull-to-refresh';
import { InfiniteScrollModule } from "ngx-infinite-scroll";

@NgModule({
    imports: [
    CommonModule,
    InstallationListRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxPullToRefreshModule,
    InfiniteScrollModule,
    InstallationListComponent,
    InstallationListDateFilterComponent
]
})
export class InstallationListModule { }