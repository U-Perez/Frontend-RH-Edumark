import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Consulting } from '../../../interface/consulting';

const API_URL = environment.API_URL + 'consulting/empresa/';
const API_URL_Consulting = environment.API_URL + 'consulting/';
const API_URL_ENTIDAD = environment.API_URL + 'consulting/entidad/';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
    providedIn: 'root'
})
export class ConsultingCompanyService {

    constructor(private http: HttpClient) { }

    getConsulting(id: number): Observable<Consulting> {
        return this.http.get<Consulting>(`${API_URL_Consulting}${id}`)
    }

    getConsultings(id: number): Observable<Consulting[]> {
        return this.http.get<Consulting[]>(`${API_URL}${id}`, httpOptions);
    }

    getConsultingsByEntidad(id: number): Observable<Consulting[]> {
        return this.http.get<Consulting[]>(`${API_URL_ENTIDAD}${id}`, httpOptions);
    }

    addConsulting(entity: Consulting): Observable<any> {
        return this.http.post(API_URL_Consulting, entity, httpOptions);
    }

    updateConsulting(id: number, entity: Consulting): Observable<any> {
        return this.http.put(`${API_URL_Consulting}${id}`, entity, httpOptions);
    }

    deleteConsulting(id: number) {
        return this.http.delete(`${API_URL_Consulting}${id}`, httpOptions);
    }

}
