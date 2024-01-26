import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Employee } from '../../../interface/employee';

const API_URL = environment.API_URL + 'empleado/';
const API_URL_LINK = environment.API_URL + 'empleado/register/:id';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class CrudEmployeeService {

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(API_URL);
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${API_URL}${id}`)
  }

  addEmployee(entity: Employee): Observable<any> {
    return this.http.post(API_URL, entity, httpOptions);
  }

  addEmployeeLink(entity: Employee): Observable<any> {
    return this.http.post(API_URL_LINK, entity, httpOptions);
  }

  updateEmployee(id: number, entity: Employee): Observable<any> {
    return this.http.put(`${API_URL}${id}`, entity, httpOptions);
  }

  deleteEmployee(id: number) {
    return this.http.delete(`${API_URL}${id}`, httpOptions);
  }
}
