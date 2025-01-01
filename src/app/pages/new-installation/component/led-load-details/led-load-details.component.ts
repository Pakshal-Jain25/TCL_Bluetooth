import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { NgxSpinnerService } from "ngx-spinner";
import { take, takeWhile } from "rxjs";
import { DialogService } from "../../../../services/dialog/dialog.service";
import { HeaderService } from "../../../../services/header/header.service";
import { NewInstallationService } from "../../../../services/new-installation/new-installation.service";
import { MatFormField } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatSelect } from "@angular/material/select";
import { MatOption } from "@angular/material/core";

@Component({
    selector: 'new-installation-led-load-details',
    templateUrl: './led-load-details.component.html',
    styleUrls: ['./led-load-details.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, MatFormField, MatInput, MatSelect, MatOption, TranslateModule]
})
export class NewInstallationLedLoadDetailsComponent implements OnInit, OnDestroy {
    private newInstallationService = inject(NewInstallationService);
    private dialogService = inject(DialogService);
    private rotuer = inject(Router);
    private spinner = inject(NgxSpinnerService);
    private headerService = inject(HeaderService);
    private translate = inject(TranslateService);


    alive: boolean = false;
    brandNames: any[] = [];

    lampLoadDetailsForm: FormGroup = new FormGroup({
        'wattageDetails': new FormArray([])
    })
    noOfLamp: any;

    ngOnInit(): void {
        this.updateHeader();
        this.getBrandName();
        this.addNewSetOfFormForEachLamp();
        this.watchForFormStepperUpdate();
        this.alive = true;
        console.log(this.newInstallationService.categoryData, this.newInstallationService.locationCategoryData);
    }

    ngOnDestroy(): void {
        this.alive = false;
    }

    updateHeader = () => {
        this.headerService.updateHeader({ title: 'led_load_details', menuIcon: "back_arrow" });
    }

    watchForFormStepperUpdate = () => {
        this.newInstallationService.watchForFormStepperUpdate().pipe(takeWhile(() => this.alive)).subscribe(() => {
            this.checkIfFieldIsInvalid()
        })
    }

    get wattageDetails() {
        return (this.lampLoadDetailsForm.get('wattageDetails') as FormArray);
    }

    transformToFormGroup = (control: any) => {
        return control as FormGroup;
    }

    getBrandName = () => {
        this.spinner.show();
        this.newInstallationService.getBrandname().pipe(take(1)).subscribe((res: any) => {
            this.brandNames = res.data;
            this.newInstallationService.brandNameData = [...this.brandNames];
            this.spinner.hide();
        })
    }

    addNewSetOfFormForEachLamp = () => {
        let noOfLamps: number = this.newInstallationService.formData.noOfLamps;
        this.noOfLamp = this.newInstallationService.formData.noOfLamps;
        if (noOfLamps) {
            while (noOfLamps--) {
                this.addNewSetOfFormControls();
            }
            this.autoFillFormValueIfAny();
        }
        else {
            this.addNewSetOfFormControls();
            // this.dialogService.openAlertDialog({content: 'Number of Lamps not defined'})
        }
    }

    autoFillFormValueIfAny = () => {
        let { wattageDetails, noOfLamps } = this.newInstallationService.formData;
        if (wattageDetails && (wattageDetails.length === noOfLamps)) {
            wattageDetails.forEach((element: any, index: number) => {
                this.wattageDetails.get(`${index}`)?.patchValue(element);
            })
        }
    }

    addNewSetOfFormControls = () => {
        let formGroup: FormGroup = new FormGroup({
            'ledWattage': new FormControl(),
            'oldLampWattage': new FormControl(),
            'minPowerConsumption': new FormControl(),
            'maxPowerConsumption': new FormControl(),
            'lampBrandId': new FormControl(),
            'ledModelNumber': new FormControl()
        });
        this.wattageDetails.push(formGroup);
    }

    checkIfFieldIsInvalid = () => {
        let FormValid: boolean = true;
        (this.lampLoadDetailsForm.get('wattageDetails') as FormArray).controls.forEach((control: any) => {
            let { ledWattage, oldLampWattage } = (control as FormGroup).value;
            if (!ledWattage) {
                // this.dialogService.openAlertDialog({ content: 'Field Should not be empty' })
                FormValid = false;
                return;
            }
            else if (!oldLampWattage) {
                // this.dialogService.openAlertDialog({ content: 'Field Should not be empty' })
                FormValid = false;
                return;
            }
        })
        if (FormValid) {
            this.saveFormData();
        }
        else if (!FormValid) {
            let errorMessage = this.translate.instant('newInstallation.led_load_details.error.field_should_not_be_emppty');
            this.dialogService.openAlertDialog({ content: errorMessage })
        }
    }

    saveFormData = () => {
        this.newInstallationService.formData = { ...this.newInstallationService.formData, ...this.lampLoadDetailsForm.value }
        console.log(this.newInstallationService.formData);
        if (this.newInstallationService.formData.wattageDetails || (this.newInstallationService.formData.wattageDetails.length > 0)) {
            this.syncDeviceDataWithServer()
        }
        this.rotuer.navigate(['/home/new-installation', 'device-communication-test']);
    }

    syncDeviceDataWithServer = () => {
        // this.spinner.show();
        let data: any[] = [this.newInstallationService.formData];
        // this.newInstallationService.syncDeviceData(data).pipe(take(1)).subscribe((res: any) => {
        //     if (res.status === 200) {
        //         this.rotuer.navigate(['/home/new-installation', 'device-communication-test']);
        //     }
        //     else {
        //         this.dialogService.openAlertDialog({ content: res.message });
        //     }
        //     this.spinner.hide();
        // })
    }
    onFocus = () => {
        this.newInstallationService.setPositionOfNextBtn.next(true)
    }
    noFocusOut = () => {
        this.newInstallationService.setPositionOfNextBtn.next(false)
    }
    numberOnly(event:any): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          return false;
        }
        return true;
    
      }
}