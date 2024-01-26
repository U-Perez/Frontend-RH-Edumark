import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { Organizationtype } from '../../../../interface/organizationtype';
import { Giro } from 'src/app/interface/giro';
import { Organization } from 'src/app/interface/organization';

import { CrudTipoentidadService } from '../../../connection/api/crud-tipoentidad.service';
import { CrudOrganizationService } from '../../../connection/api/crud-organization.service';
import { CrudGiroService } from '../../../connection/api/crud-giro.service';

@Component({
  selector: 'app-register-organization',
  templateUrl: './register-organization.component.html',
  styleUrls: ['./register-organization.component.scss'],
})
export class RegisterOrganizationComponent implements OnInit, OnDestroy {
  organizationForm: FormGroup;

  organization: Organization = {
    id: null,
    nombre: '',
    ubicacion: '',
    representante: '',
    telefono: '',
    correo: '',
    rfc: '',
    password: '',
    foto: 'https://placehold.co/40x40',
    giroId: 0,
    tipoentidadId: 0,
  };

  typegiro: Giro = {
    id: 0,
    tipo: '',
  }

  typeorganizations: Organizationtype = {
    id: 0,
    tipo: '',
  };

  private subscriptions: Array<Subscription> = [];
  types: Organizationtype[];
  giros: Giro[];
  location: any;

  constructor(

    public modalController: ModalController,
    private type: CrudTipoentidadService,
    private giro: CrudGiroService,
    private organizationService: CrudOrganizationService,
    private router: Router,
    private alertController: AlertController

  ) {
  }

  ngOnInit(): void {

    this.organizationForm = new FormGroup({
      tipoentidadId: new FormControl(null, Validators.required),
      nombre: new FormControl(null, Validators.required),
      ubicacion: new FormControl(null, Validators.required),
      giroId: new FormControl(null, Validators.required),
      rfc: new FormControl(null, [
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(13),
      ]),
      representante: new FormControl(null, Validators.required),
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

    const newTypes = this.type.getTypes().subscribe(
      next => {
        this.types = next;
      }
    );

    const newGiros = this.giro.getGiros().subscribe(
      next => {
        this.giros = next;
      }
    );
    this.subscriptions.push(newTypes, newGiros);
  }


  addOrganization(): void {
    if (this.organizationForm.invalid) {
      // Verificar si el formulario es inválido y mostrar mensajes de validación si es necesario
      this.organizationForm.markAllAsTouched();
      return;
    }

    const organizationData = this.organizationForm.value;

    this.organizationService.addOrganization(organizationData).subscribe(
      () => {
        // Operaciones adicionales después de agregar la organización
        const alert = this.alertController.create({
          header: 'Éxito✔️',
          subHeader: '¡Todo salio bien!',
          message: 'Organización agregada con éxito',
          buttons: ['OK'],
        }).then((alert) => {
          alert.present(); // Mostrar el alert {
          this.router.navigate(['/login']); // Redirigir a la ruta '/login' después de cerrar la alerta
        });
      },
      (error) => {
        // Manejo de errores al agregar la organización
        const alert = this.alertController.create({
          header: 'Error❌',
          subHeader: '¡Algo salio mal!',
          message: 'La organización no se ha podido agregar',
          buttons: ['OK'],
        }).then((alert) => {
          alert.present(); // Mostrar el alert
        });
      }
    );
  }

  ngOnDestroy(): void {
    // Desuscribirse de todas las suscripciones cuando el componente se destruye
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
