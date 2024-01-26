import {
  Component,
  OnInit,
  ViewChild,
  signal,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
  EventInput,
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { IonModal, ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';

let empresaIdNumerico = localStorage.getItem('empresaId');
let empresaId = parseInt(empresaIdNumerico);

@Component({
  selector: 'app-company-calendar',
  templateUrl: './company-calendar.component.html',
  styleUrls: ['./company-calendar.component.scss'],
})
export class CompanyCalendarComponent implements OnInit {
  @Input() fecha: Date;

  data: string;
  @ViewChild(IonModal) modal: IonModal;
  events: any[] = [];
  eventForm: FormGroup;
  isModalOpen = false;
  setOpen(isOpen: boolean) {
    this.isModalOpen = false;
    setTimeout(() => {
      this.isModalOpen = isOpen;
    }, 10);
  }

  selectInfo: any;

  calendarVisible = signal(true);
  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: [], // Inicialmente no hay eventos, se actualizará con los datos obtenidos de la base de datos
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
  };
  currentEvents = signal<EventApi[]>([]);

  constructor(
    private changeDetector: ChangeDetectorRef,
    private httpClient: HttpClient,
    private alertController: AlertController,
    private modalController: ModalController
  ) {
    this.eventForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
  }

  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
    console.log('CalendarTooglee');
  }

  handleWeekendsToggle() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends;
  }

  async handleDateSelect(selectInfo: DateSelectArg | any) {
    // / const title = prompt('Please enter a new title for your event');

    this.setOpen(true);

    this.selectInfo = selectInfo;

    console.log(this.selectInfo);
  }

  addEvent() {
    const calendarApi = this.selectInfo.view.calendar;
    calendarApi.unselect();

    console.log(this.selectInfo.startStr);

    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    const data: EventInput = {
      title: this.eventForm.value.title,
      start: this.selectInfo.startStr,
      end: this.selectInfo.endStr,
      description: this.eventForm.value.description ,
      empresaId: empresaId,
    };

    calendarApi.addEvent(data);

    this.httpClient.post(`${environment.API_URL}calendar`, data).subscribe(
      () => {
        const alert = this.alertController
          .create({
            header: 'Éxito ✔',
            subHeader: 'Evento creado',
            message: 'Evento creado exitosamente',
            buttons: ['OK'],
          })
          .then((alert) => {
            alert.present();
            console.log(data);
          });
        console.log('Evento  creado exitosamente');
      },
      (error) => {
        const alert = this.alertController
          .create({
            header: 'Error ❌',
            subHeader: 'Error al crear el evento',
            message: 'No se pudo crear el evento',
            buttons: ['OK'],
          })
          .then((alert) => {
            alert.present();
          });
        console.error('Error al crear el evento', error);
      }
    );

    this.eventForm.reset();
    this.setOpen(false);
  }

  getEvents() {
    this.httpClient
      .get(`${environment.API_URL}calendar/empresa/` + empresaId)
      .subscribe((data: any) => {
        const backendEvents = data; // Suponiendo que la respuesta del backend es un array de   eventos
        const calendarEvents: EventInput[] = backendEvents.map(
          (event: any) => ({
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end,
            description: event.description,
          })
        );

        this.calendarOptions.events = calendarEvents;
      });
  }

  async handleEventClick(clickInfo: EventClickArg) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message:
        '¿Estás seguro de que deseas eliminar ' + clickInfo.event.title + '?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Acción cancelada');
          },
        },
        {
          text: 'Eliminar ',
          handler: () => {
            console.log('Acción aceptada');
            clickInfo.event.remove();
            this.httpClient
              .delete(`${environment.API_URL}calendar/` + clickInfo.event.id)
              .subscribe((data: any) => {
                console.log('eliminado');
              });
            console.log(clickInfo.event.id);
            // Aquí puedes ejecutar la acción que deseas realizar
          },
        },
      ],
    });

    await alert.present();
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }

  ngOnInit() {
    this.getEvents();
  }
}
