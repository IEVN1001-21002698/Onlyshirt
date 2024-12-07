import { Component, OnInit } from '@angular/core';
import { DashboardsService } from '../../services/dashboards.service';
import { CommonModule } from '@angular/common';  // Importar CommonModule

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  standalone: true,  // Agregar esta propiedad si es un componente independiente (opcional)
  imports: [CommonModule]  // Asegúrate de que CommonModule esté incluido aquí
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];  // Para almacenar los usuarios

  constructor(private dashboardsService: DashboardsService) {}

  ngOnInit(): void {
    this.obtenerUsuariosClientes();  // Llamada al servicio para obtener los usuarios
  }

  // Método para obtener los usuarios con rol 'client'
// Método para obtener los usuarios con rol 'client'
obtenerUsuariosClientes(): void {
  this.dashboardsService.obtenerUsuariosClientes().subscribe(
    (data) => {
      console.log('Usuarios obtenidos:', data);  // Verifica la respuesta aquí
      this.usuarios = data;
    },
    (error) => {
      console.error('Error al obtener los usuarios', error);
    }
  );
}

}
