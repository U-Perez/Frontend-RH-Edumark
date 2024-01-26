import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { Giro } from '../../../../interface/giro';
import { Organization } from '../../../../interface/organization';
import { Company } from '../../../../interface/company';

import { CrudOrganizationService } from '../../../connection/api/crud-organization.service';
import { CrudGiroService } from '../../../connection/api/crud-giro.service';
import { CrudCompanyService } from '../../../connection/api/crud-company.service';


@Component({
  selector: 'app-register-company',
  templateUrl: './register-company.component.html',
  styleUrls: ['./register-company.component.scss'],
})
export class RegisterCompanyComponent implements OnInit, OnDestroy {
  companyForm: FormGroup;

  public getOrganization(organization: Organization): { id: number, nombre: string } {
    const { id, nombre } = organization;
    return { id, nombre };
  }

  typegiro: Giro = {
    id: 0,
    tipo: '',
  }

  company: Company = {
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
    entidadId: null,
  }

  private subscriptions: Array<Subscription> = [];
  organizations: Organization[];
  giros: Giro[];
  location: any;

  constructor(
    public modalController: ModalController,
    private companyService: CrudCompanyService,
    private giroService: CrudGiroService,
    private organizationService: CrudOrganizationService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {

    this.companyForm = new FormGroup({
      entidadId: new FormControl(null),
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
        Validators.pattern(/^[\d-+()]{10,20}$/),
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

    const newOrganizations = this.organizationService.getOrganizations().subscribe(
      next => {
        this.organizations = next;
        console.log(this.organizations)
      }
    );

    const newGiros = this.giroService.getGiros().subscribe(
      next => {
        this.giros = next;
      }
    );
    this.subscriptions.push(newOrganizations, newGiros);
  }

  addCompany(): void {
    if (this.companyForm.invalid) {
      // Verificar si el formulario es inválido y mostrar mensajes de validación si es necesario
      this.companyForm.markAllAsTouched();
      return;
    }

    const companyData = this.companyForm.value;

    this.companyService.addCompany(companyData).subscribe(
      () => {
        // Operaciones adicionales después de agregar la empresa
        const alert = this.alertController.create({
          header: 'Éxito✔️',
          subHeader: '¡Todo salio bien!',
          message: 'Empresa agregada con éxito',
          buttons: ['OK'],
        }).then((alert) => {
          alert.present(); // Mostrar el alert {
          this.router.navigate(['/login']); // Redirigir a la ruta '/login' después de cerrar la alerta
        });
      },
      (error) => {
        // Manejo de errores al agregar la empresa
        const alert = this.alertController.create({
          header: 'Error❌',
          subHeader: '¡Algo salio mal!',
          message: 'La empresa no se ha podido agregar',
          buttons: ['OK'],
        }).then((alert) => {
          alert.present(); // Mostrar el alert
        });
      }
    );
  }

  compareFn(option1: any, option2: any): boolean {
    return option1 === option2 || (option1 === null && option2 === undefined) || (option1 === undefined && option2 === null);
  }


  ngOnDestroy(): void {
    // Desuscribirse de todas las suscripciones cuando el componente se destruye
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
