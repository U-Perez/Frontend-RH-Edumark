import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Organization } from '../../../interface/organization';

const API_URL = environment.API_URL + 'entidad/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class CrudOrganizationService {

  constructor(private http: HttpClient) { }

  getOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(API_URL);
  }

  getOrganization(id: number): Observable<Organization> {
    return this.http.get<Organization>(`${API_URL}${id}`)
  }

  addOrganization(entity: Organization): Observable<any> {
    return this.http.post(API_URL, entity, httpOptions);
  }

  updateOrganization(id: number, entity: Organization): Observable<any> {
    return this.http.put(`${API_URL}${id}`, entity, httpOptions);
  }

  deleteOrganization(id: number) {
    return this.http.delete(`${API_URL}${id}`, httpOptions);
  }

}
