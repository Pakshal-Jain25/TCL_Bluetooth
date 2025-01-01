import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { BarcodeScanner, CheckPermissionResult, ScanResult } from "@capacitor-community/barcode-scanner";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { NgxSpinnerService } from "ngx-spinner";
import { from, skipUntil, take, takeWhile, timer } from "rxjs";
import { DialogService } from "../../../../services/dialog/dialog.service";
import { HeaderService } from "../../../../services/header/header.service";
import { NewInstallationService } from "../../../../services/new-installation/new-installation.service";
import { MatFormField } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatFabButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatSelect } from "@angular/material/select";
import { MatOption } from "@angular/material/core";

@Component({
    selector: 'new-installation-pole-details',
    templateUrl: './pole-details.component.html',
    styleUrls: ['./pole-details.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, MatFormField, MatInput, MatFabButton, MatIcon, MatSelect, MatOption, TranslateModule]
})
export class NewInstallationPoleDetailsComponent implements OnInit, OnDestroy {
    private newInstallationService = inject(NewInstallationService);
    private spinner = inject(NgxSpinnerService);
    private headerService = inject(HeaderService);
    private router = inject(Router);
    private dialogServie = inject(DialogService);
    private translate = inject(TranslateService);
 

    alive: boolean = false;
    localtionCategory: any[] = [];
    category: any[] = [];

    poleDetailsForm: FormGroup = new FormGroup({
        'poleNo': new FormControl(),
        'noOfLamps': new FormControl(1),
        'locationId': new FormControl(),
        'categoryId': new FormControl(),
        'poleModelNumber': new FormControl()
    })
    PoleNO: any;

    ngOnInit(): void {
        this.updateHeader();
        this.getLocationCategory();
        this.getCategory();
        this.watchForFormStepperChange();
        this.autoFillFormValueIfAny();
        this.alive = true;
    }
    ngOnDestroy(): void {
        this.alive = false;
    }

    updateHeader = () => {
        this.headerService.updateHeader({ title: 'pole_details', menuIcon: "back_arrow" });
    }

    private watchForFormStepperChange = () => {
        this.newInstallationService.watchForFormStepperUpdate().pipe(takeWhile(() => this.alive )).subscribe(() => {
            this.checkForInvalidInput();
        })
    }

    private getLocationCategory = () => {
        this.spinner.show();
        this.newInstallationService.getLocationCategory().pipe(take(1)).subscribe((res: any) => {
            if (res.status === 200) {
                this.localtionCategory = res.data;
                this.newInstallationService.locationCategoryData = [...this.localtionCategory];
            }
            this.spinner.hide();
        })
    }

    private getCategory = () => {
        this.spinner.show();
        this.newInstallationService.getCategory().pipe(take(1)).subscribe((res: any) => {
            if (res.status === 200) {
                this.category = res.data;
                this.newInstallationService.categoryData = [...this.category];
            }
            this.spinner.hide();
        })
    }

    private autoFillFormValueIfAny = () => {
        let { poleNo, noOfLamps, locationId, categoryId, poleModelNumber } = this.newInstallationService.formData;
        if (poleNo && noOfLamps) {
            this.poleDetailsForm.patchValue({
                poleNo,
                noOfLamps,
                locationId,
                categoryId,
                poleModelNumber
            })
            this.PoleNO = this.poleDetailsForm.value.poleNo
        }
        
    }

    startScan = () => {
        console.log('scannn started');
        from(BarcodeScanner.checkPermission({ force: true })).pipe(take(1)).subscribe((checkPermisionResult: CheckPermissionResult) => {
            if (checkPermisionResult.granted) {
                let drawerElement: HTMLElement = (document.querySelector('mat-drawer-container') as HTMLElement)
                let stopScanTimer = setTimeout(() => {
                    BarcodeScanner.showBackground();
                    from(BarcodeScanner.stopScan()).pipe(take(1)).subscribe(() => {
                        // this.toast.show({})
                        drawerElement.style.display = 'block';
                        alert('No Barcode or QR Code detected');
                    })
                }, 15000);
                BarcodeScanner.hideBackground();
                drawerElement.style.display = 'none';
                from(BarcodeScanner.startScan()).pipe(take(1)).subscribe((scanResult: ScanResult) => {
                    clearTimeout(stopScanTimer);
                    drawerElement.style.display = 'block';
                    if (scanResult.hasContent) {
                        this.poleDetailsForm.patchValue({
                            'poleNo': scanResult.content
                        })
                    }
                })
            }
        })
    }

    checkForInvalidInput = () => {
        let { poleNo, noOfLamps } = this.poleDetailsForm.value;
        if (!poleNo) {
            let errorMessage = this.translate.instant('newInstallation.pole_details.error.enter_pole_details');
            this.dialogServie.openAlertDialog({ content: errorMessage });
        }
        else if (!noOfLamps) {
            let errorMessage = this.translate.instant('newInstallation.pole_details.error.enter_pole_details');
            this.dialogServie.openAlertDialog({ content: errorMessage });
        }
        else {
            if(this.PoleNO === this.poleDetailsForm.value.poleNo)this.saveFormData()
            else this.checkForDuplicatePoleNo();
        }
    }

    checkForDuplicatePoleNo = () => {
        this.spinner.show();
        let poleNo = this.poleDetailsForm.get('poleNo')?.value
        this.newInstallationService.checkForDuplicatePoleNo(poleNo).pipe(take(1)).subscribe((res: any) => {
            if (!res.data || (res.data.length === 0)) {
                this.saveFormData();
            }
            else {
                let errorMessage = this.translate.instant('newInstallation.pole_details.error.pole_no_duplicate');
                this.dialogServie.openAlertDialog({ content: errorMessage });
            }
            this.spinner.hide();
        })
    }

    saveFormData = () => {
        this.newInstallationService.formData = { ...this.newInstallationService.formData, ...this.poleDetailsForm.value };
        console.log(this.newInstallationService.formData);
        this.router.navigate(['/home/new-installation', 'led-load-details']);
    }
    onFocus=()=>{
               this.newInstallationService.setPositionOfNextBtn.next(true)
           }
           noFocusOut=()=>{
               this.newInstallationService.setPositionOfNextBtn.next(false)
           }
}