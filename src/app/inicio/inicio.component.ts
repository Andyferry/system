import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../servicios/ClienteService'; 
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [NgbCarouselModule,RouterModule,CommonModule ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {
  
  constructor(private clienteService: ClienteService) { }






  @ViewChild('carruselzapatos') carruselzapatos!: ElementRef;
  @ViewChild('carruselpantalones') carruselpantalones!: ElementRef;

  productos = [
    {
      name: 'Ruta Isla uno -Isla dos',
      description: 'duracion 2 horas, detallles.........',
      price: '39.99',
      oldPrice: '79.99',
      discount: '50% OFF',
      image: 'https://img.freepik.com/foto-gratis/hermosa-nina-sentada-mirador-isla-koh-nangyuan-cerca-isla-koh-tao-surat-thani-tailandia_335224-1093.jpg?t=st=1745440660~exp=1745444260~hmac=a9c99bf9a7ce022fea967975ff9074f127f54baccc9364ccfb7390fe192995c9&w=996'
    },
    {
      name: 'Ruta Isla uno -Isla dos',
      description: 'duracion 2 horas, detallles.........',
      price: '39.99',
      oldPrice: '79.99',
      discount: '50% OFF',
      image: 'https://img.freepik.com/fotos-premium/mujer-caucasica-pie-mirando-montana-valle_262288-1833.jpg?w=996'
    },
    {
      name: 'Ruta Isla uno -Isla dos',
      description: 'duracion 2 horas, detallles.........',
      price: '39.99',
      oldPrice: '79.99',
      discount: '50% OFF',
      image: 'https://img.freepik.com/foto-gratis/hermosa-chica-bikini-rojo-barco-isla-koh-kai-tailandia_335224-1228.jpg?t=st=1745440631~exp=1745444231~hmac=d8b30028411ae0e0f4ac34b5e4c48a3b854c2cffcab229640be20e1b79400bed&w=996'
    },
    {
      name: 'Ruta Isla uno -Isla dos',
      description: 'duracion 2 horas, detallles.........',
      price: '39.99',
      oldPrice: '79.99',
      discount: '50% OFF',
      image: 'https://img.freepik.com/foto-gratis/paisaje-palma-tropical-vacaciones-verano_1203-5352.jpg?t=st=1745440633~exp=1745444233~hmac=4127bf4caf58ae779e14f522ed9368a0ea31fcda0fb7f5e6631132f3b7ba8d89&w=996'
    },
    {
      name: 'Ruta Isla uno -Isla dos',
      description: 'duracion 2 horas, detallles.........',
      price: '39.99',
      oldPrice: '79.99',
      discount: '50% OFF',
      image: 'https://img.freepik.com/foto-gratis/hermosa-nina-corriendo-camino-madera-isla-koh-nang-yuan-cerca-isla-koh-tao-surat-thani-tailandia_335224-1089.jpg?t=st=1745440866~exp=1745444466~hmac=50940eb997f3e6a186c35f9c0912ad510207d386018240a143a4774e0801a9d3&w=996'
    }
  ];

  moverCarrusel(direccion: 'left' | 'right') {
    const contenedor = this.carruselzapatos.nativeElement;
    const scroll = direccion === 'left' ? -contenedor.clientWidth : contenedor.clientWidth;
    contenedor.scrollBy({ left: scroll, behavior: 'smooth' });
  }
  moverCarrusel2(direccion: 'left' | 'right') {
    const contenedor = this.carruselpantalones.nativeElement;
    const scroll = direccion === 'left' ? -contenedor.clientWidth : contenedor.clientWidth;
    contenedor.scrollBy({ left: scroll, behavior: 'smooth' });
  }


  images: string[] = [
    'https://i.postimg.cc/rmrgBHKp/ONE.jpg',
    'https://i.postimg.cc/W4t5nzVg/TWO.jpg',
    'https://i.postimg.cc/qv1mynPp/THREE.jpg',
    'https://i.postimg.cc/Mp6Pntrs/FIVE.jpg',
    'https://i.postimg.cc/g05NBpc5/SIX.jpg',
     'https://i.postimg.cc/kXFYMLw6/SEVEN.jpg']
  ;
  currentImageIndex = 0;
  currentImage = this.images[0];




  backgrounds: string[] = [
    'https://i.postimg.cc/25xRp8Gm/BANNER1.jpg',
    'https://i.postimg.cc/bJNXqcVn/BANNER2.jpg',
    'https://i.postimg.cc/W39B3WxH/BANNER3.jpg',
    'https://i.postimg.cc/25YRXB42/BANNER4.jpg'
  ];

  isSmallScreen = false;


tiketsConNivel: any[] = [];
  async ngOnInit() {
    this.isSmallScreen = window.innerWidth < 900;  // <700px consideramos “pequeña”
    this.tiketsConNivel = await this.clienteService.getClientes();
    console.log('productosConNivel:', this.tiketsConNivel);

    // 3. (Opcional) revisa su tipo y propiedades
    console.log('Cantidad de productos:', this.tiketsConNivel.length);
   
  }


  
}
