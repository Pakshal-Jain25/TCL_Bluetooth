import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";
import { urlConstants } from "../../../constants/url/url-constants";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: 'shared-splash-screen',
    templateUrl: './splash-screen.component.html',
    styleUrls: ['./splash-screen.component.scss'],
    standalone: true,
    imports: [TranslateModule]
})
export class SharedSplashScreenComponent implements OnInit {
    private router = inject(Router);


    readonly logoSrc: string = urlConstants.LOCAL;

    ngOnInit(): void {
        setTimeout(() => { 
            this.router.navigate(['/home']);
        },3000)
    }

}