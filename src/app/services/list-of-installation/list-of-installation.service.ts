import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { urlConstants } from "../../constants/url/url-constants";


@Injectable({
    providedIn: 'root'
})
export class ListOfInstallationService {
    private http = inject(HttpClient);


    baseUrl: string = urlConstants.BASE_URL;

    getListOfInstallation = () => {
        const queryParam: HttpParams =
            new HttpParams()
                .append('fieldName', '')
                .append('status', 'Pass')
                .append('page', '0')
                .append('size', '50');
        return this.http.get(this.baseUrl + urlConstants.API_SUFFIX.LIST_OF_INSTALLATION.INSTALLED_LIST, { params: queryParam });
    }

    searchDeviceBySerialNoOrPoleNo = (searchQuery: string) => {
        const queryParam: HttpParams =
            new HttpParams()
                .append('fieldName', searchQuery)
                .append('status', 'Pass')
                .append('page', '0')
                .append('size', '50');
        return this.http.get(this.baseUrl + urlConstants.API_SUFFIX.LIST_OF_INSTALLATION.INSTALLED_LIST, { params: queryParam });
    }

    paginationUpdate = (
        /**
         * @requires
         * Page No of the page which date is requested 
         * 
         */
        pageNo: number,
        /**
         * @requires
         * In which mode does the pagination is requested Which are as follow :-
         * 
         * - `default` => This is  default mode where no filter is applied.
         * - `search` => When Search filter is applied.
         * - `date` => When data should be filterd by Date filter.
         * 
         */
        mode: 'default' | 'search' | 'date',
        /**
         * If a mode other than `default` is passed as argument metaData is required
         * 
         *
         * ```ts
         * {
         *      search: 'Search String',
         *      startDate: 'Start Date in String Format',
         *      endDate: 'End Date in String Format'
         * }
         * ```
         */
        metaData?: {
            search?: string,
            startDate?: string,
            endDate?: string
        }) => {
        let queryParam: HttpParams = new HttpParams();

        queryParam = queryParam.append('fieldName', metaData?.search || '');

        if (mode === 'date') {
            queryParam = queryParam
                .append('startDate', metaData?.startDate as string)
                .append('endDate', metaData?.endDate as string);
        }

        // Default Query Parameter which will be appended in respective to the mode of pagination.
        queryParam = queryParam
            .append('status', 'Pass')
            .append('page', `${pageNo}`)
            .append('size', '50');
        return this.http.get(this.baseUrl + urlConstants.API_SUFFIX.LIST_OF_INSTALLATION.INSTALLED_LIST, { params: queryParam });
    }

    getFilteredInstallationList = (filterData: { search?: string, startDate?: string, endDate?: string }) => {
        let queryParam: HttpParams = new HttpParams();

        queryParam = queryParam.append('fieldName', filterData?.search || '');

        if (filterData.startDate && filterData.endDate) {
            queryParam = queryParam
                .append('startDate', filterData?.startDate as string)
                .append('endDate', filterData?.endDate as string);
        }
        
        queryParam = queryParam
            .append('status', 'Pass')
            .append('page', '0')
            .append('size', '50');
        
        return this.http.get(this.baseUrl + urlConstants.API_SUFFIX.LIST_OF_INSTALLATION.INSTALLED_LIST, { params: queryParam });
    }

    filterDeviceByDate = (startDate: string, endDate: string) => {
        const queryParam: HttpParams =
            new HttpParams()
                .append('fieldName', '')
                .append('status', 'Pass')
                .append('startDate', startDate)
                .append('endDate', endDate)
                .append('page', '0')
                .append('size', '50');
        return this.http.get(this.baseUrl + urlConstants.API_SUFFIX.LIST_OF_INSTALLATION.INSTALLED_LIST, { params: queryParam });
    }
}