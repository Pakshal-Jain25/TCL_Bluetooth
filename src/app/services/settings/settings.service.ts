import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Observable, Subject, map } from "rxjs";
import { urlConstants } from "../../constants/url/url-constants";
import { SettingsChangePasswrodData } from "../../interface/settings-change-password-data";

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private http = inject(HttpClient);
    private sanitizer = inject(DomSanitizer);


    private baseUrl = urlConstants.BASE_URL;

    private profileUpdated$: Subject<string> = new Subject<string>();

    getUserProfileImage = (imageToken?: string) => {
        let userData = JSON.parse(localStorage.getItem('userData') as string);
        let profilePicture = imageToken || userData.profilePicture;

        return this.http.get(this.baseUrl + urlConstants.API_SUFFIX.SETTINGS.GET_PROFILE_PICTURE + profilePicture, { responseType: 'blob' }).pipe(
            map((res) => this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(res)))
        )
    }

    uploadProfilePicture = (data: FormData) => {
        return this.http.post(this.baseUrl + urlConstants.API_SUFFIX.SETTINGS.UPLOAD_PROFILE_PICTURE, data);
    }

    profilePhotoUpdated = (data: string): void => {
        this.profileUpdated$.next(data);
    }

    profilePhotoUpdateListener = (): Observable<string> => {
        return this.profileUpdated$.asObservable();
    }

    getImage = (data: string) => {
        return this.http.get(data, { responseType: 'blob' });
    }

    changePassword = (data: SettingsChangePasswrodData) => {
        return this.http.put(this.baseUrl + urlConstants.API_SUFFIX.SETTINGS.CHANGE_PASSWORD, data)
    }
}