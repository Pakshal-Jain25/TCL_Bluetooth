import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, take, tap } from 'rxjs';
import { Router } from '@angular/router';
import { DialogService } from '../../services/dialog/dialog.service';
import { AuthService } from '../../services/auth/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../../services/toast/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { urlConstants } from '../../constants/url/url-constants';
import { App } from '@capacitor/app';

@Injectable()
export class BaseInterceptorInterceptor implements HttpInterceptor {
  private dialogService = inject(DialogService);
  private authService = inject(AuthService);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private sslCertificateCheckerResult: boolean = urlConstants.SSL_CERTIFICATE_FINGERPRINT ? false : true;   // If SSL Certificate fingerprint is not available that means application is running in development/testing mode

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {

    
    let auth_token: string = localStorage.getItem('auth_token') || '0';
    let currentLang: string = localStorage.getItem('selected_language') || 'en';
    const isSslCertificateCheckerAvailable: boolean = (window as any).plugins && (window as any).plugins.sslCertificateChecker;

    let reqCopy = request.clone(
      {
        setHeaders: {
          'accept-Language': currentLang,
          'login-type': 'MOBILE',
          'Authorization': auth_token,
          'accept': 'application/json'
        }
      }
    );

    if (isSslCertificateCheckerAvailable && urlConstants.SSL_CERTIFICATE_FINGERPRINT) {
      (window as any).plugins.sslCertificateChecker.check(this.sslCertificateCheckerSuccess, this.sslCertificateCheckerError, urlConstants.BASE_URL, urlConstants.SSL_CERTIFICATE_FINGERPRINT);
    }

    // console.log(reqCopy.headers.get('Content-Type'));

    // request.headers.set('Content-Type', 'application/json; carset=utf-8');

    // request.headers.set('Accept-Language', this.translate.currentLang);

    // request.headers.set('login-type', "MOBILE");

    // let auth_token: string = localStorage.getItem('auth_token') || '0';

    // request.headers.set('Authorization', auth_token);



    return next.handle(reqCopy).pipe(
      tap({
        next: (response) => {
          if (this.sslCertificateCheckerResult) return response;
          else return undefined;
        },
        error: (error) => {
          if (error.error.message === 'Token Expired') {
            this.spinner.hide();
            // this.dialogService.openAlertDialog({ content: "User session expired. Please login again to continue." }).pipe(take(1)).subscribe(() => {
              this.spinner.show();
              this.authService.logout().pipe(take(1)).subscribe((res: any) => {
                if (res.status === 200) {
                  this.dialogService.closeAllDialog();
                  this.toast.show({ text: 'User Session Timeout' });
                  localStorage.removeItem('auth_token')
                  localStorage.removeItem('userData')
                  this.toast.show({ text: 'user_session_timeout' }).subscribe();
                  this.router.navigate(['/auth'])
                }
                this.spinner.hide();
              });
            // })
          }
        }
      })
    );
  }

  private sslCertificateCheckerSuccess = () => {
    this.sslCertificateCheckerResult = true;
    return true;
  }

  private sslCertificateCheckerError = (message: string) => {
    this.sslCertificateCheckerResult = false;
    if (message === "CONNECTION_NOT_SECURE") {
      // There is likely a man in the middle attack going on, be careful!
      alert("SSL mismatch");
    } else if (message.indexOf("CONNECTION_FAILED") > - 1) {
      // There was no connection (yet). Internet may be down. Try again (a few times) after a little timeout.
      alert("Unable to determine if the connection is secure or not. Please try after some time");
    };
    App.exitApp();
  }
}
