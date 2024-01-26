import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { environment } from 'src/environments/environment';

import jwt_decode from 'jwt-decode'; // Importa la biblioteca jwt-decode

let employeeIddNumerico = localStorage.getItem('employeeId');
let employeeId = parseInt(employeeIddNumerico);

let token = localStorage.getItem('token');

interface DecodedToken {
  exp: number;
  // Agrega otras propiedades aquí si el token las contiene
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  password: string;
  confirmPassword: string;

  constructor(
    private alertController: AlertController,
    private httpClient: HttpClient,
    private router: Router
  ) { }

  resetPassword(): void {
    if (!this.password || !this.confirmPassword) {
      // Mostrar un mensaje de error indicando que ambos campos deben ser ingresados
      const alert = this.alertController.create({
        header: 'Error❌',
        subHeader: '¡Algo salió mal!',
        message: 'Debes ingresar la contraseña y confirmarla .',
        buttons: ['OK'],
      });
      alert.then((alert) => {
        alert.present(); // Mostrar el alert
      });
      return; // Detener la ejecución de la función si no se han ingresado ambas contraseñas
    }

    if (this.password !== this.confirmPassword) {
      // Mostrar un mensaje de error indicando que las contraseñas no coinciden
      const alert = this.alertController.create({
        header: 'Error❌',
        subHeader: '¡Algo salió mal!',
        message: 'Las contraseñas no coinciden.',
        buttons: ['OK'],
      });
      alert.then((alert) => {
        alert.present(); // Mostrar el alert
      });
      return; // Detener la ejecución de la función si las contraseñas no coinciden
    }

    const data = {
      password: this.password,
      token: token,
    };

    console.log(data, token);
    this.httpClient
      .post(`${environment.API_URL}reset-password/` + employeeId, data)
      .subscribe(
        () => {
          const alert = this.alertController
            .create({
              header: 'Éxito ✔',
              subHeader: 'Reset Password',
              message: 'Contraseña cambiado exitosamente',
              buttons: ['OK'],
            })
            .then((alert) => {
              alert.present();

              alert.onDidDismiss().then(() => {
                this.router.navigate(['/login']);
              });
            });
        },
        (error) => {
          const alert = this.alertController
            .create({
              header: 'Error ❌',
              subHeader: 'Error al cambiar la contraseña',
              message: 'No se pudo cambiar la contraseña',
              buttons: ['OK'],
            })
            .then((alert) => {
              alert.present();
            });

          console.error('Error al enviar el link ', error);
        }
      );
  }

  isTokenExpired(token: string): boolean {
    try {
      const decodedToken: DecodedToken = jwt_decode(token);
      const tokenExpirationDate = new Date(decodedToken.exp * 1000);
      const currentDate = new Date();
      return currentDate > tokenExpirationDate;
    } catch (error) {
      // Si ocurre algún error al decodificar el token, consideramos que ha expirado
      return true;
    }
  }

  ngOnInit() {
    const isTokenExpired = this.isTokenExpired(token);
    if (isTokenExpired) {
      localStorage.removeItem('token');
      localStorage.removeItem('employeeId');
      const alert = this.alertController
        .create({
          header: 'Error ❌',
          subHeader: 'Error al cambiar la contraseña',
          message:
            'El enlace ha expirado. Solicita  un nuevo enlace para restablecer la contraseña.',
          buttons: ['OK'],
        })
        .then((alert) => {
          alert.present();
          alert.onDidDismiss().then(() => {
            this.router.navigate(['/login']);
          });
        });
      return; // Dete ner la ejecución de la función si el token ha expirado
    }
  }
}
