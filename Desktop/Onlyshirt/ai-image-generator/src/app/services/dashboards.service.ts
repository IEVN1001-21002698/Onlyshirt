import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardsService {
  private apiBaseUrl = 'http://127.0.0.1:5000'; // Base URL hasta el puerto

  constructor(private http: HttpClient) {}

  // Método para obtener las ventas por producto
  getVentasPorProducto(): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/api/ventas_por_producto`); // Ruta específica
  }

  // Método para obtener los registros de usuarios por día
  getRegistroUsuariosDiario(): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/api/registro_usuarios_diario`); // Ruta específica
  }

  // Nuevo método para obtener las ventas diarias por cliente
  getVentasDiariasCliente(): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/api/ventas_diarias_cliente`); // Ruta específica
  }

    // Método para obtener el reporte general de la base de datos
    getReporteGeneral(): Observable<any> {
      return this.http.get<any>(`${this.apiBaseUrl}/api/reporte_general`);
    }

      // Nuevo método para obtener los clientes con ventas y el total de clientes
      getClientesVentas() {
        return this.http.get<any>(`${this.apiBaseUrl}/api/clientes_ventas`);
      }
      
      getProductosMasVendidos(): Observable<any> {
        return this.http.get<any>(`${this.apiBaseUrl}/api/productos_mas_vendidos`);
      }
      obtenerUsuariosClientes(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiBaseUrl}/api/usuarios_clientes`);
      }

      obteneradminClientes(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiBaseUrl}/api/usuarios_admin`);
      }
      
      getProductosSinVentas(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiBaseUrl}/api/productos_sin_ventas`);
      }
      


}
