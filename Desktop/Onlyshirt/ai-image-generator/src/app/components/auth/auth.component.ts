import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // Importa el servicio

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isRegistering = false; // Indica si estamos en el formulario de registro o login

  // Inyecta AuthService en el constructor
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      dob: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  toggleRegistering(): void {
    this.isRegistering = !this.isRegistering;
  }

  // Método para manejar inicio de sesión
  onLogin(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      console.log('Datos de inicio de sesión:', loginData);

      // Llama al método login del servicio
      this.authService.login(loginData).subscribe({
        next: (res) => {
          console.log('Inicio de sesión exitoso:', res);
          alert('Inicio de sesión exitoso.');
        },
        error: (err) => {
          console.error('Error al iniciar sesión:', err);
          alert('Error al iniciar sesión: ' + (err.error?.message || err.message));
        },
      });
    } else {
      alert('Por favor, completa todos los campos correctamente.');
    }
  }

  // Método para manejar registro
  onRegister(): void {
    if (this.registerForm.valid) {
      const registerData = this.registerForm.value;
      console.log('Datos de registro:', registerData);

      // Llama al método register del servicio
      this.authService.register(registerData).subscribe({
        next: (res) => {
          console.log('Registro exitoso:', res);
          alert('Registro exitoso. Ahora puedes iniciar sesión.');
          this.toggleRegistering(); // Cambia al formulario de inicio de sesión
        },
        error: (err) => {
          console.error('Error al registrarse:', err);
          alert('Error al registrarse: ' + (err.error?.message || err.message));
        },
      });
    } else {
      alert('Por favor, completa todos los campos correctamente.');
    }
  }
}
