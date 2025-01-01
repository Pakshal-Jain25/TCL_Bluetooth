import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

import { SettingsProfileComponent } from "./components/profile/profile.component";
import { SettingsTermsAndConditionComponent } from "./components/terms-and-condition/terms-and-condition.component";

import { SettingsRoutingModule } from "./modules/routing/settings-routing.module";
import { SettingsComponent } from "./settings.component";
import { SettingsChangePasswordComponent } from "./components/change-password/change-password.component";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";


@NgModule({
    imports: [CommonModule,
    SettingsRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    SettingsComponent,
    SettingsProfileComponent,
    SettingsTermsAndConditionComponent,
    SettingsChangePasswordComponent], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class SettingsModule {}