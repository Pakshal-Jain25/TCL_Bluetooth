import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from "@angular/core";
// import { Keyboard } from "@capacitor/keyboard";
import { distinctUntilChanged, take, takeWhile } from "rxjs";
import { NewInstallationService } from "../../services/new-installation/new-installation.service";
import { NgClass } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: 'pages-new-installation',
    templateUrl: './new-installation.component.html',
    styleUrls: ['./new-installation.component.scss'],
    standalone: true,
    imports: [NgClass, RouterOutlet, MatButton, MatIcon, TranslateModule]
})
export class NewInstallationComponent implements OnInit, OnDestroy {
    private newInstallationService = inject(NewInstallationService);
    private _cd = inject(ChangeDetectorRef);
 

    displayNextButton: boolean = true;
    showPerformTestButton: boolean = false;
    nextButtonLabel: string = 'next_btn';
    alive: boolean = false;
    setPsition:any = false

    ngOnInit(): void {
        this.newInstallationService.setPositionOfNextBtn.subscribe((res)=>{
            this.setPsition =res
        })
        this.alive = true;
        this.watchForPerformTestButton();
        this.watchForNextButtonLabelUpdate();
        // this.watchForKeyBoardEvents();
    }
    ngOnDestroy(): void {
        this.alive = false;
    }

    updateFormStepper = (): void => {
        this.newInstallationService.updateFormStepper();
    }

    watchForPerformTestButton = () => {
        this.newInstallationService.watchForperformTestButton().pipe(distinctUntilChanged()).subscribe((res: boolean) => {
            this.showPerformTestButton = res ? res : false;
            this._cd.detectChanges();
        })
    }

    watchForNextButtonLabelUpdate = () => {
        this.newInstallationService.watchNextButtonLabelUpdate().pipe(takeWhile(() => this.alive)).subscribe((result: string) => {
            this.nextButtonLabel = result;
        })
    }

    // watchForKeyBoardEvents = () => {
        // Keyboard.addListener('keyboardDidShow', () => {
        //     this.displayNextButton = false;
        // });

        // Keyboard.addListener('keyboardDidHide', () => {
        //     this.displayNextButton = true
        // })
    // }
}