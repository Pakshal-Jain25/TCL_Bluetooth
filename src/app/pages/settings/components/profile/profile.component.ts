import { HttpClient } from "@angular/common/http";
import { Component, OnInit, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { Camera, CameraResultType, CameraSource, Photo } from "@capacitor/camera";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { NgxSpinnerService } from "ngx-spinner";
import { from, take } from "rxjs";
import { DialogService } from "../../../../services/dialog/dialog.service";
import { HeaderService } from "../../../../services/header/header.service";
import { SettingsService } from "../../../../services/settings/settings.service";
import { ToastService } from "../../../../services/toast/toast.service";
import { MatMiniFabButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatFormField } from "@angular/material/form-field";
import { MatSelect } from "@angular/material/select";
import { MatOption } from "@angular/material/core";

@Component({
    selector: 'settings-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    standalone: true,
    imports: [MatMiniFabButton, MatIcon, ReactiveFormsModule, MatFormField, MatSelect, MatOption, RouterLink, TranslateModule]
})
export class SettingsProfileComponent implements OnInit {
    private translate = inject(TranslateService);
    private headerService = inject(HeaderService);
    private settingsService = inject(SettingsService);
    private dialogService = inject(DialogService);
    private router = inject(Router);
    private tostr = inject(ToastService);
    private spinner = inject(NgxSpinnerService);


    userData: any;
    profileImageUrl: any;

    langularFormGroup: FormGroup = new FormGroup({
        'language': new FormControl()
    })

    ngOnInit(): void {
        this.getUserData();
        this.getUserProfileImage();
        this.updateHeaderComponent();
        this.watchForLanguageChange();
    }


    get currentLanguage() {
        return this.translate.currentLang
    }

    getUserData = () => {
        this.userData = JSON.parse(localStorage.getItem('userData') as string);
        console.log(this.userData);
    }

    watchForLanguageChange = () => {
        this.langularFormGroup.get('language')?.patchValue(this.currentLanguage);
        this.langularFormGroup.get('language')?.valueChanges.subscribe((val) => {
            this.translate.use(val).pipe(take(1)).subscribe(() => {
                localStorage.setItem('selected_language', val);
                document.querySelector('html')?.setAttribute('dir', (val === 'ar') ? 'rtl' : 'ltr');
                this.router.navigateByUrl('home/new-installation')
            });
        })
    }

    promptForPhotoUploadSource = () => {
        this.dialogService.imageSourceSelectionDialog().subscribe((selection: string) => {
            if (selection === 'cancel') return;
            else this.uploadProfilePicture(selection);
        })
    }

    uploadProfilePicture = (source: string) => {
       
        if (source === 'camera') source = CameraSource.Camera;
        else if (source === 'gallery') source = CameraSource.Photos;
        from(Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Uri,
            source: source as CameraSource
        })).subscribe((photo: Photo) => {
            this.spinner.show()
            this.settingsService.getImage(photo.webPath as string).subscribe((image: Blob) => {
                console.log(photo.webPath);
                console.log(image.type);
                let formData: FormData = new FormData();
                let selectedFileName = photo.webPath?.split('/');
                let formatedFileName: string = selectedFileName?.[selectedFileName?.length - 1].replace('.','_') || 'image.jpg';
                selectedFileName = formatedFileName.split('.');
                let fileType = image.type.split('/')[1];
                if (!selectedFileName.includes(fileType)) {
                    formatedFileName = [formatedFileName, fileType].join('.');
                }
                let fileName: string = formatedFileName;
                formData.append('file', image, fileName);
                this.settingsService.uploadProfilePicture(formData).pipe(take(1)).subscribe((res: any) => {
                    this.tostr.show({text:'image_uploaded_successfully'})
                    this.getUserProfileImage(res.data.imageToken);
                    this.settingsService.profilePhotoUpdated(res.data.imageToken);
                    
                })
            })
        })
    }

    updateHeaderComponent = () => {
        this.headerService.updateHeader({ title: 'settings' });
    }

    getUserProfileImage = (imageToken?: string) => {
        let userData = JSON.parse(localStorage.getItem('userData') as string);
        if(imageToken) userData.profilePicture = imageToken
        let profilePicture = userData.profilePicture;
        localStorage.setItem('userData', JSON.stringify(userData));
        this.settingsService.getUserProfileImage(imageToken).pipe(take(1)).subscribe((res: any) => {
            this.spinner.hide()
            if (profilePicture) this.profileImageUrl = res;
        })
    }
}