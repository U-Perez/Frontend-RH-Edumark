import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../../../interface/user';

const API_URL = environment.API_URL + 'user/empresa/';
const API_URL_USER = environment.API_URL + 'user/';
const API_URL_ENTIDAD = environment.API_URL + 'user/entidad/';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
    providedIn: 'root'
})
export class UserCompanyService {

    constructor(private http: HttpClient) { }

    getUser(id: number): Observable<User> {
        return this.http.get<User>(`${API_URL_USER}${id}`)
    }

    getUserbyentidad(id: number): Observable<User[]> {
        return this.http.get<User[]>(`${API_URL_ENTIDAD}${id}`, httpOptions);
    }

    getUsers(id: number): Observable<User[]> {
        return this.http.get<User[]>(`${API_URL}${id}`, httpOptions);
    }

    addUser(entity: User): Observable<any> {
        return this.http.post(API_URL_USER, entity, httpOptions);
    }

    updateUser(id: number, entity: User): Observable<any> {
        return this.http.put(`${API_URL_USER}${id}`, entity, httpOptions);
    }

    deleteUser(id: number) {
        return this.http.delete(`${API_URL_USER}${id}`, httpOptions);
    }

}
