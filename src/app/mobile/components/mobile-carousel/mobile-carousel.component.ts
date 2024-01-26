import { Component, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle'
register();

@Component({
  selector: 'app-mobile-carousel',
  templateUrl: './mobile-carousel.component.html',
  styleUrls: ['./mobile-carousel.component.scss'],
})
export class MobileCarouselComponent implements OnInit {

  images = [
    'https://fondosmil.com/fondo/49838.jpg',
    'https://fondosmil.com/fondo/2257.jpg',
    'https://articles-img.sftcdn.net/t_articles/auto-mapping-folder/sites/2/2023/01/rio-mont-saint-michel.jpg',
    'https://www.todofondos.net/wp-content/uploads/3840x2160-Fondos-de-Pantalla-Canada-5K-Fondo-de-Pantalla-4k-Kluane-Lake-Yukon-Paisaje-scaled.jpg'
  ]

  constructor() { }

  ngOnInit() { }

  swiperSlideChanged(e: any) {

  }

}
