import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { Organization } from '../../../../interface/organization';
import { Company } from '../../../../interface/company';
import { Employee } from '../../../../interface/employee';

import { CrudOrganizationService } from '../../../connection/api/crud-organization.service';
import { CrudCompanyService } from '../../../connection/api/crud-company.service';
import { CrudEmployeeService } from '../../../connection/api/crud-employee.service';

@Component({
  selector: 'app-register-employee',
  templateUrl: './register-employee.component.html',
  styleUrls: ['./register-employee.component.scss'],
})
export class RegisterEmployeeComponent implements OnInit, OnDestroy {
  employeeForm: FormGroup;

  public getOrganization(organization: Organization): { id: number, nombre: string } {
    const { id, nombre } = organization;
    return { id, nombre };
  }

  public getcompany(company: Company): { id: number, nombre: string } {
    const { id, nombre } = company;
    return { id, nombre };
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
    empresaId: 0,
    entidadId: null,
  }

  private subscriptions: Array<Subscription> = [];
  organizations: Organization[];
  companys: Company[];
  location: any;

  constructor(
    public modalController: ModalController,
    private companyService: CrudCompanyService,
    private employeeService: CrudEmployeeService,
    private organizationService: CrudOrganizationService,
    private router: Router,
    private alertController: AlertController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    const id = this.route.snapshot.params['id'];

    this.employeeForm = new FormGroup({
      entidadId: new FormControl(null),
      empresaId: new FormControl(null),
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

    const newOrganizations = this.organizationService.getOrganizations().subscribe(
      next => {
        this.organizations = next;
        console.log(this.organizations)
      }
    );

    const newCompanys = this.companyService.getCompanys().subscribe(
      next => {
        this.companys = next;
      }
    );
    this.subscriptions.push(newOrganizations, newCompanys);
  }

  addEmployee(): void {
    if (this.employeeForm.invalid) {
      // Verificar si el formulario es inválido y mostrar mensajes de validación si es necesario
      this.employeeForm.markAllAsTouched();
      return;
    }

    const employeeData = this.employeeForm.value;

    this.employeeService.addEmployeeLink(employeeData).subscribe(
      () => {
        // Operaciones adicionales después de agregar la empresa
        const alert = this.alertController.create({
          header: 'Éxito✔️',
          subHeader: '¡Todo salio bien!',
          message: 'Te has registrado con éxito',
          buttons: ['OK'],
        }).then((alert) => {
          alert.present(); // Mostrar el alert {
          this.router.navigate(['']); // Redirigir a la ruta '/login' después de cerrar la alerta
        });
      },
      (error) => {
        // Manejo de errores al agregar la empresa
        const alert = this.alertController.create({
          header: 'Error❌',
          subHeader: '¡Algo salio mal!',
          message: 'No se ha podido completar tu registro',
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
