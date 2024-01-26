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
  selector: 'app-company-add-employee',
  templateUrl: './company-add-employee.component.html',
  styleUrls: ['./company-add-employee.component.scss'],
})
export class CompanyAddEmployeeComponent implements OnInit {
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

    const newEmployees = this.service.getEmployees(empresaId).subscribe(
      next => {
        this.employees = next;
      }
    );

    this.subscriptions.push(newEmployees);
  }

  copyUrl() {
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.replace(/\/admin-panel.*/, '');
    const url = `${baseUrl}/registrar-empleado/${empresaId}`;
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
    this.service.getEmployees(empresaId).subscribe(
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
      empresaId: empresaId, // Agregar el valor de empresaId desde localStorage
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
          this.refreshEmployees(); // Actualizar la lista de empleados
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

  deleteEmployee(employee: Employee): void {
    const confirmDelete = confirm('¿Estás seguro de eliminar este empleado?');
    if (confirmDelete) {
      this.service.deleteEmployee(employee.id).subscribe(
        () => {
          // Operaciones adicionales después de eliminar el empleado
          const alert = this.alertController.create({
            header: 'Éxito ✔️',
            subHeader: '¡Todo salió bien!',
            message: 'Empleado eliminado exitosamente',
            buttons: ['OK'],
          }).then((alert) => {
            alert.present(); // Mostrar el alert
          });

          // Actualizar la lista de empleados después de la eliminación
          this.refreshEmployees();
        },
        (error) => {
          // Manejo de errores al eliminar el empleado
          const alert = this.alertController.create({
            header: 'Error ❌',
            subHeader: '¡Algo salió mal!',
            message: 'No se pudo eliminar el empleado',
            buttons: ['OK'],
          }).then((alert) => {
            alert.present(); // Mostrar el alert
          });
        }
      );
    }
  }

  ngOnDestroy(): void {
    // Desuscribirse de todas las suscripciones cuando el componente se destruye
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
