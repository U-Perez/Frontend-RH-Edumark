import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogCompanyService } from '../../connection/api/blogs-company.service';
import { Blog } from '../../../interface/blog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-mobile-blog-content',
  templateUrl: './mobile-blog-content.component.html',
  styleUrls: ['./mobile-blog-content.component.scss'],
})
export class MobileBlogContentComponent implements OnInit {
  blog: Blog;
  safeContent: SafeHtml; // Variable para almacenar el contenido seguro

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogCompanyService,
    private sanitizer: DomSanitizer // Inyecta el servicio DomSanitizer
  ) { }

  ngOnInit() {
    this.loadBlog();
  }

  loadBlog() {
    const blogId = this.route.snapshot.params['id'];

    this.blogService.getBlog(blogId).subscribe(
      (blog) => {
        this.blog = blog;
        // Llama a la función para obtener el contenido seguro
        this.safeContent = this.sanitizer.bypassSecurityTrustHtml(this.blog.content);
      },
      (error) => {
        console.error('Error al cargar el blog', error);
      }
    );
  }

}
