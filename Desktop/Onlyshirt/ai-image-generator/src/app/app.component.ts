/* import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ImageGeneratorComponent } from './components/image-generator/image-generator.component';
import { MysteryShirtComponent } from './components/mystery-shirt/mystery-shirt.component';


import { BaseChartDirective } from 'ng2-charts';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HomeComponent, ImageGeneratorComponent, MysteryShirtComponent,BaseChartDirective],
  template: `
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {}
 */
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ImageGeneratorComponent } from './components/image-generator/image-generator.component';
import { MysteryShirtComponent } from './components/mystery-shirt/mystery-shirt.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HomeComponent, ImageGeneratorComponent, MysteryShirtComponent, ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  // Datos para el gráfico de doughnut

}
