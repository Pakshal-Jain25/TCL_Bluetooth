import { Component, inject } from "@angular/core";
import { MatDialogRef, MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { MatButton } from "@angular/material/button";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: 'shared-logout-dialog',
    templateUrl: './logout-dialog.component.html',
    styleUrls: ['./logout-dialog.component.scss'],
    standalone: true,
    imports: [CdkScrollable, MatDialogContent, MatDialogActions, MatButton, TranslateModule]
})
export class SharedLogoutDialogComponent {
    private dialog = inject<MatDialogRef<SharedLogoutDialogComponent>>(MatDialogRef);


    closeDialog = (data: boolean) => {
        this.dialog.close(data)
    }
}