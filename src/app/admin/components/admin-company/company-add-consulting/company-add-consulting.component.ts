import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { environment } from '../../../../../environments/environment';

import { Consulting } from '../../../../interface/consulting';
import { ConsultingCompanyService } from '../../../../admin/connection/api/consulting-company.service';

let empresaIdNumerico = localStorage.getItem('empresaId');
let empresaId = parseInt(empresaIdNumerico);

let entidadIdNumerico = localStorage.getItem('entidadId');
let entidadId = parseInt(entidadIdNumerico);

@Component({
  selector: 'app-company-add-consulting',
  templateUrl: './company-add-consulting.component.html',
  styleUrls: ['./company-add-consulting.component.scss'],
})
export class CompanyAddConsultingComponent implements OnInit {
  usuarioId: number;
  empresaId: number;
  @ViewChild(IonModal) modal: IonModal;
  @ViewChild('addUserModal') addUserModal: IonModal; // Agrega este ViewChild
  userForm: FormGroup;
  statusForm: FormGroup;
  isAddModalOpen = false;
  isUpdateModalOpen = false;
  isUpdateStatusModalOpen = false;
  selectedUser: Consulting;
  selectedConsultingId: number;

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
    this.isUpdateStatusModalOpen = !isAddModal ? isOpen : false;

    if (!isOpen && !isAddModal) {
      // Si el modal de edición se está cerrando, restablecer el formulario del modal de edición
      this.userForm.reset();
    }
  }

  openUpdateModal(consulting: Consulting) {
    this.selectedUser = consulting;
    this.userForm.patchValue({
      title: consulting.title,
      description: consulting.description,
      time: consulting.time
    });
    this.isUpdateModalOpen = true;
  }

  // Método para abrir el modal de actualización de estado
  openUpdateStatusModal(consulting: Consulting) {
    this.selectedConsultingId = consulting.id; // Guardar el ID de la asesoría seleccionada
    this.statusForm.patchValue({
    });
    this.isUpdateStatusModalOpen = true;
  }

  // Método para cerrar el modal de actualización de estado
  closeUpdateStatusModal() {
    this.isUpdateStatusModalOpen = false;
  }

  closeUpdateModal() {
    this.isUpdateModalOpen = false; // Cierra el modal de actualización
    this.setOpen(false, true); // Restablece el formulario del modal de agregar usuario
  }

  consulting: Consulting = {
    id: null,
    title: '',
    description: '',
    time: '',
    comment: '',
    status: null,
    empresaId: null,
    entidadId: null,
    usuarioId: null,
    empleadoId: null,
  }

  private subscriptions: Array<Subscription> = [];
  consultings: Consulting[];

  constructor(
    public modalController: ModalController,
    private service: ConsultingCompanyService,
    private router: Router,
    private alertController: AlertController
  ) {
    // Obtener el valor del localStorage y convertirlo a número (si es necesario)
    const usuarioIdString = localStorage.getItem('usuarioId');
    this.usuarioId = Number(usuarioIdString);

    const empresaIdString = localStorage.getItem('empresaId');
    this.empresaId = Number(empresaIdString);
  }

  ngOnInit() {

    this.userForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      time: new FormControl(null, Validators.required),
      comment: new FormControl(null),
      status: new FormControl(null),
    });

    this.statusForm = new FormGroup({
      comment: new FormControl(null, Validators.required),
      status: new FormControl(null, Validators.required),
    });

    // Asigna los valores del usuario seleccionado al formulario de actualización
    this.userForm.patchValue(this.selectedUser);

    const newUsers = this.service.getConsultings(empresaId).subscribe(
      next => {
        this.consultings = next;
        console.log(this.consultings)
      }
    );

    this.subscriptions.push(newUsers);
  }

  refreshEmployees(): void {
    this.service.getConsultings(empresaId).subscribe(
      (employees) => {
        this.consultings = employees;
      }
    );
  }

  addConsulting(): void {
    if (this.userForm.invalid) {
      // Verificar si el formulario es inválido y mostrar mensajes de validación si es necesario
      this.userForm.markAllAsTouched();
      return;
    }

    const employeeData = {
      ...this.userForm.value,
      empresaId: empresaId, // Agregar el valor de empresaId desde localStorage
      usuarioId: this.usuarioId, // Agregar el valor de usuarioId desde localStorage
    };

    this.service.addConsulting(employeeData).subscribe(
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

  async deleteConsulting(ConsultingId: number) {
    const alert = await this.alertController.create({
      header: 'Finalizar asesoria',
      message: '¿Estás seguro de que quieres finalizar esta asesoria?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Finalizar',
          cssClass: 'danger',
          handler: () => {
            this.service.deleteConsulting(ConsultingId).subscribe(
              () => {
                // Eliminación exitosa, aquí puedes mostrar una notificación de éxito
                this.showSuccessAlert('Asesoria finalizada exitosamente');
                // Vuelve a cargar la lista de blogs después de eliminar uno
                this.loadBlogs();
              },
              (error) => {
                console.error('Error al finalizar asesoria', error);
                // Aquí puedes mostrar una notificación de error si lo deseas
                this.showErrorAlert('Error al finalizar asesoria');
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

  async loadBlogs() {
    // Obtén el empresaId del localStorage y conviértelo a número
    const empresaIdNumerico = localStorage.getItem('empresaId');
    const empresaId = parseInt(empresaIdNumerico);

    // Llama al servicio para obtener la lista de blogs
    this.service.getConsultings(empresaId).subscribe(
      (blogs) => {
        this.consultings = blogs;
      },
      (error) => {
        console.error('Error al obtener la lista de asesorias', error);
      }
    );
  }

  openModal(consulting: Consulting): void {
    this.selectedUser = { ...consulting }; // Hacer una copia del objeto user para evitar modificarlo directamente

    // Establecer los valores del usuario seleccionado en el formulario de actualización
    this.userForm.patchValue({
      title: this.selectedUser.title,
      description: this.selectedUser.description,
      time: this.selectedUser.time,

    });
  }


  updateEmployee(): void {
    if (this.userForm.invalid) {
      // Verificar si el formulario es inválido y mostrar mensajes de validación si es necesario
      this.userForm.markAllAsTouched();
      return;
    }

    const updatedEmployee: Consulting = {
      ...this.selectedUser, // Mantener los campos existentes del usuario
      ...this.userForm.value // Actualizar los campos modificados en el formulario
    };

    this.service.updateConsulting(updatedEmployee.id, updatedEmployee).subscribe(
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

  // Método para actualizar el estado de la asesoría
  updateStatus(): void {
    if (this.statusForm.invalid) {
      this.statusForm.markAllAsTouched();
      return;
    }

    const updatedStatus = this.statusForm.value;

    // Obtener la asesoría seleccionada para actualizar el estado
    const selectedConsulting = this.consultings.find((consulting) => consulting.id === this.selectedConsultingId);

    // Combinar los valores actualizados del formulario con la asesoría seleccionada
    const updatedConsulting: Consulting = {
      ...selectedConsulting,
      ...updatedStatus,
    };

    this.service.updateConsulting(this.selectedConsultingId, updatedConsulting).subscribe(
      () => {
        const alert = this.alertController.create({
          header: 'Éxito ✔️',
          subHeader: '¡Todo salió bien!',
          message: 'Estado actualizado exitosamente',
          buttons: ['OK'],
        }).then((alert) => {
          alert.present();
        });

        this.closeUpdateStatusModal();
        this.refreshEmployees(); // Actualizar la lista de empleados
      },
      (error) => {
        const alert = this.alertController.create({
          header: 'Error ❌',
          subHeader: '¡Algo salió mal!',
          message: 'No se pudo actualizar el estado',
          buttons: ['OK'],
        }).then((alert) => {
          alert.present();
        });
      }
    );
  }

  ngOnDestroy(): void {
    // Desuscribirse de todas las suscripciones cuando el componente se destruye
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
