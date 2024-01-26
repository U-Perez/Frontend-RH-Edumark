import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Employee } from '../../../interface/employee';

const API_URL = environment.API_URL + 'empleado/empresa/';
const API_URL_EMPLOYEE = environment.API_URL + 'empleado/';
const API_URL_ENTIDAD = environment.API_URL + 'empleado/entidad/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeCompanyService {

  constructor(private http: HttpClient) { }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${API_URL_EMPLOYEE}${id}`)
  }

  getEmployees(id: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${API_URL}${id}`, httpOptions);
  }

  getEmployeesByEntidad(id: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${API_URL_ENTIDAD}${id}`, httpOptions);
  }

  addEmployee(entity: Employee): Observable<any> {
    return this.http.post(API_URL_EMPLOYEE, entity, httpOptions);
  }

  updateEmployee(id: number, entity: Employee): Observable<any> {
    return this.http.put(`${API_URL}${id}`, entity, httpOptions);
  }

  deleteEmployee(id: number) {
    return this.http.delete(`${API_URL_EMPLOYEE}${id}`, httpOptions);
  }

}
