import { Injectable, inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Observable, take } from "rxjs";
import { SharedAlertDialogData } from "../../interface/shared-alert-dialog-data";
// import { SharedAlertDialogData } from "src/app/interface/shared-alert-dialog-data";
import { SharedConfirmationDialogData } from "../../interface/shared-confirmation-dialog-data";
import { SharedAlertDialogComponent } from "../../shared-component/components/alert-dialog/alert-dialog.component";
import { SharedCameraAndGalleryDialogComponent } from "../../shared-component/components/camera-and-gallery-dialog/camera-and-gallery-dialog.component";
import { SharedConfirmationDialogComponent } from "../../shared-component/components/confirmation-dialog/confirmation-dialog.component";
import { SharedLogoutDialogComponent } from "../../shared-component/components/logout-dialog/logout-dialog.component";

@Injectable()
export class DialogService {
    private dialog = inject(MatDialog);
    private translate = inject(TranslateService);
    private router = inject(Router);


    openAlertDialog = (data: SharedAlertDialogData): Observable<null> => {
        let direction = document.querySelector('html')?.getAttribute('dir');
        const dialogRef = this.dialog.open(SharedAlertDialogComponent, {
            data: data,
            disableClose: true,
            direction: direction as "ltr" | "rtl",
            hasBackdrop: true
        });

        return dialogRef.afterClosed().pipe(take(1))
    }

    

    openConfirmationDialog = (data: SharedConfirmationDialogData): Observable<{ confirm: boolean }> => {
        let direction = document.querySelector('html')?.getAttribute('dir');
        const dialogRef = this.dialog.open(SharedConfirmationDialogComponent, {
            data: data,
            disableClose: true,
            direction: direction as 'ltr' | 'rtl',
            hasBackdrop: true
        });

        return dialogRef.afterClosed().pipe(take(1));
    }

    imageSourceSelectionDialog = () => {
        let direction = document.querySelector('html')?.getAttribute('dir');
        const dialogRef = this.dialog.open(SharedCameraAndGalleryDialogComponent, {
            disableClose: true,
            direction: direction as 'ltr' | 'rtl',
            autoFocus: false,
            hasBackdrop: true
        });

        return dialogRef.afterClosed().pipe(take(1));
    }

    logoutDialog = () => {
        let direction = document.querySelector('html')?.getAttribute('dir');
        const dialogRef = this.dialog.open(SharedLogoutDialogComponent, {
            disableClose: true,
            direction: direction as 'ltr' | 'rtl',
            autoFocus: false,
            hasBackdrop: true
        });

        return dialogRef.afterClosed().pipe(take(1));
    }

    closeAllDialog = () => {
        this.dialog.closeAll();
    }

    locationBackButtonAlert = () => {
        let ok_btn = this.translate.instant('newInstallation.ok_btn');
        let message = this.translate.instant('newInstallation.location.back_button_click_confirm_message');
        this.openConfirmationDialog({ content: message, acceptButtonLabel: ok_btn, alertIcon: true }).pipe(take(1)).subscribe((confirmation) => {
            if (confirmation.confirm) {
              this.router.navigate(['/home/new-installation', 'select-hierarchy']);
            }
        });
    }

}