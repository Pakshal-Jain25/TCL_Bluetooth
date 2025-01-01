import { Location } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { App } from '@capacitor/app';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
import { DialogService } from './services/dialog/dialog.service';
import { HeaderService } from './services/header/header.service';
import { NgxSpinnerModule } from 'ngx-spinner';

declare var IRoot: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, NgxSpinnerModule]
})
export class AppComponent implements OnInit {
  private translate = inject(TranslateService);
  private router = inject(Router);
  private location = inject(Location);
  private headerService = inject(HeaderService);
  private dialogService = inject(DialogService);

  title = 'FEApplication';
  history: string[] = [];

  constructor() {
    const translate = this.translate;

    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('en');
    let selectedLanguage: string = localStorage.getItem('selected_language') || '';
    translate.use(['en', 'ar'].includes(selectedLanguage) ? selectedLanguage : 'en').pipe(take(1)).subscribe(() => {
      localStorage.setItem('selected_language', ['en', 'ar'].includes(selectedLanguage) ? selectedLanguage : 'en');
      document.querySelector('html')?.setAttribute('dir', (selectedLanguage === 'ar') ? 'rtl' : 'ltr');
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
      }
    })
  }

  ngOnInit(): void {
    App.addListener('backButton', () => {
      {
        this.history.pop();
        if (['select-hierarchy', 'profile', 'installation-list', 'login'].includes(this.router.url.split('/').slice(-1)[0])) {
          App.exitApp();
        }
        else if (this.router.url.split('/').slice(-1)[0] === 'location') {
          return; this.openLocationBackAlert();
        }
        else {
          this.location.back();
        }
      }
    })
    document.addEventListener("deviceready", this.checkRootedOrJailbreakDevice, false)
  }

  openLocationBackAlert = () => {
    this.dialogService.locationBackButtonAlert();
    // console.log('Back BUtton Pressed');
    // let ok_btn = this.translate.instant('newInstallation.ok_btn');
    // let message = this.translate.instant('newInstallation.location.back_button_click_confirm_message');
    // this.dialogService.openAlertDialog({ content: message }).pipe(take(1)).subscribe((confirmation) => {
    //   if (confirmation.confirm) {
    //     this.router.navigate(['/home/new-installation', 'select-hierarchy']);
    //   }
    // });
  }

  /**
   * Check if device is rooted or jailbreak and handle them accordingly
   */
  private checkRootedOrJailbreakDevice = () => {
    IRoot.isRooted((status: boolean) => {
      if (status) {
        alert("Your device appears to be rooted or jailbroken. This can pose security risks.");
        App.exitApp();
      };
    }, () => {
      alert("Unable to determine device status");
      App.exitApp();
    });
  }
}
