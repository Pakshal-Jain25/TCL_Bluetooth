import { Component, OnInit, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { NgxSpinnerService } from "ngx-spinner";
import { take } from "rxjs";
import { urlConstants } from "../../../../constants/url/url-constants";
import { passwordMatchValidator } from "../../../../custome-validators/password-match-validator";
import { SettingsChangePasswrodData } from "../../../../interface/settings-change-password-data";
import { AuthService } from "../../../../services/auth/auth.service";
import { DialogService } from "../../../../services/dialog/dialog.service";
import { HeaderService } from "../../../../services/header/header.service";
import { SettingsService } from "../../../../services/settings/settings.service";
import { NgClass } from "@angular/common";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";

@Component({
    selector: 'settings-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
    standalone: true,
    imports: [NgClass, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatButton, MatIconButton, RouterLink, MatIcon, TranslateModule]
})
export class SettingsChangePasswordComponent implements OnInit {
    private headerService = inject(HeaderService);
    private dialogService = inject(DialogService);
    private settingsService = inject(SettingsService);
    private authService = inject(AuthService);
    private spinner = inject(NgxSpinnerService);
    private router = inject(Router);
    private translate = inject(TranslateService);


    logoSrc: string = urlConstants.LOCAL;

    changePasswordForm: FormGroup = new FormGroup({
        'password': new FormControl(),
        'newPassword': new FormControl(),
        'confirmPassword': new FormControl()
    }, {validators: passwordMatchValidator('newPassword','confirmPassword')})

    ngOnInit(): void {
        this.hideHeader();
    }

    onSubmit = () => {
        let { password, newPassword, confirmPassword } = this.changePasswordForm.value;
        if (!password) {
            let errormessage = this.translate.instant('settings.change_password.error.enter_old_password');
            this.dialogService.openAlertDialog({ content: errormessage });
        }
        else if (!newPassword) {
            let errormessage = this.translate.instant('settings.change_password.error.enter_new_password');
            this.dialogService.openAlertDialog({ content: errormessage });
        }
        else if (!confirmPassword) {
            let errormessage = this.translate.instant('settings.change_password.error.enter_confirm_password');
            this.dialogService.openAlertDialog({ content: errormessage });
        }
        else if (this.changePasswordForm.errors?.['passwordsDontMatch']) {
            let errormessage = this.translate.instant('settings.change_password.error.new_password_and_confirm_password_mismatch');
            this.dialogService.openAlertDialog({ content: errormessage });
        }
        else {
            let { userId } = JSON.parse(localStorage.getItem('userData') as string);
            let changePasswordData: SettingsChangePasswrodData = {
                ...this.changePasswordForm.value,
                userId
            }
            this.spinner.show();
            this.settingsService.changePassword(changePasswordData).pipe(take(1)).subscribe((res: any) => {
                this.spinner.hide();
                if (res.status === 200) {
                    this.dialogService.openConfirmationDialog({ content: res.message,okayButton: true, tickIcon: true}).subscribe(() => {
                        this.logout();
                    });
                }
                else {
                    this.dialogService.openAlertDialog({ content: res.message })
                }
            })
        }
    }

    logout = () => {
        this.spinner.show();
        this.authService.logout().pipe(take(1)).subscribe((res: any) => {
            if (res.status === 200) {
                localStorage.removeItem('auth_token')
                localStorage.removeItem('userData')
                this.router.navigate(['/auth'])
            }
            this.spinner.hide();
        });
    }

    hideHeader = () => {
        this.headerService.updateHeader({ showHeader: false });
    }


}