import { Component, OnInit } from '@angular/core';
import { LoginEntidadService } from '../../../../client/connection/secure/login-entidad.service';

@Component({
  selector: 'app-company-sidebar',
  templateUrl: './company-sidebar.component.html',
  styleUrls: ['./company-sidebar.component.scss'],
})
export class CompanySidebarComponent implements OnInit {

  constructor(private logoutService: LoginEntidadService) { }

  ngOnInit() { }

  logout(): void {
    this.logoutService.logout()
  }
}
