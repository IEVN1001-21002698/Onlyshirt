import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ImageGeneratorComponent } from './components/image-generator/image-generator.component';
import { MysteryShirtComponent } from './components/mystery-shirt/mystery-shirt.component';
import { AuthComponent } from './components/auth/auth.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsuariosComponent } from './components/dashboard/usuarios.component';
import { ConfiguracionComponent } from './components/dashboard/configuracion.component';
import { ReportesComponent } from './components/dashboard/reportes.component';
import { AbcComponent } from './components/dashboard/abc.component';
import { AdminComponent } from './components/dashboard/admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'generate', component: ImageGeneratorComponent },
  { path: 'mystery', component: MysteryShirtComponent },
  { path: 'login', component: AuthComponent }, // Ruta para login y registro
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'configuracion', component: ConfiguracionComponent },
      { path: 'reportes', component: ReportesComponent },
      { path: 'abc', component: AbcComponent },
     {path: 'admin', component: AdminComponent}
    ],
  },
];
