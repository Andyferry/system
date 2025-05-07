// auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Simulación del estado de autenticación
  private loggedIn = false;

  // Llama a este método cuando el usuario inicie sesión exitosamente
  login(username: string, password: string): boolean {
    // Aquí iría la lógica de validación (por ejemplo, llamada a un API)
    if (username === 'admin' && password === 'jared2025') {
      this.loggedIn = true;
      return true;
    }
    return false;
  }

  logout(): void {
    this.loggedIn = false;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}
