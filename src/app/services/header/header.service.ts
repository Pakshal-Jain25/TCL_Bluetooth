import { Injectable } from "@angular/core";
import { Observable, ReplaySubject, Subject } from "rxjs";

export interface HeaderSubjectData {
    title?: string,
    searchIcon?: boolean,
    showHeader?: boolean,
    menuIcon?: 'menu' | 'back_arrow',
    disableBackButton?: boolean
}

@Injectable({
    providedIn: 'root'
})
export class HeaderService {

    // private headerSubject$: Subject<HeaderSubjectData> = new Subject<HeaderSubjectData>;
    private headerSubject$: ReplaySubject<HeaderSubjectData> = new ReplaySubject<HeaderSubjectData>(1)
    private headerSearchFilterSebject$: Subject<string> = new Subject<string>();
    private backButtonSubject$: Subject<null> = new Subject<null>();

    watchHeaderChanges = ():Observable<HeaderSubjectData> => {
        return this.headerSubject$.asObservable();
    }

    updateHeader = (data: HeaderSubjectData) => {
        this.headerSubject$.next(data);
    }

    watchHeaderSearchFilterChanges = (): Observable<string> => {
        return this.headerSearchFilterSebject$.asObservable();
    }

    applyHeaderSearchFilterChanges = (data: string) => {
        this.headerSearchFilterSebject$.next(data);
    }

    backButtonClickSimulator = () => {
        this.backButtonSubject$.next(null);
    }

    watchForBackButtonClick = () => {
        return this.backButtonSubject$.asObservable();
    }

 }