import { Component, OnInit } from '@angular/core';
import { IonMenu, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss'],
})
export class MobileMenuComponent implements OnInit {

  constructor(private menuController: MenuController) { }

  ngOnInit() {
    this.menuController.enable(true, 'mainMenu'); // Habilitar el menú por defecto al cargar el componente
  }

  onMenuButtonClick() {
    this.menuController.toggle('mainMenu');
  }

}