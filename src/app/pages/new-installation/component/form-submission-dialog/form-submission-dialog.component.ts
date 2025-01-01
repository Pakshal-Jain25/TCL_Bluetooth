import { Component, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogActions, MatDialogClose } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { NewInstallationService } from "../../../../services/new-installation/new-installation.service";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { MatButton } from "@angular/material/button";


@Component({
    selector: 'new-installation-form-submission-dialog',
    templateUrl: './form-submission-dialog.component.html',
    styleUrls: ['./form-submission-dialog.component.scss'],
    standalone: true,
    imports: [CdkScrollable, MatDialogContent, MatDialogActions, MatButton, MatDialogClose, TranslateModule]
})
export class NewInstallationFormSubmissionDialogComponent {
    data = inject(MAT_DIALOG_DATA);
    private router = inject(Router);
    private newInstallationService = inject(NewInstallationService);
    private translet = inject(TranslateService);

   
    message: string = this.data.status === 200 ? this.translet.instant('toast.succsessfully_add') : this.translet.instant('toast.failed');

    nevigetToSelect = () => {
        localStorage.setItem('propertyId', this.newInstallationService.formData.propertyId);
        this.newInstallationService.formData={}
        // this.router.navigate(['/home/new-installation', 'select-hierarchy']);
    }
}