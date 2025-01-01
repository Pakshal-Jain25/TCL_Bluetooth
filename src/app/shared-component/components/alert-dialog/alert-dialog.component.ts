import { Component, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogActions, MatDialogClose } from "@angular/material/dialog";
import { SharedAlertDialogData } from "../../../interface/shared-alert-dialog-data";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { MatButton } from "@angular/material/button";
import { TranslateModule } from "@ngx-translate/core";



@Component({
    selector: 'shared-alert-dialog',
    templateUrl: './alert-dialog.component.html',
    styleUrls: ['./alert-dialog.component.scss'],
    standalone: true,
    imports: [CdkScrollable, MatDialogContent, MatDialogActions, MatButton, MatDialogClose, TranslateModule]
})
export class SharedAlertDialogComponent {
    data = inject<SharedAlertDialogData>(MAT_DIALOG_DATA);
}