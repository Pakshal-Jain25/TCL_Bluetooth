import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { NgxSpinnerService } from "ngx-spinner";
import { take, takeWhile } from "rxjs";
import { NewInstallationService } from "../../../../services/new-installation/new-installation.service";
import { NewInstallationFormSubmissionDialogComponent } from "../form-submission-dialog/form-submission-dialog.component";
import { HeaderService } from "../../../../services/header/header.service";
import { Router } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { ToastService } from "../../../../services/toast/toast.service";
import { DialogService } from "../../../../services/dialog/dialog.service";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: 'new-installation-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss'],
    standalone: true,
    imports: [TranslateModule]
})
export class NewInstallationPreviewComponent implements OnInit, OnDestroy {
    private newInstallationService = inject(NewInstallationService);
    private spinner = inject(NgxSpinnerService);
    private dialog = inject(MatDialog);
    private headerService = inject(HeaderService);
    private router = inject(Router);
    private sanitizer = inject(DomSanitizer);
    private toast = inject(ToastService);
    private dialogService = inject(DialogService);


    data = this.newInstallationService.formData;
    locationCategoryName!: string;
    categoryName!: string;
    alive: boolean = false;
    selectedImageList: string[] = this.newInstallationService.selectedImageList;
    formDataSubmitResult: any;
    dialogDisplayed: boolean = false;

    ngOnInit(): void {
        this.alive = true;
        console.log('PREVIEW PAGE => ', this.newInstallationService.selectedImageList);
        this.updateHeader();
        this.watchForFormStepperChange();
        this.updateVisiblePreviewData();
        // console.log(this.selectedCategoryName, this.selectedLocationCategoryName);
    }

    ngOnDestroy(): void {
        this.alive = false;
    }

    /**
     * Only the data visible will be updated and not the actual data which will be send to server through API.
     * Like :-
     * - locationId
     * - categoryId
     */
    updateVisiblePreviewData = () => {
        if (this.data.locationId) {
            let { locationName } = this.newInstallationService.locationCategoryData.find((element: any) => element.locationId === this.data.locationId);
            this.locationCategoryName = locationName || '';
        }
        if (this.data.categoryId) {
            let { categoryName } = this.newInstallationService.categoryData.find((element: any) => element.categoryId === this.data.categoryId);
            this.categoryName = categoryName || '';
        }
    }

    getBrandNameFromId = (id: string): string => {
        if (id) {
            let { lampBrandName } = this.newInstallationService.brandNameData.find((element: any) => element.lampBrandId === id);
            return lampBrandName;
        }
        else {
            return '';
        }
    }

    updateHeader = (disableBackButton: boolean = false) => {
        this.headerService.updateHeader({ title: 'preview', menuIcon: "back_arrow", disableBackButton: disableBackButton });
    }

    watchForFormStepperChange = () => {
        this.newInstallationService.watchForFormStepperUpdate().pipe(takeWhile(() => this.alive)).subscribe(() => {
            // this.submitFormData();
            this.syncDeviceDataWithServer();
        })
    }
    sanitizedImgUrl = (img: string) => {
        return this.sanitizer.bypassSecurityTrustResourceUrl(img)
    }

    submitFormData = () => {
        // this.uploadSnaps();
        this.spinner.show();
        this.data.devUIOfController = this.data.deviceEui;
        this.data.installedDateTime = `${this.data.dateOfInstallation} ${this.data.time}`;
        this.newInstallationService.submitFormData(this.data).pipe(take(1)).subscribe((res: any) => {
            // After submiting Form Data depending upon the response received from API will present the user with respective dialog.
            if (!this.dialogDisplayed) {
                this.dialogDisplayed = true;
                this.updateHeader(true);
                this.openFormSubmissionDialog(res).pipe(take(1)).subscribe(() => {
                    this.dialogDisplayed = false;
                    this.updateHeader(false);
                    // If the form submitted successfully then after closing the dialog user will be navigated to the select-hieararchy page.
                    if (res.status === 200) {
                        this.newInstallationService.selectedImageList = [];
                        this.router.navigate(['/home/new-installation', 'select-hierarchy']);
                    }
                });
            }
            this.spinner.hide();


        })
    }

    openFormSubmissionDialog = (data: any) => {
        let direction: string = document.querySelector('html')?.getAttribute('dir') as string;
        const dialogRef = this.dialog.open(NewInstallationFormSubmissionDialogComponent, {
            data: data,
            direction: direction as 'ltr' | 'rtl',
            disableClose: true,
            hasBackdrop: true
        })

        return dialogRef.afterClosed().pipe(take(1));
    }


    /**
     * @description 
     * Syncs all the device data filled until now by user in form to server through sync API.
     */
    syncDeviceDataWithServer = () => {
        this.spinner.show();
        let data: any[] = [this.newInstallationService.formData];
        this.newInstallationService.syncDeviceData(data).pipe(take(1)).subscribe((res: any) => {
            // If User has uploaded and Image or snap then will call uploadSnaps() method to upload snaps or will go for submitFormData();
            if (this.selectedImageList.length == 0) this.submitFormData();
            else this.uploadSnaps();
        })
    }

    /**
     * @description
     * Uploads all the Image or snaps selected by user on location Page to the server.
     */
    uploadSnaps = () => {
        this.newInstallationService.uploadSnaps(this.newInstallationService.snapsFormData).pipe(take(1)).subscribe((res: any) => {
            this.toast.show({ text: 'image_uploaded_successfully' });
            this.submitFormData(); // Submiting New-Installation Form Data
        })
    }
}