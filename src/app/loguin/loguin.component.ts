import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';  
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-loguin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './loguin.component.html',
  styleUrl: './loguin.component.css'
})
export class LoguinComponent {

  username = '';
  password = '';
  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['/adminproductos']); // O la ruta que prefieras
    } else {
      alert('Credenciales incorrectas');
    }
  }
}
