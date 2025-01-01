import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from "@angular/core";
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from "@angular/material/sidenav";
import { HeaderService } from "../services/header/header.service";
import { LayoutSidebarComponent } from "./conponent/sidebar/sidebar.component";
import { LayoutHeaderComponent } from "./conponent/header/header.component";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    standalone: true,
    imports: [MatDrawerContainer, MatDrawer, LayoutSidebarComponent, MatDrawerContent, LayoutHeaderComponent, RouterOutlet]
})
export class LayoutComponent implements OnInit {
    private headerService = inject(HeaderService);
    private _cd = inject(ChangeDetectorRef);


    showHeader: boolean = true;

    @ViewChild('drawer') drawer!: MatDrawer;

    ngOnInit(): void {
        this.watchChangesForHeader();
    }

    watchChangesForHeader = () => {
        this.headerService.watchHeaderChanges().subscribe(({ showHeader }) => {
            let previousShowHeaderValue: boolean = this.showHeader;
            this.showHeader = (showHeader === false) ? showHeader : true;
            if (previousShowHeaderValue !== this.showHeader) this._cd.detectChanges();
            console.log('Layout Header Change Listener =>', this.showHeader);
        })
    }

    toggleDrawer = () => {
        this.drawer.toggle();
    }

    scrollToTop = () => {
        window.scrollTo(0,0);
    }
}