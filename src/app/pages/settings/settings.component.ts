import { Component, OnInit, inject } from "@angular/core";
import { NewInstallationService } from "../../services/new-installation/new-installation.service";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: 'pages-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    standalone: true,
    imports: [RouterOutlet]
})
export class SettingsComponent implements OnInit{
    private newInstallationservice = inject(NewInstallationService);

    ngOnInit(): void {
        this.newInstallationservice.formData ={}
    } 

    scrollToTop = () => {
        window.scrollTo(0,0);

    }

}