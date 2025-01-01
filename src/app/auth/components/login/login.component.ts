import { Component, OnInit, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router, RouterLink } from "@angular/router";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { Observable, take } from "rxjs";
import { AuthTermAndConditionComponent } from "../terms-and-condition/terms-and-condition.component";
import { AuthService } from "../../../services/auth/auth.service";
import { LoginData } from "../../../interface/login-data";
import { DialogService } from "../../../services/dialog/dialog.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from "../../../services/toast/toast.service";
import { NewInstallationService } from "../../../services/new-installation/new-installation.service";
import { MatFormField, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";
import { MatRipple, MatOption } from "@angular/material/core";
import { MatSelect } from "@angular/material/select";
import { MatButton } from "@angular/material/button";

@Component({
    selector: 'auth-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatIcon, MatSuffix, MatRipple, RouterLink, MatSelect, MatOption, MatButton, TranslateModule]
})
export class AuthLoginComponent implements OnInit {
    private router = inject(Router);
    private dialogService = inject(DialogService);
    private translate = inject(TranslateService);
    private authService = inject(AuthService);
    private dialog = inject(MatDialog);
    private spinner = inject(NgxSpinnerService);
    private toast = inject(ToastService);
    private newInstallationService = inject(NewInstallationService);


    /** Boolean value to decide weather to show or hide password in password input box */
    showPassword: boolean = false;
    passwordAutoComplete: string = 'current-password';
    userNameAutoComplete: string = 'username';

    /**
     * Reactive form for userLogin
     */
    loginForm: FormGroup = new FormGroup({
        'userName': new FormControl(),
        'password': new FormControl(),
        'language': new FormControl('en'),
        'rememberPassword': new FormControl()
    })

    ngOnInit(): void {
        this.getCsrfToken();
        this.watchForLanguageChange();
        this.watchForRememberPasswordChange();
    }

    /**
     * @description 
     * Watches for every changes done in the value of language field 
     * of loginForm and changes the global language of entire application
     */
    watchForLanguageChange = () => {
        // let selectedLanguage = localStorage.getItem('selected_language');
        this.loginForm.get('language')?.patchValue(localStorage.getItem('selected_language'));
        this.loginForm.get('language')?.valueChanges.subscribe((val: string) => {
            /**
             * accessing to `use()` method of translateService in Global TranslateModule of `@ngx-translate/core` Package
             */
            this.translate.use(val).subscribe(() => {
                localStorage.setItem('selected_language', val);
                document.querySelector('html')?.setAttribute('dir', (val === 'ar') ? 'rtl' : 'ltr');
            })
        })
    }

    /**
     * @description 
     * makes a call to `getCsrfToken();` method on `AuthService` and sets the
     *  csrf token received from server to localStorage for further use
     */
    getCsrfToken = () => {
        this.authService.getCsrfToken().pipe(take(1)).subscribe((res: any) => {
            if (res.csrfToken) localStorage.setItem('csrfToken', res.csrfToken);
        })
    }

    /** 
     * @description 
     * Called automatically when Login button clicked by user after successfully filling his/her credential required for login.
     * If user didn't Enter any of `username` of `password` field it will show an alert dialog respective to that
     * And call the `login();` method to continue further login process if csrfToken is available or 
     * call the `getCsrfToken();` method to get csrfToken from server
     */
    onSubmit = () => {
        let { userName, password } = this.loginForm.value;
        if (!userName) {
            this.translate.get('auth').pipe(take(1)).subscribe(({ login }) => {
                let { error } = login;
                this.dialogService.openAlertDialog({ content: error.please_enter_userName })
            })
        }
        else if (!password) {
            this.translate.get('auth').pipe(take(1)).subscribe(({ login }) => {
                let { error } = login;
                this.dialogService.openAlertDialog({ content: error.please_enter_password })
            })
        }
        else {
            let loginData = {
                userName: this.loginForm.get('userName')?.value,
                password: this.loginForm.get('password')?.value
            };
            let csrfToken = localStorage.getItem('csrfToken') as string;
            if (csrfToken) this.login(loginData);
            else {
                this.dialogService.openAlertDialog({ content: 'Kiendly refresh to login' }).subscribe(() => {
                    this.getCsrfToken();
                })
            };

        }


        // this.openTermsAndConditionDialog();
    }

    /**
     * @description
     * Starts the actual login process by making call to Server with the user credential/data passed as argument to this function.
     * and handles variout error senario like :-
     * - User first time login
     * - Requesting user to accept terms and condition
     * - Requesting user to change password on first time login
     * - Requesting user to change password if password is expired
     * - So On..
     * 
     * @param loginData Object which contains user credential entered in login form by user
     */
    login = (loginData: LoginData) => {
        this.spinner.show();

        this.authService.login(loginData).pipe(take(1)).subscribe((res: any) => {
            if (res.status === 200) {
                this.newInstallationService.formData = {}
                let { data } = res;
                localStorage.setItem('auth_token', data.token);
                delete data.token;
                localStorage.setItem('userData', JSON.stringify(data));
                this.toast.show({ text: 'successfully_logged_in' }).subscribe();
                this.router.navigate(['/home']);
            }
            else if (
                res.status === 502 &&
                [
                    "يرجى تغيير كلمة المرور الحالية الخاصة بك للمتابعة",
                    'Please change your current password to proceed'
                ].includes(res.message)
            ) {

                this.router.navigate(['/auth', 'change-password']);
            }
            else if (
                res.status === 502 &&
                [
                    'Your password has expired, please change to proceed',
                    "لقد انتهت صلاحية كلمة المرور الخاصة بك ، يرجى التغيير للمتابعة",
                ].includes(res.message)
            ) {
                let ok_btn = this.translate.instant('newInstallation.ok_btn')
                this.dialogService.openConfirmationDialog({ content: res.message, acceptButtonLabel: ok_btn }).subscribe((res) => {
                    if (res.confirm) {
                        this.router.navigate(['/auth', 'change-password']);
                    }
                });
            }
            else if (res.status === 502) {
                let ok_btn = this.translate.instant('newInstallation.ok_btn')
                this.dialogService.openConfirmationDialog({ content: res.message, acceptButtonLabel: ok_btn }).subscribe((res) => {
                    if (res.confirm) {
                        this.login({ ...loginData, confirmationMessage: true });
                    }
                    else {
                        this.getCsrfToken();
                    }
                })
            }
            else if (res.status === 400 && res.message === 'validate privicy' || res.message === "التحقق من صحة الخصوصية") {
                this.openTermsAndConditionDialog().subscribe((res) => {
                    if (res.confirm) {
                        this.login({ ...loginData, tncAccepted: res.confirm });
                    }
                    else {
                        this.getCsrfToken();
                    }
                })
            }
            else if (res.status === 400) {
                this.dialogService.openAlertDialog({ content: res.message }).subscribe(() => {
                    this.getCsrfToken();
                })
            }
            else {
                this.dialogService.openAlertDialog({ content: res.message });
            }
            this.spinner.hide();
        })
    }

    /**
     * @description Trigger Terms and condition dialog to open and return Observable with Object consisting confirm property.
     * @returns Observable 
     * @type {confirm: Boolean}
     */
    openTermsAndConditionDialog = (): Observable<{ confirm: boolean }> => {
        let direction = document.querySelector('html')?.getAttribute('dir');
        const dialogRef = this.dialog.open(AuthTermAndConditionComponent, {
            autoFocus: false,
            disableClose: true,
            direction: direction as "ltr" | "rtl",
            hasBackdrop: true
        });

        return dialogRef.afterClosed().pipe(take(1));
    }

    /**
     * @description Listen to every value change for remember field in loginForm 
     * and change the autocomplete value of password field to trigger the native 
     * save password functionality
     */
    watchForRememberPasswordChange = () => {
        this.loginForm.get('remember')?.valueChanges.subscribe((res: any) => {
            if (res === true) {
                this.passwordAutoComplete = 'current-password';
            }
            else {
                this.passwordAutoComplete = 'new-password';
            }
        })
    }

}