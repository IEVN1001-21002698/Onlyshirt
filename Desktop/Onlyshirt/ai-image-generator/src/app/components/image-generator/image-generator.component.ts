import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { ImageService } from '../../services/image.service'; // Asegúrate de tener este servicio configurado

@Component({
  selector: 'app-image-generator',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importar módulos necesarios
  templateUrl: './image-generator.component.html',
  styleUrls: ['./image-generator.component.css'],
})
export class ImageGeneratorComponent {
  prompt: string = ''; // Texto del usuario para generar la imagen
  imageUrl: string | null = null; // URL de la imagen generada
  isLoading: boolean = false; // Indicador de carga

  constructor(private imageService: ImageService) {}

  generateImage() {
    if (!this.prompt.trim()) {
      alert('Por favor, escribe un prompt para generar la imagen.');
      return;
    }

    this.isLoading = true; // Muestra el indicador de carga

    this.imageService.generateImage(this.prompt).subscribe({
      next: (response) => {
        this.imageUrl = response.image_url; // Establece la URL de la imagen
        this.isLoading = false; // Oculta el indicador de carga
      },
      error: (error) => {
        console.error('Error al generar la imagen:', error);
        alert('Hubo un error al generar la imagen. Inténtalo nuevamente.');
        this.isLoading = false; // Oculta el indicador de carga
      },
    });
  }
}
