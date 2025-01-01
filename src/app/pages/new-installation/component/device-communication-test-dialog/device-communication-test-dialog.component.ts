import { Component, OnInit, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import { take } from "rxjs";
import { NewInstallationService } from "../../../../services/new-installation/new-installation.service";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { MatButton } from "@angular/material/button";
import { TranslateModule } from "@ngx-translate/core";


@Component({
    selector: 'new-installation-device-communication-test-dialog',
    templateUrl: './device-communication-test-dialog.component.html',
    styleUrls: ['./device-communication-test-dialog.component.scss'],
    standalone: true,
    imports: [CdkScrollable, MatDialogContent, MatDialogActions, MatButton, TranslateModule]
})
export class NewInstallationDeviceCommunicationTestDialogComponent implements OnInit {
    private dialogRef = inject<MatDialogRef<NewInstallationDeviceCommunicationTestDialogComponent>>(MatDialogRef);
    data = inject(MAT_DIALOG_DATA);
    private newInstallationService = inject(NewInstallationService);


    testFailedDialogMessageVisible: boolean = false;
    isCommunicating: boolean = true;
    testFailed: boolean = false;
    testSuccess: boolean = false;

    ngOnInit(): void {
        this.requestCommunicationWithDevice();
    }

    requestCommunicationWithDevice = () => {
        let { deviceEui } = this.newInstallationService.formData;
        let data = {
            testCommand: 'test1command',
            deveui: deviceEui
        };

        // let testResult: any = {
        //     testTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        // }

        const date: Date = new Date();
        
        let testResult:any = {
            testTime: `${date.toISOString().split('T')[0]}T${date.toTimeString().split(' ')[0]}`
        }
        this.newInstallationService.requestForDiviceCommunication(data).pipe(take(1)).subscribe((res: any) => {
            this.isCommunicating = false;
            if (res.status === 200 && ['PASS', 'نجاح'].includes(res.message)) {
                this.testSuccess = true;
                testResult = {
                    ...testResult,
                    testStatus: true,
                    resultOfTesting: 'Test is Passed'
                }
                this.newInstallationService.formData = {
                    ...this.newInstallationService.formData,
                    ...testResult
                }
            }
            else {
                this.testFailed = true;
                testResult = {
                    ...testResult,
                    testStatus: false,
                    resultOfTesting: 'Test is Failed'
                }
                this.newInstallationService.formData = {
                    ...this.newInstallationService.formData,
                    ...testResult
                }
            }
            console.log(this.newInstallationService.formData);
        })
    }

    skipDeviceCommunicationTest = () => {
        this.dialogRef.close('skip_test')
    }

    cancelSkipDeviceCommunicationTest = () => {
        this.dialogRef.close('cancel_skip');
    }
}