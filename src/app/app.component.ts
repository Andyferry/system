import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CabeceradosComponent } from './cabecerados/cabecerados.component'; 
import { ClienteComponent} from './cliente/cliente.component';
import { HorarioComponent } from './horario/horario.component';
import { InicioComponent } from './inicio/inicio.component';
import { LanchaComponent } from './lancha/lancha.component';
import { LoguinComponent } from './loguin/loguin.component';
import { NavegacionComponent } from './navegacion/navegacion.component';
import { PaseComponent } from './pase/pase.component';
import { RutaComponent } from './ruta/ruta.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { TiketComponent } from './tiket/tiket.component';  
import { TiketbackComponent } from './tiketback/tiketback.component'; 
import { ViajeprogramadoComponent } from './viajeprogramado/viajeprogramado.component';
import { Router, Event, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule,LoguinComponent,TiketbackComponent,CabeceradosComponent, NavegacionComponent,CabeceradosComponent,ClienteComponent,HorarioComponent,InicioComponent,LanchaComponent,PaseComponent,RutaComponent,UsuarioComponent,ViajeprogramadoComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {  constructor(private router: Router) {
  this.router.events.subscribe((event: Event) => {
    if (event instanceof NavigationEnd) {
      window.scrollTo(0, 0); // Mueve la pantalla al inicio al cambiar de página
    }
  });
}}