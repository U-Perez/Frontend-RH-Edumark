import { Component, OnInit } from '@angular/core';
import { LoginEntidadService } from '../../../../client/connection/secure/login-entidad.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

  constructor(private logoutService: LoginEntidadService) { }

  ngOnInit() {
  }

  logout(): void {
    this.logoutService.logout()
  }


}

