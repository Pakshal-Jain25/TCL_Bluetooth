import { Component, OnInit, inject } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { HeaderService } from "../../../../services/header/header.service";
import { SafePipe } from "../../../../shared-component/pipe/safe.pipe";

@Component({
    selector: 'settings-terms-and-condition',
    templateUrl: './terms-and-condition.component.html',
    styleUrls: ['./terms-and-condition.component.scss'],
    standalone: true,
    imports: [TranslateModule, SafePipe]
})
export class SettingsTermsAndConditionComponent implements OnInit {
    private translateService = inject(TranslateService);
    protected sanitizer = inject(DomSanitizer);
    private headerService = inject(HeaderService);
 
    termsAndConditionContent: string[] = [];

    ngOnInit(): void {
        this.updateHeaderComponent();
        this.getTranslatedTermsAndConditionContent();
    }

    getTranslatedTermsAndConditionContent = () => {
        this.translateService.get('termsAndCondition').subscribe(({ body }) => {
            this.termsAndConditionContent = [...body];
            console.log(this.termsAndConditionContent);
        })
    }

    updateHeaderComponent = () => {
        this.headerService.updateHeader({ title: 'about' , menuIcon: 'back_arrow'});
    }
}