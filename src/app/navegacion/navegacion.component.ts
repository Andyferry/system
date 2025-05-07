import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Importa RouterModule
import { AuthService } from '../../servicios/auth.service';



@Component({
  selector: 'app-navegacion',
  standalone: true,
  imports: [CommonModule, RouterModule], // Agrega RouterModule aquí
  templateUrl: './navegacion.component.html',
  styleUrls: ['./navegacion.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NavegacionComponent {




  lastScrollTop = 0;




  isMobile: boolean = window.innerWidth < 700;
  isSearchBarVisible: boolean = true;
  previousScrollPosition: number = window.pageYOffset;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth < 700;
  }



  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const currentScroll = window.pageYOffset;
    this.isSearchBarVisible = currentScroll === 0;
    this.previousScrollPosition = currentScroll;
    
     




    const navbar = document.querySelector('.navbar') as HTMLElement;
    const currentScrollx = window.pageYOffset || document.documentElement.scrollTop;
    const screenWidth = window.innerWidth;
    
    if (screenWidth > 700) {
      if (currentScrollx === 0) {
        navbar.style.top = '35px'; // estás arriba de todo
      } else {
        navbar.style.top = '0px'; // en cualquier otro punto
      }
    }
    
  }






  showDropdown = false;
  isFocused = false;
  toggleDropdown() {
    this.isSearchBarVisible = false;
    this.showDropdown = !this.showDropdown;
  }
  // Detectar clic fuera del menú
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = event.target instanceof HTMLElement &&
      (event.target.closest('.user-menu-container') || event.target.closest('.user-dropdown'));
    if (!clickedInside) {
      this.showDropdown = false;
    }
  }

  mobileMenuOpen: boolean = false;


  cartItemCount: number = 0;

  constructor(public authService: AuthService, private router: Router) { }

  selectedTheme: string = 'default'; // Tema por defecto
  cerrarMenu(menuItem: string) {







    switch (menuItem) {
      case 'Inicio':
        this.selectedTheme = 'tema-inicio';
        break;
      case 'Ropa':
        this.selectedTheme = 'tema-ropa';
        break;
      case 'Maquillaje':
        this.selectedTheme = 'tema-maquillaje';
        break;
      case 'Hogar':
        this.selectedTheme = 'tema-hogar';
        break;
      case 'Joyeria':
        this.selectedTheme = 'tema-joyeria';
        break;
      case 'Zapatos':
        this.selectedTheme = 'tema-zapatos';
        break;
      case 'Accesorios':
        this.selectedTheme = 'tema-accesorios';
        break;
      case 'ADMIN-PRODUCTOS':
        this.selectedTheme = 'tema-admin';
        break;
      default:
        this.selectedTheme = 'default';
    }


    // Se asume que el checkbox tiene el id "menu-toggle"
    const menuToggle = document.getElementById('menu-toggle') as HTMLInputElement;
    if (menuToggle) {
      menuToggle.checked = false;
    }
  }
  logout(): void {
    this.authService.logout();
    // Redirige a la página de login u otra ruta deseada
    this.router.navigate(['/inicio']);
  }

  metodomostrarbarra(): void {
    
   

    if (this.isSearchBarVisible) {
      this.isSearchBarVisible = false;
    } else { 
      this.isSearchBarVisible = true; 
    }


   

  }



}