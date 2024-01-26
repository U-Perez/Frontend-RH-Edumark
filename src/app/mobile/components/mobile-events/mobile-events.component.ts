import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-mobile-events',
  templateUrl: './mobile-events.component.html',
  styleUrls: ['./mobile-events.component.scss'],
})
export class MobileEventsComponent implements OnInit {
  calendarEvents: any[] = [];
  highlightedDates: any[] = [];
  selectedDate: string;
  displayFormat = 'YYYY-MM-DD';

  constructor(private httpClient: HttpClient, private alertController: AlertController) {
    this.selectedDate = new Date().toISOString().split('T')[0]; // Obtener solo la fecha sin la hora
  }

  ngOnInit() {
    this.getEvents();
  }

  getEvents() {
    const empresaIdNumerico = localStorage.getItem('empresaId');
    const empresaId = parseInt(empresaIdNumerico);

    this.httpClient
      .get(`${environment.API_URL}calendar/empresa/` + empresaId)
      .subscribe((data: any) => {
        this.calendarEvents = data;
        this.highlightedDates = this.formatHighlightedDates(this.calendarEvents);
      });
  }

  formatHighlightedDates(events: any[]): any[] {
    return events.map((event) => ({
      date: event.start.split('T')[0], // Obtener solo la fecha sin la hora
      textColor: 'white',
      backgroundColor: 'blue',
    }));
  }

  async onDateChange(event: any) {
    this.selectedDate = event.detail.value;
    const selectedEvent = this.calendarEvents.find(event => event.start === this.selectedDate);

    if (selectedEvent) {
      await this.presentAlert(selectedEvent.title, selectedEvent.description);
    }
  }

  async presentAlert(title: string, description: string) {
    const alert = await this.alertController.create({
      header: title,
      message: description,
      buttons: ['OK'],
    });

    await alert.present();
  }
}