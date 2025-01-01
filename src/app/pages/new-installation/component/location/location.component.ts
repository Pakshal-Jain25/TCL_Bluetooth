import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MapGeocoder, MapGeocoderResponse } from "@angular/google-maps";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { App } from "@capacitor/app";
import { Camera, CameraResultType, CameraSource, Photo } from "@capacitor/camera";
import { Geolocation, PermissionStatus, Position } from "@capacitor/geolocation";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { NgxSpinner, NgxSpinnerService } from "ngx-spinner";
import { from, skip, take, takeWhile } from "rxjs";
import { DialogService } from "../../../../services/dialog/dialog.service";
import { HeaderService } from "../../../../services/header/header.service";
import { NewInstallationService } from "../../../../services/new-installation/new-installation.service";
import { SettingsService } from "../../../../services/settings/settings.service";
import { ToastService } from "../../../../services/toast/toast.service";
import { MatFormField } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatButton, MatIconButton, MatFabButton } from "@angular/material/button";
import { NgClass } from "@angular/common";
import { MatIcon } from "@angular/material/icon";

@Component({
    selector: 'new-installation-location',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, MatFormField, MatInput, MatButton, NgClass, MatIcon, MatIconButton, MatFabButton, TranslateModule]
})
export class NewInstallationLocationComponent implements OnInit, OnDestroy {
    private newInstallationService = inject(NewInstallationService);
    private router = inject(Router);
    private spinner = inject(NgxSpinnerService);
    private geocoder = inject(MapGeocoder);
    private dialogService = inject(DialogService);
    private sanitizer = inject(DomSanitizer);
    private headerService = inject(HeaderService);
    private toast = inject(ToastService);
    private translate = inject(TranslateService);


    alive: boolean = false;
    currentLocation!: Position["coords"];
    fileList: FormData[] = [];
    selectedImageList: string[] = [];
    disabledControl: string[] = ['latitude', 'longitude', 'accuracy', 'dateOfInstallation', 'time'];
    formData: FormData = new FormData();
    file: File[] = [];
    showGetLocationBtn: boolean = false;

    locationForm: FormGroup = new FormGroup({
        'latitude': new FormControl({ disabled: true, value: null }),
        'longitude': new FormControl({ disabled: true, value: null }),
        'accuracy': new FormControl({ disabled: true, value: null }),
        'address': new FormControl(),
        'dateOfInstallation': new FormControl({ disabled: true, value: null }),
        'time': new FormControl({ disabled: true, value: null }),
        'remark': new FormControl()
    })
    showScannerBtn: boolean = true;

    ngOnInit(): void {
        this.alive = true;
        this.updateHeader();
        this.updateNextButton();
        this.checkLocationPermission();
        this.watchForFormStepperChange();
        this.watchAddressFieldForChanges();
        // this.backButtonListener();
    }

    ngOnDestroy(): void {
        this.alive = false;
        // App.removeAllListeners().then();
    }

    updateHeader = () => {
        this.headerService.updateHeader({ title: 'location', menuIcon: "back_arrow" });
    }

    updateNextButton = () => {
        this.newInstallationService.updateNextButtonLabel('submit_btn');
    }

    watchForFormStepperChange = () => {
        this.newInstallationService.watchForFormStepperUpdate().pipe(takeWhile(() => this.alive)).subscribe(() => {
            this.saveFormData();
        })
    }

    watchAddressFieldForChanges = () => {
        this.locationForm.get('address')?.valueChanges.pipe(takeWhile(() => this.alive), skip(1)).subscribe(() => {
            this.showGetLocationBtn = true;
        })
    }

    checkLocationPermission = () => {
        this.spinner.show();
        from(Geolocation.checkPermissions()).pipe(take(1)).subscribe({
            next: (permissionStatus: PermissionStatus) => {
                if (!permissionStatus.location) {
                    this.spinner.hide();
                    this.spinner.show();
                    from(Geolocation.requestPermissions({ permissions: ['location'] })).pipe(take(1)).subscribe({
                        next: (requestPermissionStatus: PermissionStatus) => {
                            this.spinner.hide();
                            if (!requestPermissionStatus.location) {
                                alert('Please Turn on your GPS!');
                            }
                            else {
                                this.getCurrentLocation();
                            }
                        },
                        error: this.checkIfGPSServiceIsEnabled
                    })
                }
                else {
                    this.spinner.hide();
                    this.getCurrentLocation();
                }
            },
            error: this.checkIfGPSServiceIsEnabled
        })
    }

    checkIfGPSServiceIsEnabled = () => {
        from(Geolocation.getCurrentPosition({ enableHighAccuracy: true })).pipe(take(1)).subscribe({
            error: (error: GeolocationPositionError) => {
                let GPS_service_disabled_error = this.translate.instant("newInstallation.location.GPS_service_disabled_error");
                this.dialogService.openAlertDialog({ content: GPS_service_disabled_error });
                this.spinner.hide();
            }
        })
    }

    getCurrentLocation = () => {
        this.spinner.show();
        from(Geolocation.getCurrentPosition({ enableHighAccuracy: true })).pipe(take(1)).subscribe(({ coords }: Position) => {
            this.spinner.hide();
            this.currentLocation = coords;
            this.toast.show({ text: 'started_location_update' });
            this.getFormattedAddress();
            let date: Date = new Date()
            let time = date.toTimeString().split(' ')
            this.locationForm.patchValue({
                'latitude': coords.latitude,
                'longitude': coords.longitude,
                'accuracy': coords.accuracy.toFixed(2),
                'dateOfInstallation': date.toISOString().split('T')[0],
                'time': time[0]
            })
        })
    }

    getFormattedAddress = () => {
        this.spinner.show();
        this.geocoder.geocode({ location: { lat: this.currentLocation.latitude, lng: this.currentLocation.longitude } }).pipe(take(1)).subscribe((result: MapGeocoderResponse) => {
            if (result.status === google.maps.GeocoderStatus.OK) {
                let address: string = result.results[0].formatted_address;
                this.locationForm.patchValue({
                    'address': address
                })
                this.showGetLocationBtn = false;
            }
            this.spinner.hide();

        })
    }

    getLatLonFromAddress = () => {
        this.spinner.show();
        let address: string = this.locationForm.get('address')?.value;
        this.geocoder.geocode({ address: address }).pipe(take(1)).subscribe({
            next: (geocoderResponse: MapGeocoderResponse) => {
                if (geocoderResponse.status === google.maps.GeocoderStatus.OK) {
                    let coords = geocoderResponse.results[0].geometry.location.toJSON();
                    this.locationForm.patchValue({
                        'latitude': coords.lat,
                        'longitude': coords.lng,
                    })
                    this.spinner.hide();
                }
            },
            error: () => {
                this.spinner.hide();
            }
        })
    }

    promptForPhotoUploadSource = () => {
        this.dialogService.imageSourceSelectionDialog().subscribe((selection: string) => {
            if (selection === 'cancel') return;
            else this.selectSnaps(selection);
        })
    }

    selectSnaps = (source: string) => {
        if (source === 'camera') source = CameraSource.Camera;
        else if (source === 'gallery') source = CameraSource.Photos;
        from(Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Uri,
            source: source as CameraSource
        })).subscribe((photo: Photo) => {
            this.newInstallationService.getImage(photo.webPath as string).pipe(take(1)).subscribe((image: any) => {
                // let formData: FormData = new FormData();
                let selectedFileName = photo.webPath?.split('/');
                let formatedFileName: string = selectedFileName?.[selectedFileName?.length - 1].replace('.','_') || 'image.jpg';
                selectedFileName = formatedFileName.split('.');
                let fileType = image.type.split('/')[1];
                if (!selectedFileName.includes(fileType)) {
                    formatedFileName = [formatedFileName, fileType].join('.');
                }
                let fileName: string = formatedFileName;
                this.formData.append('files', image, fileName);
                // this.fileList.push(formData);
                // this.newInstallationService.uploadSnaps(formData).pipe(take(1)).subscribe((res: any) => {
                //     console.log(res);
                // })
                this.file.push(image as File);
                console.log(this.file);
                this.selectedImageList.push(photo.webPath as string);
            })
            // this.settingsService.getImage(photo.webPath as string).subscribe((image: Blob) => {
            //     let formData: FormData = new FormData();
            //     let selectedFileName = photo.webPath?.split('/');
            //     let fileName: string = selectedFileName?.[selectedFileName.length - 1] || 'image.jpg';
            //     formData.append('file', image, fileName);
            //     this.settingsService.uploadProfilePicture(formData).pipe(take(1)).subscribe((res: any) => {
            //         this.getUserProfileImage(res.data.imageToken);
            //         this.settingsService.profilePhotoUpdated(res.data.imageToken);
            //     })
            // })
        })
    }

    bypassUnsafeResourseUrl = (url: string) => {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    removeSelectedImage = (index: number) => {
        this.fileList.splice(index, 1);
        this.file.splice(index, 1);
        this.selectedImageList.splice(index, 1);
    }

    saveFormData = () => {
        this.disabledControl.forEach((element) => {
            this.locationForm.get(element)?.enable();
        })
        let accuracy = this.locationForm.get('accuracy')?.value;
        this.newInstallationService.formData = {
            ...this.newInstallationService.formData,
            ...this.locationForm.value
        }
        console.log(this.newInstallationService.formData);
        this.disabledControl.forEach((element) => {
            this.
                locationForm.get(element)?.disable();
        })
        if (this.selectedImageList.length !== 0) this.uploadSnaps();
        // else {
        const error = this.translate.instant('newInstallation.location.accuracy_error')
        console.log('Location Page Accuracy => ',this.newInstallationService.projectDetails.created.projectMetaList[0].accuracyInMeter, accuracy)
        if (this.newInstallationService.projectDetails.created.projectMetaList[0].accuracyInMeter < accuracy) this.dialogService.openAlertDialog({ content: error })
        else this.router.navigate(['/home/new-installation', 'preview']);

        // }
    }

    /**
     * @description Uploads all the snap selected by user to server by transforming them in formData/ Multipart form Data
     */
    uploadSnaps = () => {
        // this.spinner.show();
        this.newInstallationService.snapsFormData = new FormData();
        // let formData: FormData = new FormData();
        this.file.forEach((image: any, index: number) => {
            let selectedFileName = this.selectedImageList[index]?.split('/');
            let formatedFileName: string = selectedFileName?.[selectedFileName?.length - 1].replace('.','_') || 'image.jpg';
            selectedFileName = formatedFileName.split('.');
            let fileType = image.type.split('/')[1];
            if (!selectedFileName.includes(fileType)) {
                formatedFileName = [formatedFileName, fileType].join('.');
            }
            let fileName: string = formatedFileName;
            // this.formData.append('files', image, fileName);
            this.newInstallationService.snapsFormData.append('files', image, fileName);
        })
        this.newInstallationService.selectedImageList = this.selectedImageList;
        console.log('Selected IMAge List From Location Page => ', this.newInstallationService.selectedImageList);
        // this.newInstallationService.uploadSnaps(formData).pipe(take(1)).subscribe((res: any) => {
        //     if (res.status === 200) {
        //         this.newInstallationService.selectedImageList = this.selectedImageList;
        //         this.toast.show({ text: 'image_uploaded_successfully' });
        //         this.router.navigate(['/home/new-installation', 'preview']);
        //     }
        //     this.spinner.hide();
        // })
    }

    backButtonClickHandler = () => {
        let ok_btn = this.translate.instant('newInstallation.ok_btn')
        let message = this.translate.instant('newInstallation.location.back_button_click_confirm_message');
        this.dialogService.openConfirmationDialog({ content: message, acceptButtonLabel: ok_btn, alertIcon: true }).pipe(take(1)).subscribe((confirmation) => {
            if (confirmation.confirm) {
                this.router.navigate(['/home/new-installation', 'select-hierarchy']);
            }
        });
    }
    onFocus = () => {
        this.newInstallationService.setPositionOfNextBtn.next(true)
        this.showScannerBtn = false
    }
    noFocusOut() {
        this.showScannerBtn = true
        this.newInstallationService.setPositionOfNextBtn.next(false)
    }

    // backButtonListener = () => {
    //     App.addListener('backButton', () => {
    //         this.backButtonClickHandler();
    //     })
    // }


}