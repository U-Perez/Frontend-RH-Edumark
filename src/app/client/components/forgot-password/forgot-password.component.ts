import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  correo: string;

  constructor(
    private alertController: AlertController,
    private httpClient: HttpClient,
    private router: Router
  ) { }

  forgotPassword(): void {
    if (!this.correo) {
      // Mostrar un mensaje de error indicando que se deben ingresar el correo y la contraseña
      const alert = this.alertController
        .create({
          header: 'Error❌',
          subHeader: '¡Algo salió mal!',
          message: 'Debes ingresar el correo y la contraseña',
          buttons: ['OK'],
        })
        .then((alert) => {
          alert.present(); // Mostrar el alert
        });
      return; // Detener la ej decución de la función si no se han  s , cingresado el correo y la contraseña
    }

    const data = {
      correo: this.correo,
    };

    console.log(data);

    const query = this.httpClient
      .post(`${environment.API_URL}forgot-password`, data)
      .pipe(
        map((response: any) => {
          // Aquí puedes realizar cualquier manipulación necesaria con la respuesta del servidor
          console.log(response.data.data.id); // Puedes devolver la respuesta sin manipulación si no es necesario modificarla

          localStorage.setItem('employeeId', response.data.data.id);
          localStorage.setItem('token', response.token);
        })
      )
      .subscribe(
        () => {
          const alert = this.alertController
            .create({
              header: 'Éxito ✔',
              subHeader: 'Link  enviado ',
              message: ' Link  creado exitosamente',
              buttons: ['OK'],
            })
            .then((alert) => {
              alert.present();

              alert.onDidDismiss().then(() => {
                this.router.navigate(['']);
              });
            });
          console.log('Link   creado exitosamente ');

          // Agregar un tiempo de espera de 10 segundos antes de redirigir al login
          setTimeout(() => {
            this.router.navigate(['']);
          }, 5000); // 10000 milisegundos = 10 segundos
        },

        (error) => {
          const alert = this.alertController
            .create({
              header: 'Error ❌',
              subHeader: 'Error al mandar el  linkk ',
              message: 'No se pudo enviar el  link ',
              buttons: ['OK'],
            })
            .then((alert) => {
              alert.present();
            });
          console.error('Error al enviar  el link ', error);
        }
      );
  }

  ngOnInit() { }
}
