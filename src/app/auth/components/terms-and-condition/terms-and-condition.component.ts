import { Component, OnInit, ViewChild, inject } from "@angular/core";
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { TranslateService, TranslatePipe, TranslateModule } from "@ngx-translate/core";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { MatButton } from "@angular/material/button";
import { SafePipe } from "../../../shared-component/pipe/safe.pipe";

@Component({
    selector: 'auth-terms-and-condition',
    templateUrl: './terms-and-condition.component.html',
    styleUrls: ['./terms-and-condition.component.scss'],
    standalone: true,
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MatButton, SafePipe, TranslateModule]
})
export class AuthTermAndConditionComponent implements OnInit {
    private translateService = inject(TranslateService);
    protected sanitizer = inject(DomSanitizer);
    private dialogRef = inject<MatDialogRef<AuthTermAndConditionComponent>>(MatDialogRef);


    termsAndConditionContent: string[] = [];

    ngOnInit(): void {
        this.getTranslatedTermsAndConditionContent();
    }

    /**
     * @description
     * 
     * Get all the text data available for translation of terms and condition and assign them to `termsAndConditionContent`.
     */
    getTranslatedTermsAndConditionContent = () => {
        this.translateService.get('termsAndCondition').subscribe(({body}) => {
            this.termsAndConditionContent = [...body];
            console.log(this.termsAndConditionContent);
        })
    }

    /** Close dialog and return a message depends on whether user accepted the Terms and condition */
    accept = () => {
        this.dialogRef.close({ confirm: true });
    }
    
    /** Close dialog and return a message depends on whether user accepted the Terms and condition */
    cancel = (): void => {
        this.dialogRef.close({confirm: false})
    }



}