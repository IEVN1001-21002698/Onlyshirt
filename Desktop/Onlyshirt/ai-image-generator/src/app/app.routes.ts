import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ImageGeneratorComponent } from './components/image-generator/image-generator.component';
import { MysteryShirtComponent } from './components/mystery-shirt/mystery-shirt.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'generate', component: ImageGeneratorComponent },
  { path: 'mystery', component: MysteryShirtComponent },
];
