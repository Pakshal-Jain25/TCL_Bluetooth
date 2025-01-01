import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { AuthComponent } from "./auth.component";
import { AuthLoginComponent } from "./components/login/login.component";

import { AuthRoutingMoudle } from "./modules/routing/auth-routing.moudle";
import { AuthForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AuthChangePasswordComponent } from "./components/change-password/change-password.component";

import { AuthTermAndConditionComponent } from "./components/terms-and-condition/terms-and-condition.component";
import { TranslateModule } from "@ngx-translate/core";
import { BluetoothDeviceConnectionComponent } from "../testing/bluetooth-device-connection/bluetooth-device-connection.component";

@NgModule({
    imports: [
    CommonModule,
    AuthRoutingMoudle,
    ReactiveFormsModule,
    TranslateModule,
    AuthComponent,
    AuthLoginComponent,
    AuthForgotPasswordComponent,
    AuthChangePasswordComponent,
    AuthTermAndConditionComponent,
    BluetoothDeviceConnectionComponent
],
    providers: []
})
export class AuthModule { }