import { Component, EventEmitter, OnInit, Output, inject } from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { take } from "rxjs";
import { AuthService } from "../../../services/auth/auth.service";
import { DialogService } from "../../../services/dialog/dialog.service";
import { NewInstallationService } from "../../../services/new-installation/new-installation.service";
import { SettingsService } from "../../../services/settings/settings.service";
import { ToastService } from "../../../services/toast/toast.service";
import { MatRipple } from "@angular/material/core";
import { MatIcon } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: 'layout-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    standalone: true,
    imports: [RouterLink, RouterLinkActive, MatRipple, MatIcon, TranslateModule]
})
export class LayoutSidebarComponent implements OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);
    private spinner = inject(NgxSpinnerService);
    private settingsService = inject(SettingsService);
    private dialog = inject(DialogService);
    private toast = inject(ToastService);
    private newInstallation = inject(NewInstallationService);


    userData: any;
    profileImageUrl!: string;

    @Output() drawer: EventEmitter<null> = new EventEmitter
    projectName: any;

    ngOnInit(): void {
        this.getUserData();
        this.getProjectDetails();
        this.getUserProfilePicture();
        this.profilePhotoUpdateListener();
    }

    closeDrawer = () => {
        this.drawer.emit();
    }

    getUserData = () => {
        this.userData = JSON.parse(localStorage.getItem('userData') as string);
    }

    getUserProfilePicture = (imageToken?: string) => {
        let userData = JSON.parse(localStorage.getItem('userData') as string);
        let profilePicture = imageToken || userData.profilePicture;
        this.settingsService.getUserProfileImage(profilePicture).pipe(take(1)).subscribe((res: any) => {
            if(profilePicture) this.profileImageUrl = res;
        })
    }
    private getProjectDetails = () =>{
        this.newInstallation.getProjectDetails().pipe(take(1)).subscribe((res:any)=>{
            this.newInstallation.projectDetails = res.data
            this.projectName = res.data.created.projectMetaList[0].projectName
    
        })
    }
    logout = () => {
        this.dialog.logoutDialog().subscribe((res: boolean) => {
            if (res) {
                this.newInstallation.formData ={}
                this.spinner.show();
                this.authService.logout().pipe(take(1)).subscribe((res: any) => {
                    if (res.status === 200) {
                        localStorage.removeItem('auth_token')
                        localStorage.removeItem('userData')
                        this.toast.show({ text: 'successfully_logged_out' }).subscribe();
                        this.router.navigate(['/auth']);
                    }
                    this.spinner.hide();
                });
            }
        })
    }

    profilePhotoUpdateListener = () => {
        this.settingsService.profilePhotoUpdateListener().subscribe((res: string) => {
            this.getUserProfilePicture(res);
        })
    }
}