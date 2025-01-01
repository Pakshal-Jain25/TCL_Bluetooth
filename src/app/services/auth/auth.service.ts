import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { urlConstants } from "../../constants/url/url-constants";
import { AuthChangePasswordData } from "../../interface/auth-change-password-data";
import { LoginData } from "../../interface/login-data";
import { v4 as uuid } from 'uuid';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);


    /**
     * URLEndpoint of server stored in constant file to send all the HTTP request.
     */
    private baseUrl: string = urlConstants.BASE_URL;

    /**
     * @description
     * To generate an UUID and send to server to generate a csrfToken which is required for login.
     * 
     * @returns Observable of HTTP response
     */
    getCsrfToken = () => {
        let randomUUID: string = uuid();
        let headers: HttpHeaders = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8',
        });
        return this.http.post(this.baseUrl + urlConstants.API_SUFFIX.AUTH.CSRF_TOKEN, randomUUID, {headers})
    }

    /**
     * @description
     * Uses LoginData which is passed as an argument to send a login request for the respective user to server
     * And get appropriate response.
     * 
     * @param data User Credential like Username and password is passed as an Object argument.
     * @returns Observable of HTTP response
     */
    login = (data: LoginData) => {
        let headers: HttpHeaders = new HttpHeaders({
            'csrfToken': localStorage.getItem('csrfToken') as string
        });

        return this.http.post(this.baseUrl + urlConstants.API_SUFFIX.AUTH.LOGIN, data, { headers });
    }

    /**
     * @description receives Data as argument and send an http request to change password for the user on their first login to proceed further
     * @param data Object which containes data required for password change on first time login.
     * @returns Observable of HTTP response
     */
    changePassword = (data: AuthChangePasswordData) => {
        return this.http.post(this.baseUrl + urlConstants.API_SUFFIX.AUTH.CHANGE_PASSWORD, data)
    }
    /**
     * @description receives user Object consist of `username` and send a forgot password request to server.
     * @param data Object consist of `username`.
     * @returns Observable of HTTP response
     */
    forgotPassword = (data: { userName: string }) => {
        return this.http.post(this.baseUrl + urlConstants.API_SUFFIX.AUTH.FORGOT_PASSWORD, data);
    }

    /**
     * @description sends logout request to server with the user `authtoken`
     * @returns Object of HTTP response
     */
    logout = () => {
        return this.http.post(this.baseUrl + urlConstants.API_SUFFIX.AUTH.LOGOUT, null);
    }

    /**
     * @description Checks if user `auth_token` is present in localStorage or not and return Boolean value based on it.
     * @returns Boolean 
     */
    isAuthenticated = (): boolean => {
        let token = localStorage.getItem('auth_token');
        if (token) return true;
        else return false;
    }
}