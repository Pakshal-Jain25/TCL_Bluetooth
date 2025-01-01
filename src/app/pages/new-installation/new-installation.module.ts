import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { NewInstallationRoutingModule } from "./module/routing/new-installation-routing.module";

import { NewInstallationComponent } from "./new-installation.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NewInstallationSelectHierarchyComponent } from "./component/select-hierarchy/select-hierarchy.component";
import { NewInstallationSelectHierarchySearchDialogComponent } from "./component/select-hierarchy-search-dialog/select-hierarchy-search-dialog.component";
import { NewInstallationDeviceDetailsComponent } from "./component/device-details/device-details.component";
import { NewInstallationPoleDetailsComponent } from "./component/pole-details/pole-details.component";
import { NewInstallationLedLoadDetailsComponent } from "./component/led-load-details/led-load-details.component";
import { NewInstallationDeviceCommunicationTestComponent } from "./component/device-communication-test/device-communication-test.component";
import { NewInstallationLocationComponent } from "./component/location/location.component";
import { NewInstallationDeviceCommunicationTestDialogComponent } from "./component/device-communication-test-dialog/device-communication-test-dialog.component";
import { NewInstallationPreviewComponent } from "./component/preview/preview.component";
import { NewInstallationFormSubmissionDialogComponent } from "./component/form-submission-dialog/form-submission-dialog.component";


@NgModule({
    imports: [
    CommonModule,
    TranslateModule,
    NewInstallationRoutingModule,
    ReactiveFormsModule,
    NewInstallationComponent,
    NewInstallationSelectHierarchyComponent,
    NewInstallationSelectHierarchySearchDialogComponent,
    NewInstallationDeviceDetailsComponent,
    NewInstallationPoleDetailsComponent,
    NewInstallationLedLoadDetailsComponent,
    NewInstallationDeviceCommunicationTestComponent,
    NewInstallationLocationComponent,
    NewInstallationDeviceCommunicationTestDialogComponent,
    NewInstallationPreviewComponent,
    NewInstallationFormSubmissionDialogComponent
]
})
export class NewInstallationModule { }