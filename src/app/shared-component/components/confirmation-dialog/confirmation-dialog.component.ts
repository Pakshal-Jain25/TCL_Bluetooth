import { ChangeDetectorRef, Component, OnInit, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import { SharedConfirmationDialogData } from "../../../interface/shared-confirmation-dialog-data";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { MatButton } from "@angular/material/button";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: 'shared-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss'],
    standalone: true,
    imports: [CdkScrollable, MatDialogContent, MatDialogActions, MatButton, TranslateModule]
})
export class SharedConfirmationDialogComponent implements OnInit {
    private dialogRef = inject<MatDialogRef<SharedConfirmationDialogComponent>>(MatDialogRef);
    data = inject<SharedConfirmationDialogData>(MAT_DIALOG_DATA);
    private _cd = inject(ChangeDetectorRef);
 

    acceptButtonLabel: string = this.data.acceptButtonLabel || 'Accept';

    ngOnInit(): void {
    }

    confirm = () => {
        this.dialogRef.close({ confirm: true });
    }

    cancle = () => {
        this.dialogRef.close({ confirm: false });
    }
}