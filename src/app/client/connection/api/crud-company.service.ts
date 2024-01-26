import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Company } from '../../../interface/company';

const API_URL = environment.API_URL + 'empresa/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class CrudCompanyService {

  constructor(private http: HttpClient) { }

  getCompanys(): Observable<Company[]> {
    return this.http.get<Company[]>(API_URL);
  }

  getCompany(id: number): Observable<Company> {
    return this.http.get<Company>(`${API_URL}${id}`)
  }

  addCompany(entity: Company): Observable<any> {
    return this.http.post(API_URL, entity, httpOptions);
  }

  updateCompany(id: number, entity: Company): Observable<any> {
    return this.http.put(`${API_URL}${id}`, entity, httpOptions);
  }

  deleteCompany(id: number) {
    return this.http.delete(`${API_URL}${id}`, httpOptions);
  }
}
