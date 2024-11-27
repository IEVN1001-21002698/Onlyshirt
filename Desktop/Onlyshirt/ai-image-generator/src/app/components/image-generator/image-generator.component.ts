import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-generator',
  standalone: true,
  imports: [FormsModule, CommonModule], // Importar FormsModule y CommonModule
  templateUrl: './image-generator.component.html',
  styleUrls: ['./image-generator.component.css'],
})
export class ImageGeneratorComponent {
  prompt: string = '';
  imageUrl: string | null = null;
  isLoading: boolean = false;

  generateImage() {
    if (!this.prompt.trim()) {
      alert('Por favor, escribe un prompt para generar la imagen.');
      return;
    }

    this.isLoading = true;

    // Simulación de generación de imagen (sustituir con servicio real)
    setTimeout(() => {
      this.imageUrl = 'https://via.placeholder.com/512'; // URL simulada
      this.isLoading = false;
    }, 2000);
  }
}
