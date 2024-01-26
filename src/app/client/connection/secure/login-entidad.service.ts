import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

const API_URL = environment.API_URL + 'entidad/login';

@Injectable({
  providedIn: 'root'
})
export class LoginEntidadService {

  constructor(private http: HttpClient, private router: Router) { }

  login(correo: string, password: string): Promise<boolean> {
    this.logout();
    return this.http.post<any>(API_URL, { correo, password })
      .toPromise()
      .then(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('secretKey', environment.SECRET_KEY);
          localStorage.setItem('entidadId', response.empleado.id);
          this.router.navigate(['admin-panel']);
          return true;
        } else {
          return false;
        }
      })
      .catch(error => {
        console.error('Error during login:', error);
        return false;
      });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('secretKey');
    localStorage.removeItem('entidadId');
    this.router.navigate(['tipo-entidad']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    const secretKey = localStorage.getItem('secretKey');
    return token !== null && secretKey === environment.SECRET_KEY;
  }
}
