import { Component, inject } from "@angular/core";
import { MatDialogRef, MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { MatIcon } from "@angular/material/icon";
import { MatButton } from "@angular/material/button";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: 'shared-camera-and-gallery-dialog',
    templateUrl: './camera-and-gallery-dialog.component.html',
    styleUrls: ['./camera-and-gallery-dialog.component.scss'],
    standalone: true,
    imports: [CdkScrollable, MatDialogContent, MatIcon, MatDialogActions, MatButton, TranslateModule]
})
export class SharedCameraAndGalleryDialogComponent {
    private dialogRef = inject<MatDialogRef<SharedCameraAndGalleryDialogComponent>>(MatDialogRef);


    dismissDialog = (selection: string) => {
        this.dialogRef.close(selection);
    }
 }