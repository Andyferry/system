import { Routes } from '@angular/router';
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
import { ViajeprogramadoComponent } from './viajeprogramado/viajeprogramado.component';
import { TiketComponent } from './tiket/tiket.component'; 
import { TiketbackComponent } from './tiketback/tiketback.component';  
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    { path: 'navegacion', component: NavegacionComponent },
    { path: 'inicio', component: InicioComponent },
    { path: 'cabecerados', component: CabeceradosComponent },
    { path: 'cliente', component: ClienteComponent },
    { path: 'horario', component: HorarioComponent },
    { path: 'lancha', component: LanchaComponent },
    { path: 'pase', component: PaseComponent },
    { path: 'tiket', component: TiketComponent },
    { path: 'tiketback/filtroviaje/:id', component: TiketbackComponent },
    //{ path: 'crearproducto/:id', component: CrearProductoComponent },
    { path: 'ruta', component: RutaComponent, canActivate: [AuthGuard]},
    { path: 'usuario', component: UsuarioComponent },
    { path: 'loguin', component: LoguinComponent },    
    { path: 'tiketback', component: TiketbackComponent },    
    { path: 'viaje', component: ViajeprogramadoComponent },
    { path: '', redirectTo: '/inicio', pathMatch: 'full' }, // Ruta por defecto
    { path: '**', redirectTo: '/inicio' } // Ruta para manejar errores (opcional)
  ];
