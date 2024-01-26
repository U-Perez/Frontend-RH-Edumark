import { Component, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

let empresaIdNumerico = localStorage.getItem('empresaId');
let empresaId = parseInt(empresaIdNumerico);

@Component({
    selector: 'app-agregar-asesoria-modal',
    template: `
    <!-- Contenido del modal para agregar el comentario y estado -->
    <ion-header>
      <ion-toolbar>
        <ion-title>Agregar Asesoria</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="cerrarModal()">Cerrar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
    <div class="ion-padding">
    <ion-text color="warning"><ion-icon name="warning"></ion-icon></ion-text>
    "¡Importante! Al solicitar una asesoría, es fundamental que estés seguro/a de asistir. En el comentario, por favor, proporciona la fecha y hora en la que tienes 
    disponibilidad para llevar a cabo la asesoría. Esto nos ayudará a coordinar y brindarte el mejor servicio posible. ¡Gracias por tu colaboración!"
    </div>
      <form (ngSubmit)="agregarAsesoria()">
        <!-- Agrega los campos para el comentario y estado -->
        <ion-item>
          <ion-label position="floating">Comentario</ion-label>
          <ion-textarea [(ngModel)]="comment" name="comment" required></ion-textarea>
        </ion-item>
        <ion-button type="submit">Agregar Asesoria</ion-button>
      </form>
    </ion-content>
  `,
})
export class AgregarAsesoriaModalComponent {
    @Input() usuarioId: number;
    @Input() title: string;
    comment: string;
    estado: string = "1";
    constructor(private modalController: ModalController,
        private alertController: AlertController) { }

    cerrarModal() {
        this.modalController.dismiss();
    }

    async agregarAsesoria() {

        // Verificar si el comentario está vacío
        if (!this.comment || this.comment.trim().length === 0) {
            // Si el comentario está vacío, muestra una alerta al usuario
            const alert = await this.alertController.create({
                header: 'Advertencia',
                message: 'El comentario es obligatorio.',
                buttons: ['OK'],
            });
            await alert.present();
            return;
        }
        // Crea un objeto con los datos del formulario para pasarlo de vuelta al componente padre
        const data = {
            usuarioId: this.usuarioId,
            title: this.title,
            comment: this.comment,
            estado: this.estado,
            empresaId: empresaId
        };

        // Cierra el modal y pasa los datos al componente padre
        this.modalController.dismiss(data);
    }
}
