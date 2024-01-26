import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Giro } from '../../../interface/giro';

const API_URL = environment.API_URL + 'giro/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class CrudGiroService {

  constructor(private http: HttpClient) { }

  getGiros(): Observable<Giro[]> {
    return this.http.get<Giro[]>(API_URL);
  }
}
