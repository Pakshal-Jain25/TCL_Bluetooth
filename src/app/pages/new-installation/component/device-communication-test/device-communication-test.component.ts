import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { take, takeWhile } from "rxjs";
import { NewInstallationService } from "../../../../services/new-installation/new-installation.service";
import { NewInstallationDeviceCommunicationTestDialogComponent } from "../device-communication-test-dialog/device-communication-test-dialog.component";
import { DialogService } from "../../../../services/dialog/dialog.service";
import { HeaderService } from "../../../../services/header/header.service";
import { MatButton } from "@angular/material/button";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: 'new-installation-device-communication-test',
    templateUrl: './device-communication-test.component.html',
    styleUrls: ['./device-communication-test.component.scss'],
    standalone: true,
    imports: [MatButton, TranslateModule]
})
export class NewInstallationDeviceCommunicationTestComponent implements OnInit, OnDestroy {
    private newInstallationService = inject(NewInstallationService);
    private router = inject(Router);
    private spinner = inject(NgxSpinnerService);
    private dialog = inject(MatDialog);
    private dialogService = inject(DialogService);
    private headerService = inject(HeaderService);
 

    alive: boolean = false;
    testInProcess: boolean = false;

    ngOnInit(): void {
        this.updateHeader();
        this.showPerformTestButton();
        this.watchForFormStepperUpdate();
        this.alive = true;
    }

    ngOnDestroy(): void {
        this.alive = false;
        this.hidePerformTestButton();
    }
    
    updateHeader = (diasbledBackButton: boolean = false) => {
        this.headerService.updateHeader({ title: 'device_communication_test', menuIcon: "back_arrow", disableBackButton: diasbledBackButton });
    }

    private watchForFormStepperUpdate = () => {
        this.newInstallationService.watchForFormStepperUpdate().pipe(takeWhile(() => this.alive)).subscribe((res: any) => {
            if (!this.testInProcess) {
                this.testInProcess = true;
                this.updateHeader(true);
                this.openDeviceCommunicationTestDialog().subscribe((result: any) => {
                    this.testInProcess = false;
                    this.updateHeader(false);
                    if (result === 'skip_test') {
                        this.skipDeviceCommunicationTest();
                    }
                    else if (result.status === 200) {
                        //// If Device communication test Successfull.
                    }
                });
            }
            // this.router.navigate(['/new-installation','location'])
        })
    }

    private showPerformTestButton = () => {
        this.newInstallationService.togglePerfomTestButton(true);
    }

    private hidePerformTestButton = () => {
        this.newInstallationService.togglePerfomTestButton(false);
    }

    openDeviceCommunicationTestDialog = () => {
        let direction = document.querySelector('html')?.getAttribute('dir');
        const dialogRef = this.dialog.open(NewInstallationDeviceCommunicationTestDialogComponent, {
            direction: direction as 'ltr' | 'rtl',
            disableClose: true,
            hasBackdrop: true
        })

        return dialogRef.afterClosed().pipe(take(1));
    }

    skipDeviceCommunicationTest = () => {
        if(!this.testInProcess) this.router.navigate(['/home/new-installation', 'location']);
    }
}