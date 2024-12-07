import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { DashboardsService } from '../../services/dashboards.service';

@Component({
  selector: 'app-abc',
  standalone: true,
  templateUrl: './abc.component.html',
  styleUrls: ['./abc.component.css'],
})
export class AbcComponent implements OnInit {
  totalClientes: number = 0; // Propiedad para almacenar el total de clientes
  clientesConVentas: number = 0; // Propiedad para almacenar los clientes con ventas
  reporteGeneral: any = {}; // Declaramos las propiedades para almacenar los datos del reporte general
  reporteGeneralChart: any; // Propiedad para el gráfico de reporte general

  totalProductos: number = 0;
  productosVendidos: { nombre_producto: string; total_vendido: number }[] = []; // Cambiar a un array de objetos

  porcentajeClientesConVentas: number = 0; // Nueva propiedad para almacenar el porcentaje de clientes con ventas
  productosSinVentas: any[] = []; // Variable para almacenar los productos sin ventas
  clientesInactivos: number = 0; // Nueva propiedad

  clientesFrecuentes: number = 0;



  constructor(private dashboardsService: DashboardsService) {}

  ngOnInit(): void {
    this.getClientesVentasData(); // Cargar los datos al inicializar el componente
    this.getReporteGeneral(); // Llamamos el método para cargar el reporte general
    this.getProductosMasVendidos(); // Agregar la llamada al método para productos más vendidos
    this.getProductosSinVentas(); // Llamada al método para obtener los productos sin ventas

  }

  // Método para obtener los datos del endpoint
  getClientesVentasData(): void {
    this.dashboardsService.getClientesVentas().subscribe(
      (data) => {
        console.log('Datos de clientes y ventas:', data);
        this.totalClientes = data.total_clientes;
        this.clientesConVentas = data.total_clientes_ventas;
        this.clientesInactivos = this.totalClientes - this.clientesConVentas; // Calcular inactivos
        this.clientesFrecuentes = data.clientes_frecuentes; // Clientes que compran más de una vez


        // Crear el gráfico con los datos obtenidos
        this.porcentajeClientesConVentas = (this.clientesConVentas / this.totalClientes) * 100;

        this.createKpiChart(this.totalClientes, this.clientesConVentas);
      },
      (error) => {
        console.error('Error al obtener los datos de clientes y ventas:', error);
      }
    );
  }

  // Método para crear el gráfico de KPI
  createKpiChart(totalClientes: number, clientesConVentas: number): void {
    const porcentaje = (clientesConVentas / totalClientes) * 100;

    new Chart('kpiChart', {
      type: 'doughnut',
      data: {
        labels: ['Clientes con Ventas', 'Clientes Restantes'],
        datasets: [
          {
            data: [clientesConVentas, totalClientes - clientesConVentas],
            backgroundColor: ['#36a2eb', '#e2e2e2'], // Colores para valores
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: '80%', // Grosor del gráfico
        rotation: -90, // Inicio del gráfico
        circumference: 180, // Arco semicircular
        plugins: {
          tooltip: {
            enabled: true, // Habilita o deshabilita los tooltips
          },
          legend: {
            display: false, // Oculta leyendas
          },
        },
      },
    });
  }

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
            backgroundColor: '#4BC0C0',
            borderColor: '#fff',
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
            },
          },
          y: {
            title: {
              display: true,
              text: 'Valor',
            },
            beginAtZero: true, // Iniciar el eje Y desde cero
          },
        },
      },
    });
  }

  // Método para obtener los datos del primer endpoint
// Método para obtener los datos del primer endpoint
getProductosMasVendidos(): void {
  this.dashboardsService.getProductosMasVendidos().subscribe(
    (data: { nombre_producto: string; total_vendido: number }[]) => {
      console.log('Datos de productos más vendidos:', data);
      
      // Asignar los datos a productosVendidos
      this.productosVendidos = data;
      
      // Crear el gráfico con los datos obtenidos
      this.createKpiChartProductos(this.productosVendidos);
    },
    (error) => {
      console.error('Error al obtener los datos de productos más vendidos:', error);
    }
  );
}

// Método para crear el gráfico de KPI para productos más vendidos
createKpiChartProductos(productosVendidos: { nombre_producto: string; total_vendido: number }[]): void {
  // Ordenar los productos por la cantidad vendida en orden descendente
  const productosOrdenados = productosVendidos.sort((a, b) => b.total_vendido - a.total_vendido);

  // Obtener los tres productos más vendidos
  const topProducto1 = productosOrdenados[0] || { nombre_producto: 'Producto 1', total_vendido: 0 };
  const topProducto2 = productosOrdenados[1] || { nombre_producto: 'Producto 2', total_vendido: 0 };
  const topProducto3 = productosOrdenados[2] || { nombre_producto: 'Producto 3', total_vendido: 0 };

  // Calcular el total de productos vendidos
  const totalVendidos = productosVendidos.reduce((total, producto) => total + producto.total_vendido, 0);

  // Calcular el porcentaje del producto más vendido respecto al total
  const porcentajeTopProducto1 = (topProducto1.total_vendido / totalVendidos) * 100;
  const porcentajeTopProducto2 = (topProducto2.total_vendido / totalVendidos) * 100;
  const porcentajeTopProducto3 = (topProducto3.total_vendido / totalVendidos) * 100;

  new Chart('productosVendidosChart', {
    type: 'doughnut',
    data: {
      labels: [topProducto1.nombre_producto, topProducto2.nombre_producto, topProducto3.nombre_producto],
      datasets: [
        {
          data: [topProducto1.total_vendido, topProducto2.total_vendido, topProducto3.total_vendido],
          backgroundColor: ['#36a2eb', '#ffcd56', '#ff6384'], // Colores para los segmentos
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      cutout: '80%', // Grosor del gráfico
      rotation: -90, // Inicio del gráfico
      circumference: 180, // Arco semicircular
      plugins: {
        tooltip: {
          enabled: true, // Habilita los tooltips
          callbacks: {
            label: (tooltipItem) => {
              const value = tooltipItem.raw as number;
              const percentage = ((value / totalVendidos) * 100).toFixed(2);
              return `${tooltipItem.label}: ${percentage}%`;
            },
          },
        },
        legend: {
          display: false, // Oculta leyendas
        },
      },
    },
  });
}


getProductosSinVentas(): void {
  this.dashboardsService.getProductosSinVentas().subscribe(
    (data) => {
      console.log('Productos sin ventas:', data);
      this.productosSinVentas = data; // Guardar los productos sin ventas en la variable
    },
    (error) => {
      console.error('Error al obtener los productos sin ventas:', error);
    }
  );
}



}
