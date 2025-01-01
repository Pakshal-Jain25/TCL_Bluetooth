import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { distinctUntilChanged } from "rxjs";
import { MatDatepickerInput, MatDatepickerToggle, MatDatepickerToggleIcon, MatDatepicker } from "@angular/material/datepicker";
import { MatSuffix } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatButton } from "@angular/material/button";
import { TranslateModule } from "@ngx-translate/core";

export const MY_DATE_FORMATS = {
    parse: {
        dateInput: 'DD-MM-YYYY',
    },
    display: {
        dateInput: 'DD-MM-YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'DD-MM-YYYY',
        monthYearA11yLabel: 'MMMM YYYY'
    },
};

@Component({
    selector: 'installation-list-date-filter',
    templateUrl: './date-filter.component.html',
    styleUrls: ['./date-filter.component.scss'],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE]
        },
        {
            provide: MAT_DATE_FORMATS,
            useValue: MY_DATE_FORMATS
        },
        DatePipe
    ],
    standalone: true,
    imports: [ReactiveFormsModule, MatDatepickerInput, MatDatepickerToggle, MatSuffix, MatIcon, MatDatepickerToggleIcon, MatDatepicker, MatButton, TranslateModule]
})
export class InstallationListDateFilterComponent implements OnInit {
    private bottomSheetRef = inject<MatBottomSheetRef<InstallationListDateFilterComponent>>(MatBottomSheetRef);
    private _cd = inject(ChangeDetectorRef);
 

    maxDateValue: Date = new Date();
    minDateValue: Date = new Date();

    installationListDateFilterForm: FormGroup = new FormGroup({
        'startDate': new FormControl(new Date()),
        'endDate': new FormControl(new Date())
    })

    get startDate() {
        return this.installationListDateFilterForm.get('startDate');
    }

    get endDate() {
        return this.installationListDateFilterForm.get('endDate');
    }

    ngOnInit(): void {
        this.updateDatePickerMinAndMaxValue();
    }

    onSubmit = () => {
        console.log('formValue => ', this.installationListDateFilterForm.value)
        console.log(new Date(this.startDate?.value).toISOString().split('T')[0]);
        let dateFilterValue = { startDate: `${new Date(this.startDate?.value).toISOString().split('T')[0]}T00:00:00.000Z`, endDate: `${new Date(this.endDate?.value).toISOString().split('T')[0]}T23:59:59.999Z` }
        console.log(dateFilterValue)
        this.bottomSheetRef.dismiss(dateFilterValue);
    }
    
    clearDateFilter = () => {
        this.bottomSheetRef.dismiss('Clear Filter');
    }
    
    updateDatePickerMinAndMaxValue = () => {
        this.installationListDateFilterForm.get('endDate')?.valueChanges.pipe(distinctUntilChanged()).subscribe((val) => {
            this.maxDateValue = new Date(new Date(val).toISOString().split('T')[0])
            this._cd.detectChanges();
        })
        this.installationListDateFilterForm.get('startDate')?.valueChanges.pipe(distinctUntilChanged()).subscribe((val) => {
            this.minDateValue = new Date(new Date(val).toISOString().split('T')[0])
            this._cd.detectChanges();
        })

    }

    filterReset = () => {
        this.installationListDateFilterForm.patchValue({
    
            startDate: new Date(),
            endDate: new Date()
        });
    }
}