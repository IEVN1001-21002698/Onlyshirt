import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { DashboardsService } from '../../services/dashboards.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
})
export class ReportesComponent implements OnInit {
  // Declaramos las propiedades para almacenar los datos del reporte general
  reporteGeneral: any = {};
  // Propiedad para el gráfico de reporte general
  reporteGeneralChart: any;

  constructor(private dashboardsService: DashboardsService) {}

  ngOnInit() {
    this.createSalesChart();
    this.createUserRegistrationChart();
    this.createDailySalesChart();
    this.getReporteGeneral(); // Llamamos el método para cargar el reporte general
  }

  // Método para obtener los datos del reporte general
  getReporteGeneral() {
    this.dashboardsService.getReporteGeneral().subscribe((data) => {
      this.reporteGeneral = data;
      // Aquí no necesitamos crear el gráfico, solo mostrar los datos en las tarjetas
    });
  }

  // Método para crear el gráfico del reporte general
  createReporteGeneralChart() {
    const labels = [
      'Total Clientes', 
      'Total Productos', 
      'Total Ventas', 
      'Ventas Acumuladas', 
      'Productos Vendidos', 
      'Clientes con Compras'
    ];
    
    const values = [
      this.reporteGeneral.total_clientes,
      this.reporteGeneral.total_productos,
      this.reporteGeneral.total_ventas,
      this.reporteGeneral.total_ventas_acumuladas,
      this.reporteGeneral.total_productos_vendidos,
      this.reporteGeneral.total_clientes_ventas
    ];

    this.reporteGeneralChart = new Chart('reporteGeneralChart', {
      type: 'bar', // Tipo de gráfico (puedes cambiarlo a 'pie', 'line', etc.)
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Datos Generales',
            data: values,
            backgroundColor: '#4CAF50', // Verde
            borderColor: '#000000', // Negro
            borderWidth: 1
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false, // Desactivar leyenda si no es necesaria
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Categorías',
              color: 'black', // Títulos en negro
            },
          },
          y: {
            title: {
              display: true,
              text: 'Valor',
              color: 'black', // Títulos en negro
            },
            beginAtZero: true, // Iniciar el eje Y desde cero
            ticks: {
              color: '#333', // Color de las etiquetas en negro
            },
          },
        },
      },
    });
  }

  createSalesChart() {
    this.dashboardsService.getVentasPorProducto().subscribe((data) => {
      const labels = data.map((item: any) => item.nombre_producto);
      const values = data.map((item: any) => parseFloat(item.total_generado));

      new Chart('salesChart', {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: ['#FF5733', '#C70039', '#900C3F', '#581845'], // Colores contrastantes
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#000000', // Texto de leyenda en negro
              },
            },
          },
          maintainAspectRatio: false,
        },
      });
    });
  }

  createUserRegistrationChart() {
    this.dashboardsService.getRegistroUsuariosDiario().subscribe((data) => {
      const labels = data.map((item: any) => {
        const date = new Date(item.fecha);
        return date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
      });

      const values = data.map((item: any) => parseInt(item.cantidad_registrados, 10));

      new Chart('userRegistrationChart', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Usuarios Registrados (Clientes)',
              data: values,
              backgroundColor: '#00BFFF', // Azul brillante
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Fecha',
                color: '#000000', // Color negro para el título del eje X
              },
            },
            y: {
              title: {
                display: true,
                text: 'Cantidad de Usuarios',
                color: '#000000', // Color negro para el título del eje Y
              },
              beginAtZero: true,
              ticks: {
                color: '#333', // Etiquetas del eje Y en negro
              },
            },
          },
        },
      });
    });
  }

  createDailySalesChart() {
    this.dashboardsService.getVentasDiariasCliente().subscribe((data) => {
      const labels = data.map((item: any) => {
        const date = new Date(item.fecha);
        return date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
      });
  
      const values = data.map((item: any) => parseFloat(item.total_ventas));
  
      new Chart('dailySalesChart', {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Ventas Diarias de Clientes',
              data: values,
              borderColor: '#FF6347', // Rojo brillante para el borde
              backgroundColor: '#FFD700', // Amarillo dorado para el fondo
              fill: true, // Llenar el área debajo de la línea
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#000000', // Texto de leyenda en negro
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Fecha',
                color: '#000000', // Título eje X en negro
              },
              ticks: {
                color: '#333', // Color de las etiquetas del eje X en negro
              },
            },
            y: {
              title: {
                display: true,
                text: 'Total Ventas',
                color: '#000000', // Título eje Y en negro
              },
              ticks: {
                color: '#333', // Color de las etiquetas del eje Y en negro
              },
              beginAtZero: true,
            },
          },
        },
      });
    });
  }
}
