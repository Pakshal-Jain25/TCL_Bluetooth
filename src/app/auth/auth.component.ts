import { Component } from "@angular/core";
import { urlConstants } from "../constants/url/url-constants";
import { NgClass } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: 'app-auth',
    // standalone: true,
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
    standalone: true,
    imports: [NgClass, RouterOutlet, TranslateModule]
})
export class AuthComponent {
    logoSrc: string = urlConstants.LOCAL;
}