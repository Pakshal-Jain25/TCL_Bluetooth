import { Component, OnInit, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import { NewInstallationService } from "../../../../services/new-installation/new-installation.service";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { MatIcon } from "@angular/material/icon";
import { MatButton } from "@angular/material/button";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: 'new-installation-select-hierarchy-search-dialog',
    templateUrl: './select-hierarchy-search-dialog.component.html',
    styleUrls: ['./select-hierarchy-search-dialog.component.scss'],
    standalone: true,
    imports: [CdkScrollable, MatDialogContent, ReactiveFormsModule, MatIcon, MatDialogActions, MatButton, TranslateModule]
})
export class NewInstallationSelectHierarchySearchDialogComponent implements OnInit {
    private dialogRef = inject<MatDialogRef<NewInstallationSelectHierarchySearchDialogComponent>>(MatDialogRef);
    data = inject(MAT_DIALOG_DATA);
    private newInstallationService = inject(NewInstallationService);


    visibleData: any[] = [];

    searchForm: FormGroup = new FormGroup({
        'search': new FormControl()
    })

    ngOnInit(): void {
        this.visibleData = [...this.data.data];
        this.watchForSearchValueChanges();
    }

    watchForSearchValueChanges = () => {
        this.searchForm.get('search')?.valueChanges.subscribe((res: string) => {
            this.filterData(res);
        })
    }

    filterData = (value?: string) => {
        value = value || this.searchForm.get('search')?.value;
        this.visibleData = this.data.data.filter((element: string) => element.toLowerCase().match(new RegExp((value || '').toLowerCase(),'g')));
    }

    closeDialog = (value?: string) => {
        this.dialogRef.close(value || null);
    }
    onFocus=()=>{
                this.newInstallationService.setPositionOfNextBtn.next(true)
            }
            noFocusOut(){
                this.newInstallationService.setPositionOfNextBtn.next(false)
            }
}