import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { urlConstants } from "../../constants/url/url-constants";

@Injectable({
    providedIn: 'root'
})
export class NewInstallationService {
    private http = inject(HttpClient);
 

    private formStepper$: Subject<null> = new Subject<null>();
    private showPerformTestButton$: Subject<boolean> = new Subject<boolean>();
    private nextButtonLabel$: Subject<string> = new Subject<string>();
    private baseUrl: string = urlConstants.BASE_URL;
    public setPositionOfNextBtn = new BehaviorSubject(false);
    public selectedImageList: string[] = [];
    locationCategoryData: any = [];
    categoryData: any = [];
    brandNameData: any = [];
    formData: any = {};
    projectDetails: any;
    snapsFormData!: FormData

    updateFormStepper = (): void => {
        this.formStepper$.next(null);
    }

    watchForFormStepperUpdate = (): Observable<null> => {
        return this.formStepper$.asObservable();
    }

    togglePerfomTestButton = (data: boolean) => {
        this.showPerformTestButton$.next(data);
    }

    watchForperformTestButton = (): Observable<boolean> => {
        return this.showPerformTestButton$.asObservable();
    }

    updateNextButtonLabel = (data: string) => {
        this.nextButtonLabel$.next(data);
    }

    watchNextButtonLabelUpdate = (): Observable<string> => {
        return this.nextButtonLabel$.asObservable();
    }

    getProperty = () => {
        return this.http.get(this.baseUrl + urlConstants.API_SUFFIX.NEW_INSTALLATION.PROPERTY);
    }
    getProjectDetails = () =>{
        return this.http.get(this.baseUrl + urlConstants.API_SUFFIX.NEW_INSTALLATION.PROJECTSYNC)
    }

    getSerialNo = () => {
        return this.http.get(this.baseUrl + urlConstants.API_SUFFIX.NEW_INSTALLATION.SERIAL_NO);
    }

    getDeviceHistoryWithSerialNo = (serialNo: string) => {
        let queryParam: HttpParams = new HttpParams();
        queryParam = queryParam.append('serialNo', serialNo);
        return this.http.get(this.baseUrl + urlConstants.API_SUFFIX.NEW_INSTALLATION.DEVICE_HISTORY, {params: queryParam})
    }

    verifyDeviceWithSerialNo = (serialNo: string) => {
        let queryParam: HttpParams = new HttpParams();
        queryParam = queryParam.append('serialNo', serialNo);
        return this.http.get(this.baseUrl + urlConstants.API_SUFFIX.NEW_INSTALLATION.DEVICE_VERIFY, {params: queryParam})
    }

    getLocationCategory = () => {
        return this.http.get(this.baseUrl + urlConstants.API_SUFFIX.NEW_INSTALLATION.LOCATION_CATEGORY);
    }

    getCategory = () => {
        return this.http.get(this.baseUrl + urlConstants.API_SUFFIX.NEW_INSTALLATION.CATEGORY);
    }

    checkForDuplicatePoleNo = (poleNo: string) => {
        let propertyId = this.formData.propertyId;
        let queryParam: HttpParams = new HttpParams().append('poleNo', poleNo).append('propertyId', propertyId);
        
        return this.http.get(this.baseUrl + urlConstants.API_SUFFIX.NEW_INSTALLATION.POLE_NUMBER_DUPLICATE,{params: queryParam})
    }

    getBrandname = () => {
        return this.http.get(this.baseUrl + urlConstants.API_SUFFIX.NEW_INSTALLATION.LAMP_BRAND_NAME);
    }

    syncDeviceData = (data: any) => {
        return this.http.post(this.baseUrl + urlConstants.API_SUFFIX.NEW_INSTALLATION.DEVICE_SYNC, data)
    }

    requestForDiviceCommunication = (data: any) => {
        return this.http.post(this.baseUrl + urlConstants.API_SUFFIX.NEW_INSTALLATION.DEVICE_REQUEST, data);
    }

    getImage = (data: string) => {
        return this.http.get(data, { responseType: 'blob' });
    }

    uploadSnaps = (data: FormData) => {
        let queryParams: HttpParams = new HttpParams().append('historyId', this.formData.deviceEui).append('type', 'ILM');
        return this.http.post(this.baseUrl + urlConstants.API_SUFFIX.NEW_INSTALLATION.UPLOAD_SNAPS, data, { params: queryParams });
    }

    submitFormData = (data: any) => {
        return this.http.post(this.baseUrl + urlConstants.API_SUFFIX.NEW_INSTALLATION.TEST_3, data);
    }
    getHistoryOfSerialNo=(serialNo:string)=>{
        return this.http.get(this.baseUrl+ urlConstants.API_SUFFIX.NEW_INSTALLATION.HISTORY + serialNo)
    }


}