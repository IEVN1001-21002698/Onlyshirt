import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:5000/api'; // URL base del backend Flask
  private currentUser: any = null; // Usuario autenticado

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Inicia sesión llamando a la API del backend.
   * @param credentials Credenciales del usuario (email y contraseña).
   */
  login(credentials: { email: string; password: string }): Observable<any> {
    console.log('Intentando iniciar sesión con:', credentials);
    return new Observable((observer) => {
      this.http.post(`${this.baseUrl}/login`, credentials).subscribe({
        next: (res: any) => {
          this.currentUser = res; // Guardar usuario autenticado
          if (res.role === 'admin') {
            this.router.navigate(['/dashboard']);
          } else if (res.role === 'client') {
            this.router.navigate(['/generate']);
          }
          observer.next(res);
        },
        error: (err) => {
          observer.error(err);
        },
      });
    });
  }

  /**
   * Registra un nuevo usuario llamando a la API del backend.
   * @param user Datos del usuario a registrar.
   */
  register(user: {
    name: string;
    email: string;
    phone: string;
    dob: string;
    password: string;
  }): Observable<any> {
    console.log('Intentando registrar usuario:', user); // Log de depuración
    return this.http.post(`${this.baseUrl}/register`, user);
  }
  
  /**
   * Cierra la sesión actual y redirige al login.
   */
  logout(): void {
    this.currentUser = null; // Limpia los datos del usuario autenticado
    localStorage.clear(); // Limpia cualquier dato almacenado (opcional)
    this.router.navigate(['/']); // Redirige al home
  }
  
  /**
   * Verifica si el usuario está autenticado.
   * @returns `true` si hay un usuario autenticado; de lo contrario, `false`.
   */
  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  /**
   * Obtiene el rol del usuario autenticado.
   * @returns Rol del usuario (admin, client) o 'guest' si no está autenticado.
   */
  getUserRole(): string {
    return this.currentUser?.role || 'guest';
  }
}
