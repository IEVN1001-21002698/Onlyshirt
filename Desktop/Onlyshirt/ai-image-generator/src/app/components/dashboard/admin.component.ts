import { Component, OnInit } from '@angular/core';
import { DashboardsService } from '../../services/dashboards.service';
import { CommonModule } from '@angular/common';  // Importar CommonModule

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  standalone: true,  // Agregar esta propiedad si es un componente independiente (opcional)
  imports: [CommonModule]  // Asegúrate de que CommonModule esté incluido aquí
})
export class AdminComponent implements OnInit {
  admin: any[] = [];  // Para almacenar los admin

  constructor(private dashboardsService: DashboardsService) {}

  ngOnInit(): void {
    this.obteneradminClientes();  // Llamada al servicio para obtener los admin
  }

  // Método para obtener los admin con rol 'client'
// Método para obtener los admin con rol 'client'
obteneradminClientes(): void {
  this.dashboardsService.obteneradminClientes().subscribe(
    (data) => {
      console.log('admin obtenidos:', data);  // Verifica la respuesta aquí
      this.admin = data;
    },
    (error) => {
      console.error('Error al obtener los admin', error);
    }
  );
}

}
