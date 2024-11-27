import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private apiUrl = 'http://127.0.0.1:5000/generate-image'; // URL del backend Flask

  constructor(private http: HttpClient) {}

  // Método para enviar el prompt y obtener la URL de la imagen
  generateImage(prompt: string): Observable<any> {
    return this.http.post(this.apiUrl, { prompt });
  }
}

