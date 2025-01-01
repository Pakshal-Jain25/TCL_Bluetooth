import { Injectable, inject } from "@angular/core";
import { ShowOptions, Toast } from "@capacitor/toast";
import { TranslateService } from "@ngx-translate/core";
import { Observable, from, take } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    private translate = inject(TranslateService);


    show = (data: ShowOptions): Observable<void> => {
        data.text = this.getTranslatedToastData(data.text);
        return from(Toast.show(data)).pipe(take(1))
    }

    private getTranslatedToastData = (text: string) => {
        console.log(this.translate.instant('toast')?.[text]);
        return this.translate.instant('toast')?.[text];
    }

}