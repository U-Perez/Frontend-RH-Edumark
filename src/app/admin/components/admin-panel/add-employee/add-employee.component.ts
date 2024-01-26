import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { environment } from '../../../../../environments/environment';


import { Employee } from '../../../../interface/employee';

import { EmployeeCompanyService } from '../../../connection/api/employee-company.service';

let empresaIdNumerico = localStorage.getItem('empresaId');
let empresaId = parseInt(empresaIdNumerico);

let entidadIdNumerico = localStorage.getItem('entidadId');
let entidadId = parseInt(entidadIdNumerico);

let API_URL = environment.API_URL;

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
})
export class AddEmployeeComponent implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  employeeForm: FormGroup;
  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = false; // Establecer el estado como false primero para cerrar el modal

    setTimeout(() => {
      // Restablecer el formulario del modal
      this.isModalOpen = isOpen; // Establecer el estado como true para abrir el modal nuevamente
    }, 10);
  }

  employee: Employee = {
    id: null,
    nombre: '',
    noColaborador: '',
    correo: '',
    telefono: '',
    departamento: '',
    puesto: '',
    turno: '',
    password: '',
    empresaId: null,
    entidadId: null,
  }

  private subscriptions: Array<Subscription> = [];
  employees: Employee[];

  constructor(
    public modalController: ModalController,
    private service: EmployeeCompanyService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {

    this.employeeForm = new FormGroup({
      nombre: new FormControl(null, Validators.required),
      noColaborador: new FormControl(null, Validators.required),
      departamento: new FormControl(null, Validators.required,),
      puesto: new FormControl(null, Validators.required),
      turno: new FormControl(null, Validators.required),
      telefono: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[\d-]{10,20}$/),
      ]),
      correo: new FormControl(null, [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
    });

    const newEmployees = this.service.getEmployeesByEntidad(entidadId).subscribe(
      next => {
        this.employees = next;
      }
    );

    this.subscriptions.push(newEmployees);
  }

  copyUrl() {
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.replace(/\/admin-panel.*/, '');
    const url = `${baseUrl}/registrar-empleado/${entidadId}`;
    navigator.clipboard.writeText(url).then(() => {
      // Acciones adicionales después de copiar la URL al portapapeles
      const alert = this.alertController.create({
        header: 'URL Copiada ✔️',
        subHeader: '¡Todo salió bien!',
        message: 'El link de invitación se ha copiado al portapapeles correctamente.',
        buttons: ['OK'],
      }).then((alert) => {
        alert.present(); // Mostrar el alert
      });
    }).catch((error) => {
      // Manejo de errores al copiar la URL
      const alert = this.alertController.create({
        header: 'Error❌',
        subHeader: '¡Algo salió mal!',
        message: 'No se ha podido copiar el link de invitación',
        buttons: ['OK'],
      }).then((alert) => {
        alert.present(); // Mostrar el alert
      });
    });
  }

  refreshEmployees(): void {
    this.service.getEmployeesByEntidad(entidadId).subscribe(
      (employees) => {
        this.employees = employees;
      }
    );
  }

  addEmployee(): void {
    if (this.employeeForm.invalid) {
      // Verificar si el formulario es inválido y mostrar mensajes de validación si es necesario
      this.employeeForm.markAllAsTouched();
      return;
    }

    const employeeData = {
      ...this.employeeForm.value,
      entidadId: entidadId, // Agregar el valor de empresaId desde localStorage
    };

    this.service.addEmployee(employeeData).subscribe(
      () => {
        // Operaciones adicionales después de agregar la empresa
        const alert = this.alertController.create({
          header: 'Éxito✔️',
          subHeader: '¡Todo salió bien!',
          message: 'Te has registrado con éxito',
          buttons: ['OK'],
        }).then((alert) => {
          alert.present(); // Mostrar el alert {
          // Reiniciar el formulario del modal
          this.employeeForm.reset();
          // Cerrar el modal
          this.setOpen(false);
          // Vuelve a cargar la lista de blogs después de eliminar uno
          this.refreshEmployees();
        });
      },
      (error) => {
        // Manejo de errores al agregar la empresa
        const alert = this.alertController.create({
          header: 'Error❌',
          subHeader: '¡Algo salió mal!',
          message: 'No se ha podido completar tu registro',
          buttons: ['OK'],
        }).then((alert) => {
          alert.present(); // Mostrar el alert
        });
      }
    );
  }

  async deleteEmployee(employee: Employee) {
    const alert = await this.alertController.create({
      header: 'Eliminar empleado',
      message: '¿Estás seguro de que quieres eliminar este empleado?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          cssClass: 'danger',
          handler: () => {
            this.service.deleteEmployee(employee.id).subscribe(
              () => {
                // Eliminación exitosa, aquí puedes mostrar una notificación de éxito
                this.showSuccessAlert('Empleado eliminado exitosamente');
                // Vuelve a cargar la lista de blogs después de eliminar uno
                this.refreshEmployees();
              },
              (error) => {
                console.error('Error al eliminar el empleado', error);
                // Aquí puedes mostrar una notificación de error si lo deseas
                this.showErrorAlert('Error al eliminar el empleado');
              }
            );
          },
        },
      ],
    });

    await alert.present();
  }

  async showSuccessAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: message,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  ngOnDestroy(): void {
    // Desuscribirse de todas las suscripciones cuando el componente se destruye
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
