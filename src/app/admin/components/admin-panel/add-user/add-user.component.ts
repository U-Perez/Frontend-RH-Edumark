import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { environment } from '../../../../../environments/environment';

import { User } from '../../../../interface/user';

import { UserCompanyService } from '../../../../admin/connection/api/user-company.service';

let empresaIdNumerico = localStorage.getItem('empresaId');
let empresaId = parseInt(empresaIdNumerico);

let entidadIdNumerico = localStorage.getItem('entidadId');
let entidadId = parseInt(entidadIdNumerico);

let API_URL = environment.API_URL;

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  @ViewChild('addUserModal') addUserModal: IonModal; // Agrega este ViewChild
  userForm: FormGroup;
  isAddModalOpen = false;
  isUpdateModalOpen = false;
  selectedUser: User;

  async ngAfterViewInit() {
    const modal = await this.modalController.getTop(); // Obtén el modal actual
    if (modal && modal.componentProps && modal.componentProps['isOpen']) {
      // Si el modal actual es el de agregar usuario y está abierto, restablece el formulario
      this.userForm.reset();
    }
  }

  onAddModalDismiss() {
    this.isAddModalOpen = false;
  }

  setOpen(isOpen: boolean, isAddModal: boolean) {
    this.userForm.reset();
    this.isAddModalOpen = isAddModal ? isOpen : false;
    this.isUpdateModalOpen = !isAddModal ? isOpen : false;

    if (!isOpen && !isAddModal) {
      // Si el modal de edición se está cerrando, restablecer el formulario del modal de edición
      this.userForm.reset();
    }
  }
  openUpdateModal(user: User) {
    this.selectedUser = user;
    this.userForm.patchValue({
      nombre: user.nombre,
      correo: user.correo,
      password: user.password
    });
    this.isUpdateModalOpen = true;
  }


  closeUpdateModal() {
    this.isUpdateModalOpen = false; // Cierra el modal de actualización
    this.setOpen(false, true); // Restablece el formulario del modal de agregar usuario
  }

  user: User = {
    id: null,
    nombre: '',
    correo: '',
    password: '',
    empresaId: null,
    entidadId: null,
  }

  private subscriptions: Array<Subscription> = [];
  users: User[];

  constructor(
    public modalController: ModalController,
    private service: UserCompanyService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {

    this.userForm = new FormGroup({
      nombre: new FormControl(null, Validators.required),
      correo: new FormControl(null, [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
    });

    // Asigna los valores del usuario seleccionado al formulario de actualización
    this.userForm.patchValue(this.selectedUser);

    const newUsers = this.service.getUserbyentidad(entidadId).subscribe(
      next => {
        this.users = next;
      }
    );

    this.subscriptions.push(newUsers);
  }

  refreshEmployees(): void {
    this.service.getUserbyentidad(entidadId).subscribe(
      (employees) => {
        this.users = employees;
      }
    );
  }

  addEmployee(): void {
    if (this.userForm.invalid) {
      // Verificar si el formulario es inválido y mostrar mensajes de validación si es necesario
      this.userForm.markAllAsTouched();
      return;
    }

    const employeeData = {
      ...this.userForm.value,
      entidadId: entidadId, // Agregar el valor de empresaId desde localStorage
    };

    this.service.addUser(employeeData).subscribe(
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
          this.userForm.reset();
          // Cerrar el modal
          this.setOpen(false, false);
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

  openModal(user: User): void {
    this.selectedUser = { ...user }; // Hacer una copia del objeto user para evitar modificarlo directamente

    // Establecer los valores del usuario seleccionado en el formulario de actualización
    this.userForm.patchValue({
      nombre: this.selectedUser.nombre,
      correo: this.selectedUser.correo,
      password: this.selectedUser.password
    });
  }


  updateEmployee(): void {
    if (this.userForm.invalid) {
      // Verificar si el formulario es inválido y mostrar mensajes de validación si es necesario
      this.userForm.markAllAsTouched();
      return;
    }

    const updatedEmployee: User = {
      ...this.selectedUser, // Mantener los campos existentes del usuario
      ...this.userForm.value // Actualizar los campos modificados en el formulario
    };

    this.service.updateUser(updatedEmployee.id, updatedEmployee).subscribe(
      () => {
        // Operaciones adicionales después de actualizar el usuario
        const alert = this.alertController.create({
          header: 'Éxito ✔️',
          subHeader: '¡Todo salió bien!',
          message: 'Usuario actualizado exitosamente',
          buttons: ['OK'],
        }).then((alert) => {
          alert.present(); // Mostrar el alert
        });

        // Reiniciar el formulario y cerrar el modal de actualización
        this.userForm.reset();
        this.closeUpdateModal();
        this.refreshEmployees(); // Actualizar la lista de empleados
      },
      (error) => {
        // Manejo de errores al actualizar el usuario
        const alert = this.alertController.create({
          header: 'Error ❌',
          subHeader: '¡Algo salió mal!',
          message: 'No se pudo actualizar el usuario',
          buttons: ['OK'],
        }).then((alert) => {
          alert.present(); // Mostrar el alert
        });
      }
    );
  }

  async deleteEmployee(user: User) {
    const alert = await this.alertController.create({
      header: 'Eliminar usuario',
      message: '¿Estás seguro de que quieres eliminar este usuario?',
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
            this.service.deleteUser(user.id).subscribe(
              () => {
                // Eliminación exitosa, aquí puedes mostrar una notificación de éxito
                this.showSuccessAlert('Usuario eliminado exitosamente');
                // Vuelve a cargar la lista de blogs después de eliminar uno
                this.refreshEmployees();
              },
              (error) => {
                console.error('Error al eliminar el usuario', error);
                // Aquí puedes mostrar una notificación de error si lo deseas
                this.showErrorAlert('Error al eliminar el usuario');
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