import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { NgxSpinnerService } from "ngx-spinner";
import { map, startWith, take, takeWhile } from "rxjs";
import { HeaderService } from "../../../../services/header/header.service";
import { NewInstallationService } from "../../../../services/new-installation/new-installation.service";
import { NewInstallationSelectHierarchySearchDialogComponent } from "../select-hierarchy-search-dialog/select-hierarchy-search-dialog.component";
import { ActivatedRoute, Router } from "@angular/router";
import { DialogService } from "../../../../services/dialog/dialog.service";
import { TranslateService } from "@ngx-translate/core";
import { MatFormField, MatSuffix } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";

@Component({
    selector: 'new-istallation-select-hierarchy',
    templateUrl: './select-hierarchy.component.html',
    styleUrls: ['./select-hierarchy.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, MatFormField, MatInput, MatIcon, MatSuffix]
})
export class NewInstallationSelectHierarchyComponent implements OnInit, OnDestroy {
    private headerService = inject(HeaderService);
    private newInstallationService = inject(NewInstallationService);
    private spinner = inject(NgxSpinnerService);
    private dialog = inject(MatDialog);
    private dialogService = inject(DialogService);
    private router = inject(Router);
    private translet = inject(TranslateService);
    private route = inject(ActivatedRoute);


    hierarchyFields: string[] = [];
    propertyData: any[] = [];
    formatedPropertyData: any[] = [];
    formatedDynamicHierarchyData: any[] = [];
    alive: boolean = true;
    selectHierarchyForm: FormGroup = new FormGroup({})

    ngOnInit(): void {
        this.updateHeader();
        this.updateNextButtonLabel();
        this.getProperty();
        this.watchFormStepperChange();

    }

    ngOnDestroy(): void {
        this.alive = false;
    }
    getSerialNoAndGetData = () => {
        this.route.params.subscribe((param: any) => {
            if (param.id) {
                this.newInstallationService.getHistoryOfSerialNo(param.id).pipe(take(1)).subscribe((result: any) => {
                    if (result.status === 200) {
                        let hierarchyValues: any
                        this.newInstallationService.formData = result.data[0]       // this.getDynamicHierarchy(result.data[0].properties.propertyFields)
                        result.data[0].properties.propertyFields.forEach((field: any) => {
                            hierarchyValues = {
                                ...hierarchyValues,
                                [field.label]: field.value
                            };
                        });
                        this.selectHierarchyForm.patchValue(hierarchyValues);

                        // this.selectHierarchyForm.patchValue(result.data[0].properties.propertyFields)
                    }
                })
            }

        })

    }

    private updateHeader = () => {
        this.headerService.updateHeader({ title: 'select_hierarchy', searchIcon: false });
    }

    private updateNextButtonLabel = () => {

        this.newInstallationService.updateNextButtonLabel('next_btn');
    }

    private watchFormStepperChange = () => {
        
        this.newInstallationService.watchForFormStepperUpdate().pipe(takeWhile(() => this.alive)).subscribe(() => {
            this.checkIfFormIsEmptyOrNot();
        })
    }

    onFocusHandler = (event: Event) => {
        
        (event.target as HTMLInputElement).blur();
    }

    private getProperty = () => {
        
        this.spinner.show();
        this.newInstallationService.getProperty().pipe(take(1)).subscribe((res: any) => {
            this.propertyData = res.data;
            this.getDynamicHierarchy(this.propertyData) /// Dynamic Hierarchy
            this.getSerialNoAndGetData();
            this.spinner.hide();
        })
    }

    

    private checkIfFormIsEmptyOrNot = () => {
        
        let value = this.selectHierarchyForm.value;
        let errormsg = this.translet.instant('newInstallation.led_load_details.error.field_should_not_be_emppty')
        let formValid: boolean = true;
        for (let field of this.selectHierarchyFormField) {
            if (!value?.[field]) {
                formValid = false;
            }
        }
        if (formValid) this.getPropertyDetailsFromDierarchy();
        else this.dialogService.openAlertDialog({ content: errormsg });
    }

    private getPropertyDetailsFromDierarchy = () => {
        
        let value = this.selectHierarchyForm.value;
        let property = this.propertyData.find((element: any) => {

            let hierarchyMatch = element.propertyFields.every((field: any) => {
                
                if (this.hierarchyFields.includes(field.label)) {
                    if (field.value === value?.[field.label]) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            })
            if (hierarchyMatch) return true;
            else return false;
        })
        if (property) this.newInstallationService.formData.propertyId = property.propertyId;
        if (property) this.router.navigate(['/home/new-installation', 'device-details']);
    }

    private openSelectHierarchySearchDialog = (data: any) => {
        let direction = document.querySelector('html')?.getAttribute('dir');
        let dialogRef = this.dialog.open(NewInstallationSelectHierarchySearchDialogComponent, {
            data: data,
            direction: direction as 'ltr' | 'rtl',
            disableClose: true,
            autoFocus: false,
            hasBackdrop: true
        })

        return dialogRef.afterClosed().pipe(take(1));
    }

    private getDynamicHierarchy = async (data: any) => {
        let hierarchyFields: Set<string> = new Set<string>();
        await data.forEach(async (element: any) => {
            let formatedHierarchyData: object = {};
            
            element.propertyFields.forEach((field: any) => {
                hierarchyFields.add(field.label)
                formatedHierarchyData = {
                    ...formatedHierarchyData,
                    [field.label]: field.value
                }
            })
            this.formatedDynamicHierarchyData.push(formatedHierarchyData);
        })
        this.hierarchyFields = [...hierarchyFields];
        this.addHierarchyFieldsInForm(...hierarchyFields);
        this.autoFillFormValueIfAny();
        this.checkIfPropertyFieldIsAvailableInLocalStorage();
        this.watchForFieldValueChange();
    }

    autoFillFormValueIfAny = () => {
        let propertyId = this.newInstallationService.formData.propertyId
        console.log('PROPERTY_ID => ', propertyId);
        if (propertyId) {
            let propertyData = this.propertyData.find((property: any) => property.propertyId === propertyId);
            let hierarchyValues = {};
            propertyData.propertyFields.forEach((field: any) => {
                hierarchyValues = {
                    ...hierarchyValues,
                    [field.label]: field.value
                };
            });
            this.selectHierarchyForm.patchValue(hierarchyValues);
        }
    }

    private addHierarchyFieldsInForm = (...fields: string[]) => {
        fields.forEach((field: string) => {
            this.selectHierarchyForm.addControl(field, new FormControl());
        })

        console.log(Object.keys(this.selectHierarchyForm.controls));
    }

    get selectHierarchyFormField() {
        return Object.keys(this.selectHierarchyForm.controls);
    }

    private watchForFieldValueChange = () => {
        for (let field of this.selectHierarchyFormField) {
            this.selectHierarchyForm.get(field)?.valueChanges.pipe(takeWhile(() => this.alive)).subscribe(() => {
                this.resetSubHierarchyFields(field)
            })
        }
    }

    resetSubHierarchyFields = (field: string) => {
        let hierarchyFields = [...this.hierarchyFields];
        let index = hierarchyFields.findIndex(element => element === field);
        if (index < hierarchyFields.length) {
            let fieldToReset = hierarchyFields.slice(index + 1);
            for (let field of fieldToReset) {
                this.selectHierarchyForm.get(field)?.reset();
            }

        }
    }

    getHierarchyOptions = async (field: string) => {
        let options: Set<string> = new Set<string>();
        if (field == "City") {
            this.selectHierarchyForm.value.Zone = null
           this.selectHierarchyForm.controls['Zone'].reset()
          
        }
        if (field == "Zone") {
            this.selectHierarchyForm.value.Sector = null
            this.selectHierarchyForm.controls['Sector'].reset()
        }
        let hierarchyFields: string[] = [...this.hierarchyFields];
        let value = this.selectHierarchyForm.value;
        let filteredHierarchyData = [];
        let hierarchyIndex = hierarchyFields.findIndex(element => element === field);
        if (hierarchyIndex === 0) {
            this.formatedDynamicHierarchyData.forEach((element) => {
                options.add(element?.[field])
            })
        }
        else {
            filteredHierarchyData = this.formatedDynamicHierarchyData.filter((element: any) => {
                let shouldBeReturned: boolean = true;
                for (let i = 0; i < hierarchyIndex; i++) {
                    if (shouldBeReturned && (element?.[hierarchyFields[i]] !== value?.[hierarchyFields[i]])) {
                        shouldBeReturned = false;
                    }
                }
                if (shouldBeReturned) return element;
            })
            filteredHierarchyData.forEach((element: any) => {
                options.add(element?.[field]);
            })
        }

        this.openSelectHierarchySearchDialog({ title: field, data: [...options] }).pipe(takeWhile(() => this.alive)).subscribe((result: string) => {
            this.newInstallationService.setPositionOfNextBtn.next(false);
            this.newInstallationService.formData.propertyId
            
            if (result) {
                this.selectHierarchyForm.patchValue({
                    [field]: result
                })


            }
        });
    }

    checkIfPropertyFieldIsAvailableInLocalStorage = () => {
        let propertyId: string = localStorage.getItem('propertyId') as string;
        if (propertyId) {
            let propertyData = this.propertyData.find((property: any) => property.propertyId === propertyId);
            let hierarchyValues = {};
            propertyData.propertyFields.forEach((field: any) => {
                hierarchyValues = {
                    ...hierarchyValues,
                    [field.label]: field.value
                };
            });
            this.selectHierarchyForm.patchValue(hierarchyValues);
        }
    }
}