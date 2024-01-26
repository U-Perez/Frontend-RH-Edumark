import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoginEntidadService } from 'src/app/client/connection/secure/login-entidad.service';
import { LoginCompanyUserService } from '../../../connection/secure/login-company-user.service';

@Component({
  selector: 'app-login-entity',
  templateUrl: './login-entity.component.html',
  styleUrls: ['./login-entity.component.scss'],
})
export class LoginEntityComponent implements OnInit {
  correo: string;
  password: string;

  constructor(
    private loginService: LoginEntidadService,
    private router: Router,
    private alertController: AlertController,
    private loginUserService: LoginCompanyUserService,
  ) { }

  ngOnInit() { }

  login(): void {
    if (!this.correo || !this.password) {
      // Mostrar un mensaje de error indicando que se deben ingresar el correo y la contraseña
      const alert = this.alertController.create({
        header: 'Error❌',
        subHeader: '¡Algo salió mal!',
        message: 'Debes ingresar el correo y la contraseña',
        buttons: ['OK'],
      }).then((alert) => {
        alert.present(); // Mostrar el alert
      });
      return; // Detener la ejecución de la función si no se han ingresado el correo y la contraseña
    }

    this.loginService.login(this.correo, this.password)
      .then(success => {
        if (success) {
          // El login de la empresa fue exitoso
        } else {
          // Intentar el login de usuario
          this.loginUserService.login(this.correo, this.password)
            .then(userSuccess => {
              if (userSuccess) {
                // El login de usuario fue exitoso
                this.router.navigate(['admin-panel']);
              } else {
                // Ambos logins fallaron, mostrar mensaje de error
                const alert = this.alertController.create({
                  header: 'Error❌',
                  subHeader: '¡Algo salió mal!',
                  message: 'Correo o contraseña inválidos, vuelve a intentar',
                  buttons: ['OK'],
                }).then((alert) => {
                  alert.present(); // Mostrar el alert
                });
              }
            });
        }
      });
  }

}
