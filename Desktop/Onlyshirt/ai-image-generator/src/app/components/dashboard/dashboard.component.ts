import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppComponent } from "../../app.component";

@Component({
  standalone: true,
  imports: [RouterModule, AppComponent],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  isSidebarOpen = false;
  constructor(private authService: AuthService) {}
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }


  logout(): void {
    this.authService.logout(); // Llama al método de cerrar sesión
  }
}
