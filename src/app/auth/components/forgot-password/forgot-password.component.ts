import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { take } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';
import { DialogService } from '../../../services/dialog/dialog.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'auth-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatButton, MatIconButton, RouterLink, MatIcon, TranslateModule]
})
export class AuthForgotPasswordComponent {
  private authService = inject(AuthService);
  private dialogService = inject(DialogService);
  private rotuer = inject(Router);
  private spinner = inject(NgxSpinnerService);
  private translate = inject(TranslateService);

  // username = new FormControl('');

  forgotPasswordForm: FormGroup = new FormGroup({
    'userName': new FormControl()
  })

  /**
   * @description whenever the user enter the username in forgotPasswordForm and Click on submit button this
   *  function automatically get called and send a request to server with the username as data and handle
   *  variout success and error response senario :-
   * 
   *  - Username field not is empty
   *  - If the request get accepted from server
   *  - If request rejected by server for any reason display the alert Dialog for respective error.
   */
  onSubmit = () => {
    let { userName } = this.forgotPasswordForm.value;
    if (!userName) {
      this.translate.get('auth').pipe(take(1)).subscribe(({ forgot_password }) => {
        let { error } = forgot_password;
        this.dialogService.openAlertDialog({ content: error.please_enter_userName });
      })
    }
    else {
      this.spinner.show();
      this.authService.forgotPassword(this.forgotPasswordForm.value).pipe(take(1)).subscribe((res: any) => {
        if (res.status === 200) {
          this.dialogService.openConfirmationDialog({ content: res.message, okayButton: true }).pipe(take(1)).subscribe(() => {
            this.rotuer.navigate(['/auth', 'login']);
          })
        }
        else {
          this.dialogService.openAlertDialog({ content: res.message });
        }
        this.spinner.hide();
      })
    }
  }
}
