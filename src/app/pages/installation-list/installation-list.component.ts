import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { DataService } from "../../services/data.service";
import { HeaderService } from "../../services/header/header.service";
import { InstallationListDateFilterComponent } from "./components/date-filter/date-filter.component";
import { Subject, take, takeWhile } from "rxjs";
import { ListOfInstallationService } from "../../services/list-of-installation/list-of-installation.service";
import { NgxSpinnerService } from "ngx-spinner";
import { DialogService } from "../../services/dialog/dialog.service";
import { Router } from "@angular/router";
import { NewInstallationService } from "../../services/new-installation/new-installation.service";
import { NgxPullToRefreshModule } from "ngx-pull-to-refresh";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from "@angular/material/expansion";
import { MatIconButton, MatFabButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: 'pages-installation-list',
    templateUrl: './installation-list.component.html',
    styleUrls: ['./installation-list.component.scss'],
    standalone: true,
    imports: [NgxPullToRefreshModule, InfiniteScrollModule, MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatIconButton, MatIcon, MatFabButton, TranslateModule]
})
export class InstallationListComponent implements OnInit, OnDestroy {
    private headerService = inject(HeaderService);
    private bottomSheet = inject(MatBottomSheet);
    private listOfInstallationService = inject(ListOfInstallationService);
    private spinner = inject(NgxSpinnerService);
    private dialogService = inject(DialogService);
    private router = inject(Router);
    private newInstallationService = inject(NewInstallationService);


    alive: boolean = false;
    InstallationListdata: any[] = [];
    InstallationListDateFilterData: any[] = [];
    visibleInstallationListData: any[] = [];
    searchFilterApplied: boolean = false;
    dateFilterApplied: boolean = false;
    isEnable!: boolean;
    currentPage: number = 0;
    searchFilterCurrentPage: number = 0;
    dateFilterCurrentPage: number = 0;
    searchAndDateFilterCurrentPage: number = 0;
    searchString: string = '';
    dateFilter!: { startDate: string, endDate: string };
    enablePullToRefresh: boolean = false;

    ngOnInit(): void {
        this.alive = true;
        this.newInstallationService.formData = {}
        this.getInstalledList();
        this.updateHeaderComponent();
        this.watchForSearchFilter();
    }

    ngOnDestroy(): void {
        this.alive = false;
        this.updateHeaderComponent();
    }

    updateHeaderComponent = () => {
        this.headerService.updateHeader({ title: 'list_of_installation', searchIcon: true });
    }

    getInstalledList = () => {
        this.spinner.show();
        this.currentPage = 0;
        this.listOfInstallationService.getListOfInstallation().pipe(take(1)).subscribe((res: any) => {
            if (res.status === 200) {
                this.InstallationListdata = res.data.installedList;
            }
            else {
                this.dialogService.openAlertDialog({ content: res.message });
            }
            this.spinner.hide();
        })
    }


    watchForSearchFilter = () => {
        this.headerService.watchHeaderSearchFilterChanges().pipe(takeWhile(() => this.alive)).subscribe((res: string) => {
            if (res && res !== '') {
                this.searchFilterApplied = true; // Updating Global variable that search filter is Applied.
                this.searchString = res; // assining search string to global variable.
                this.getFilteredInstallationList();
            }
            else {
                this.clearFilteredViewIfNotAnyFilteredApplied('search');
            }
        })
    }

    openDateFilterBottomSheet = () => {
        let direction = document.querySelector('html')?.getAttribute('dir');
        this.bottomSheet.open(InstallationListDateFilterComponent, {
            direction: direction as 'ltr' | 'rtl'
        }).afterDismissed().pipe(take(1)).subscribe((res: any) => {
            console.log(res);
            if (res === 'Clear Filter' || !res) {
                this.clearFilteredViewIfNotAnyFilteredApplied('date');
            }
            else {
                this.dateFilterApplied = true;
                let { startDate, endDate } = res;
                this.dateFilter = { startDate, endDate };
                this.getFilteredInstallationList();
            }
        })
    }

    clearFilteredViewIfNotAnyFilteredApplied = (filterName: 'date' | 'search') => {
        if (filterName === 'date') this.dateFilterApplied = false;
        else if (filterName === 'search') this.searchFilterApplied = false;

        if (this.dateFilterApplied || this.searchFilterApplied) this.getFilteredInstallationList();
        else this.getInstalledList();
    }

    myRefreshEvent(event: Subject<any>) {
        if (this.dateFilterApplied || this.searchFilterApplied) this.getFilteredInstallationList();
        else this.getInstalledList();
        event.next('');
    }

    navigetToEdit(srialNo: any) {
        this.router.navigateByUrl('home/new-installation/select-hierarchy/' + srialNo)
    }

    loadMoreInstalledList = () => {
        // Setting Page number for pagination.
        let pageNo: number;
        if (this.searchFilterApplied && this.dateFilterApplied) pageNo = this.searchAndDateFilterCurrentPage;
        else if (this.searchFilterApplied) pageNo = this.searchFilterCurrentPage;
        else if (this.dateFilterApplied) pageNo = this.dateFilterCurrentPage;
        else pageNo = this.currentPage;

        // Setting Mode for pagination
        let mode: 'default' | 'search' | 'date' = this.dateFilterApplied ? 'date' : this.searchFilterApplied ? 'search' : 'default';

        // Setting MetaData required to pagination in different mode.
        let metaData: {
            search?: string,
            startDate?: string,
            endDate?: string
        } = {};
        if (this.searchFilterApplied) metaData.search = this.searchString;
        if (this.dateFilterApplied) metaData = { ...metaData, ...this.dateFilter };

        this.spinner.show();
        this.listOfInstallationService.paginationUpdate(pageNo + 1, mode, metaData)
            .pipe(takeWhile(() => this.alive), take(1))
            .subscribe((res: any) => {
                if (res.status === 200) {
                    // Updating Pagination Globally.
                    if (this.searchFilterApplied && this.dateFilterApplied) this.searchAndDateFilterCurrentPage = pageNo + 1;
                    else if (this.searchFilterApplied) this.searchFilterCurrentPage = pageNo + 1;
                    else if (this.dateFilterApplied) this.dateFilterCurrentPage = pageNo + 1;
                    else this.currentPage = pageNo + 1;

                    // Appending Pagination data received from API Call to currently available data.
                    this.InstallationListdata = [...this.InstallationListdata, ...res.data.installedList];
                }
                else {
                    this.dialogService.openAlertDialog({ content: res.message });
                }
                this.spinner.hide();
            })
    }

    getFilteredInstallationList = () => {
        this.spinner.show();
        this.currentPage = this.searchAndDateFilterCurrentPage = this.searchFilterCurrentPage = this.dateFilterCurrentPage = 0;

        let metaData: { search?: string, startDate?: string, endDate?: string } = {};
        if (this.searchFilterApplied) metaData.search = this.searchString;
        if (this.dateFilterApplied) metaData = { ...metaData, ...this.dateFilter };

        this.listOfInstallationService.getFilteredInstallationList(metaData).pipe(takeWhile(() => this.alive), take(1)).subscribe((res: any) => {
            if (res.status === 200) {
                this.InstallationListdata = res.data.installedList;
            }
            else {
                this.dialogService.openAlertDialog({ content: res.message });
            }
            this.spinner.hide();
        })
    }

    scroll(event: Event) {
        
        let scrollTop = (event.target as HTMLElement).scrollTop;
        this.enablePullToRefresh = (scrollTop === 0) ? true : false;
    }
}