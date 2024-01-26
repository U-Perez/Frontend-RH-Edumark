import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

const API_URL = environment.API_URL + 'empresa/login';

@Injectable({
  providedIn: 'root'
})
export class LoginCompanyService {

  constructor(private http: HttpClient, private router: Router) { }

  login(correo: string, password: string): Promise<boolean> {
    this.removeItems();
    return this.http.post<any>(API_URL, { correo, password })
      .toPromise()
      .then(response => {
        if (response && response.token) {
          // Verificar si el correo y la contraseña son correctos
          if (correo === response.empresa.correo && password === response.empresa.password) {
            localStorage.setItem('empresaId', response.empresa.id);
            localStorage.setItem('token', response.token);
            localStorage.setItem('secretKey', environment.SECRET_KEY);
            this.router.navigate(['admin-panel', 'empresa']);
            return true;
          } else {
            // Contraseña o correo incorrectos
            return false;
          }
        } else {
          // No se obtuvo un token en la respuesta
          return false;
        }
      })
      .catch(error => {
        console.error('Error during login:', error);
        return false;
      });
  }

  logout(): void {
    this.removeItems();
    this.router.navigate(['login', 'empresa']);
  }

  removeItems(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('secretKey');
    localStorage.removeItem('empresaId');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    const secretKey = localStorage.getItem('secretKey');
    return token !== null && secretKey === environment.SECRET_KEY;
  }
}