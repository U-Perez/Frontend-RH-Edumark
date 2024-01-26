import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Organizationtype } from '../../../interface/organizationtype';

const API_URL = environment.API_URL + 'tipoentidad';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class CrudTipoentidadService {

  constructor(private http: HttpClient) { }

  getTypes(): Observable<Organizationtype[]> {
    return this.http.get<Organizationtype[]>(API_URL);
  }
}
