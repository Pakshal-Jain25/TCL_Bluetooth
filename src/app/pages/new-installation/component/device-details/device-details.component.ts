import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { BarcodeScanner, CheckPermissionResult, ScanResult } from "@capacitor-community/barcode-scanner";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { NgxSpinnerService } from "ngx-spinner";
import { from, interval, skip, skipUntil, take, takeWhile, timer } from "rxjs";
import { DialogService } from "../../../../services/dialog/dialog.service";
import { HeaderService } from "../../../../services/header/header.service";
import { NewInstallationService } from "../../../../services/new-installation/new-installation.service";
import { ToastService } from "../../../../services/toast/toast.service";
import { MatFormField } from "@angular/material/form-field";
import { MatSelect } from "@angular/material/select";
import { MatOption } from "@angular/material/core";
import { MatInput } from "@angular/material/input";
import { MatFabButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";

@Component({
    selector: 'new-installation-device-details',
    templateUrl: './device-details.component.html',
    styleUrls: ['./device-details.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, MatFormField, MatSelect, MatOption, MatInput, MatFabButton, MatIcon, TranslateModule]
})
export class NewInstallationDeviceDetailsComponent implements OnInit, OnDestroy {
    private headerService = inject(HeaderService);
    private newInstallationService = inject(NewInstallationService);
    private spinner = inject(NgxSpinnerService);
    private toast = inject(ToastService);
    private router = inject(Router);
    private dialogService = inject(DialogService);
    private translate = inject(TranslateService);


    serialNos: string[] = [];
    alive: boolean = true;

    serialNoForm: FormGroup = new FormGroup({
        'serialNoPreffix': new FormControl(),
        'serialNoSuffix': new FormControl()
    })
    showScannerBtn: boolean = true;

    ngOnInit(): void {
        this.updateHeader();
        this.getSerialNo();
        
    }
    ngOnDestroy(): void {
        this.alive = false;
    }

    updateHeader = () => {
        this.headerService.updateHeader({ title: 'device_details', menuIcon: "back_arrow" });
    }

    watchForFormStepperUpdate = () => {
        this.newInstallationService.watchForFormStepperUpdate().pipe(takeWhile(() => this.alive)).subscribe(() => {
            this.checkForInvalidFormField();
        })
    }

    getSerialNo = () => {
        this.spinner.show();
        this.newInstallationService.getSerialNo().pipe(take(1)).subscribe((res: any) => {
            if (res.status === 200) {
                this.serialNos = res.data;
                this.serialNoForm.patchValue({
                    'serialNoPreffix': this.serialNos[0]
                })

            }
            console.log(this.newInstallationService.formData,"====",this.serialNoForm)
            if(this.newInstallationService.formData.serialNumber){
                let serial:any = this.newInstallationService.formData.serialNumber.split("-")
                let removed = serial.pop();
              let  sufix = serial.join('-') 
                console.log(serial)
                this.serialNoForm.patchValue({
                    'serialNoSuffix':removed,
                    'serialNoPreffix':sufix
                })
            }
            this.spinner.hide();
            this.autoFillFormValueIfAny();
            this.watchForFormStepperUpdate();
        })
    }

    private autoFillFormValueIfAny = () => {
        let serialNo = this.newInstallationService.formData.serialNo;
        if (serialNo) {
            serialNo = serialNo.split('-');
            let serialNoSuffix = serialNo.slice(-1).join('');
            let serialNoPreffix = serialNo.slice(0, -1).join('-');
            this.serialNoForm.patchValue({
                'serialNoSuffix': serialNoSuffix,
                'serialNoPreffix': serialNoPreffix
            })
        }
    }

    startScan = () => {
        console.log('Scan started');
        from(BarcodeScanner.checkPermission({ force: true })).pipe(take(1)).subscribe((checkPermisionResult: CheckPermissionResult) => {
            if (checkPermisionResult.granted) {
                let drawerElement: HTMLElement = (document.querySelector('mat-drawer-container') as HTMLElement)
                // If No QR/Barcode Found scanner will automatically stop scanning after 15 sec.
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
                        let scannerResult = scanResult.content.toUpperCase().split('-')
                        let serialNoSuffix:any = scannerResult.slice(-1).join('');
                        let serialNoPreffix = scannerResult.slice(0,-1).join('-');
                        this.serialNoForm.patchValue({
                            'serialNoSuffix': serialNoSuffix,
                            'serialNoPreffix': serialNoPreffix
                        })
                    }
                })
            }
        })
    }

    checkForInvalidFormField = () => {
        let { serialNumber } = this.newInstallationService.formData;
        let { serialNoPreffix, serialNoSuffix } = this.serialNoForm.value;
        let serialNo = `${serialNoPreffix}-${serialNoSuffix}`;
        
        
        if (serialNoPreffix && serialNoSuffix) {
            if(serialNumber && (serialNumber === serialNo))this.verifyDeviceWithSerialNo();
            else this.getDeviceHistoryWithSerialNo();
        }
        else {
            let errorMessage = this.translate.instant('newInstallation.device_details.error.enter_serial_no_of_controller');
            this.dialogService.openAlertDialog({ content: errorMessage });
        }
    }

    getDeviceHistoryWithSerialNo = () => {
        this.spinner.show();
            let { serialNoPreffix, serialNoSuffix } = this.serialNoForm.value;
            this.newInstallationService.getDeviceHistoryWithSerialNo(`${serialNoPreffix}-${serialNoSuffix}`).pipe(take(1)).subscribe((res: any) => {
                if (res.status === 204) {
                    this.verifyDeviceWithSerialNo();
                }
                if (res.status === 200 ) {
                    let errorMessage = this.translate.instant('newInstallation.device_details.error.serial_no_duplicate');
                    this.dialogService.openAlertDialog({ content: errorMessage });
                    this.spinner.hide();
                }
            })  
    }

    verifyDeviceWithSerialNo = () => {
        this.spinner.show();
        let { serialNoPreffix, serialNoSuffix } = this.serialNoForm.value;
        this.newInstallationService.verifyDeviceWithSerialNo(`${serialNoPreffix}-${serialNoSuffix}`).pipe(take(1)).subscribe((res: any) => {
            if (res.status === 200) {
                let data = res.data[0];
                this.newInstallationService.formData = {
                    ...this.newInstallationService.formData,
                    serialNo: `${serialNoPreffix}-${serialNoSuffix}`,
                    deviceEui: data.deveui,
                    type: data.productName,
                    productId: data.productId,
                    deviceStatus: false,
                    syncStatus: false
                }
                // this.newInstallationService.formData.serialNumber = `${serialNoPreffix}-${serialNoSuffix}`;
                console.log(this.newInstallationService.formData);
                this.router.navigate(['/home/new-installation', 'pole-details']);
            }
            else if (res.status === 204) {
                this.toast.show({ text: 'device_not_found_or_not_allowed' });
                // this.router.navigate(['/home/new-installation', 'select-hierarchy']);
            }
            this.spinner.hide();
        })
    }
    onFocus=()=>{
        this.newInstallationService.setPositionOfNextBtn.next(true)
        this.showScannerBtn = false
    }
    noFocusOut(){
        this.showScannerBtn = true
        this.newInstallationService.setPositionOfNextBtn.next(false)
    }

}