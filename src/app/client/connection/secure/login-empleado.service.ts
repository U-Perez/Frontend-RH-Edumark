import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

const API_URL = environment.API_URL + 'empleado/login';

@Injectable({
  providedIn: 'root'
})
export class LoginEmpleadoService {

  constructor(private http: HttpClient, private router: Router) { }

  login(correo: string, password: string): Promise<boolean> {
    this.logout();
    return this.http.post<any>(API_URL, { correo, password })
      .toPromise()
      .then(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('empresaId', response.empleado.empresaId);
          localStorage.setItem('empleadoId', response.empleado.id);
          localStorage.setItem('secretKey', environment.SECRET_KEY);
          this.router.navigate(['', 'empleado']);
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
    this.router.navigate(['']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    const secretKey = localStorage.getItem('secretKey');
    return token !== null && secretKey === environment.SECRET_KEY;
  }

}
