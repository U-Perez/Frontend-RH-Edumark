import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CrudOrganizationService } from 'src/app/client/connection/api/crud-organization.service';

import { Organization } from 'src/app/interface/organization';

let empresaIdNumerico = localStorage.getItem('empresaId');
let empresaId = parseInt(empresaIdNumerico);

let entidadIdNumerico = localStorage.getItem('entidadId');
let entidadId = parseInt(entidadIdNumerico);

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  private subscriptions: Array<Subscription> = [];

  organization: Organization = {
    id: null,
    nombre: '',
    ubicacion: '',
    representante: '',
    telefono: '',
    correo: '',
    rfc: '',
    password: '',
    foto: '',
    giroId: 0,
    tipoentidadId: 0,
  }



  constructor(private organizationService: CrudOrganizationService) { }

  ngOnInit() {
    const newCompanys = this.organizationService.getOrganization(entidadId).subscribe(
      (entidadData) => {
        this.organization = entidadData;
      },
      (error) => {
        console.log('Error al obtener los datos de la organización', error);
      }
    );

    this.subscriptions.push(newCompanys);

  }

  ngOnDestroy(): void {
    // Desuscribirse de todas las suscripciones cuando el componente se destruye
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
