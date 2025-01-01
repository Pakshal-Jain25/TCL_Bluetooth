import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { NgxSpinnerService } from "ngx-spinner";
import { take } from "rxjs";
import { passwordMatchValidator } from "../../../custome-validators/password-match-validator";
import { AuthService } from "../../../services/auth/auth.service";
import { DialogService } from "../../../services/dialog/dialog.service";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";

@Component({
    selector: 'auth-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatButton, MatIconButton, RouterLink, MatIcon, TranslateModule]
})
export class AuthChangePasswordComponent {
    private authService = inject(AuthService);
    private router = inject(Router);
    private dialogService = inject(DialogService);
    private spinner = inject(NgxSpinnerService);
    private translate = inject(TranslateService);


    /**
     * change password reactive form with custome new password and confirm password field camparison validator `passwordMatchValidator();`
     */
    changePasswordForm: FormGroup = new FormGroup({
        'userName': new FormControl(),
        'currentPassword': new FormControl(),
        'newPassword': new FormControl(),
        'confrimPassword': new FormControl()
    }, { validators: passwordMatchValidator('newPassword', 'confrimPassword')})

    /**
     * @description
     * 
     * when changePasswordForm get submitted it get called automatically and check whether all
     * the field are filled by user or not and trigger alert dialog with appropiate message
     * And Makes call to the changePassword API with the data filed in changePassword form and
     * handle the response received from server
     */
    onSubmit = () => {
        let { userName, currentPassword, newPassword, confrimPassword } = this.changePasswordForm.value;
        if (!userName) {
            let errormessage = this.translate.instant('auth.change_password.error.enter_username');
            this.dialogService.openAlertDialog({ content: errormessage });
        }
        else if (!currentPassword) {
            let errormessage = this.translate.instant('auth.change_password.error.enter_current_password');
            this.dialogService.openAlertDialog({ content: errormessage });
        }
        else if (!newPassword) {
            let errormessage = this.translate.instant('auth.change_password.error.enter_new_password');
            this.dialogService.openAlertDialog({ content: errormessage });
        }
        else if (!confrimPassword) {
            let errormessage = this.translate.instant('auth.change_password.error.enter_confirm_password');
            this.dialogService.openAlertDialog({ content: errormessage });
        }
        else if (this.changePasswordForm.errors?.['passwordsDontMatch']) {
            let errormessage = this.translate.instant('auth.change_password.error.new_password_and_confirm_password_mismatch');
            this.dialogService.openAlertDialog({ content: errormessage });
        }
        else {
            this.spinner.show();
            this.authService.changePassword(this.changePasswordForm.value).pipe(take(1)).subscribe((res: any) => {
                if (res.status === 200) {
                    this.dialogService.openConfirmationDialog({ content: res.message, okayButton: true, tickIcon: true }).subscribe(() => {
                        this.router.navigate(['/auth', 'login']);
                    });
                }
                else {
                    this.dialogService.openAlertDialog({ content: res.message });
                }
                this.spinner.hide();
            })
        }
    }



}