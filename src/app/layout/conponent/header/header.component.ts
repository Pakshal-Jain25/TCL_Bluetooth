import { Location } from "@angular/common";
import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, inject } from "@angular/core";
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { take, takeUntil, takeWhile } from "rxjs";
import { DialogService } from "../../../services/dialog/dialog.service";
import { HeaderService } from "../../../services/header/header.service";
import { NewInstallationService } from "../../../services/new-installation/new-installation.service";
import { MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";

@Component({
    selector: 'layout-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [MatIconButton, MatIcon, ReactiveFormsModule, TranslateModule]
})
export class LayoutHeaderComponent implements OnInit, OnDestroy {
    private headerService = inject(HeaderService);
    private _cd = inject(ChangeDetectorRef);
    private location = inject(Location);
    private router = inject(Router);
    private translate = inject(TranslateService);
    private dialogService = inject(DialogService);


    headerTitle: string = ' ';
    menuIcon: 'menu' | 'back_arrow' = 'menu';
    displaySearchIcon: boolean = false;
    displaySearchBox: boolean = false;
    alive: boolean = false;
    disableBackButton: boolean = false;

    searchBoxForm: FormGroup = new FormGroup({
        'search': new FormControl(null,Validators.required)
    })

    @Output() drawer: EventEmitter<any> = new EventEmitter;

    ngOnInit(): void {
        this.alive = true;
        this.watchHeaderChanges();
        this.watchForBackButtonClick();
    }

    ngOnDestroy(): void {
        this.alive = false;
    }

    openDrawer = () => {
        this.drawer.emit();
    }

    get searchBox() {
        return this.searchBoxForm.get('search');
    }

    watchHeaderChanges = () => {
        this.headerService.watchHeaderChanges().subscribe(({ title, searchIcon, menuIcon, disableBackButton }) => {
            this.headerTitle = title || ' ';
            this.displaySearchIcon = searchIcon ? searchIcon : false;
            this.menuIcon = menuIcon ? menuIcon : 'menu';
            this.displaySearchBox = false;
            this.disableBackButton = disableBackButton || false;
            this._cd.detectChanges();
        })
    }

    watchForBackButtonClick = () => {
        this.headerService.watchForBackButtonClick().pipe(takeWhile(() => this.alive)).subscribe(() => {
            this.back();
        })
    }

    applySearchFilterChanges = () => {
        this.headerService.applyHeaderSearchFilterChanges(this.searchBox?.value);
    }

    backButtonClickHandler = () => {
        this.displaySearchBox = false;
        this.searchBoxForm.reset();
        this.applySearchFilterChanges();
    }

    back = () => {
        let url: string = this.router.url.split('/').slice(-1)[0];
        if (url === 'location') {
            let ok_btn = this.translate.instant('newInstallation.ok_btn')
            let message = this.translate.instant('newInstallation.location.back_button_click_confirm_message');
            this.dialogService.openConfirmationDialog({ content: message, acceptButtonLabel: ok_btn, alertIcon: true }).pipe(take(1)).subscribe((confirmation) => {
                if (confirmation.confirm) {
                    this.router.navigate(['/home/new-installation', 'select-hierarchy']);
                }
            });
        }
        else {
            this.location.back();
        }
    }

}