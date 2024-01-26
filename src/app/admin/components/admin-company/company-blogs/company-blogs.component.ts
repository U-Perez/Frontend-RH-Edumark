import { Component, OnInit } from '@angular/core';
import { Blog } from '../../../../interface/blog';

import { AlertController } from '@ionic/angular';
import { BlogCompanyService } from '../../../../mobile/connection/api/blogs-company.service';

let empresaIdNumerico = localStorage.getItem('empresaId');
let empresaId = parseInt(empresaIdNumerico);

@Component({
  selector: 'app-company-blogs',
  templateUrl: './company-blogs.component.html',
  styleUrls: ['./company-blogs.component.scss'],
})
export class CompanyBlogsComponent implements OnInit {

  blogs: Blog[];

  constructor(
    private alertController: AlertController,
    private blogService: BlogCompanyService
  ) { }

  ngOnInit() {
    this.loadBlogs();
  }

  async loadBlogs() {
    // Obtén el empresaId del localStorage y conviértelo a número
    const empresaIdNumerico = localStorage.getItem('empresaId');
    const empresaId = parseInt(empresaIdNumerico);

    // Llama al servicio para obtener la lista de blogs
    this.blogService.getBlogByCompany(empresaId).subscribe(
      (blogs) => {
        this.blogs = blogs;
      },
      (error) => {
        console.error('Error al obtener la lista de blogs', error);
      }
    );
  }

  async deleteBlog(blogId: number) {
    const alert = await this.alertController.create({
      header: 'Eliminar blog',
      message: '¿Estás seguro de que quieres eliminar este blog?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          cssClass: 'danger',
          handler: () => {
            this.blogService.deleteBlog(blogId).subscribe(
              () => {
                // Eliminación exitosa, aquí puedes mostrar una notificación de éxito
                this.showSuccessAlert('Blog eliminado exitosamente');
                // Vuelve a cargar la lista de blogs después de eliminar uno
                this.loadBlogs();
              },
              (error) => {
                console.error('Error al eliminar el blog', error);
                // Aquí puedes mostrar una notificación de error si lo deseas
                this.showErrorAlert('Error al eliminar el blog');
              }
            );
          },
        },
      ],
    });

    await alert.present();
  }

  async showSuccessAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: message,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }
}
