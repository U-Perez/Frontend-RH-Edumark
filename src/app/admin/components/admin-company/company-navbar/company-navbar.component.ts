import { Component, OnInit } from '@angular/core';
import { CrudCompanyService } from '../../../../client/connection/api/crud-company.service';
import { Subscription } from 'rxjs';

import { Company } from 'src/app/interface/company';

let empresaIdNumerico = localStorage.getItem('empresaId');
let empresaId = parseInt(empresaIdNumerico);

@Component({
  selector: 'app-company-navbar',
  templateUrl: './company-navbar.component.html',
  styleUrls: ['./company-navbar.component.scss'],
})
export class CompanyNavbarComponent implements OnInit {

  private subscriptions: Array<Subscription> = [];

  company: Company = {
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
    entidadId: null,
  }

  constructor(private serviceCompany: CrudCompanyService) { }

  ngOnInit() {
    const newCompanys = this.serviceCompany.getCompany(empresaId).subscribe(
      next => {
        this.company = next;
      }
    );

    this.subscriptions.push(newCompanys);

  }

  ngOnDestroy(): void {
    // Desuscribirse de todas las suscripciones cuando el componente se destruye
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
