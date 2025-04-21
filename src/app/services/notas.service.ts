import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Note {
  id?: number;
  titulo: string;
  texto: string;
  fecha_creacion?: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  notas?: Note[];
  nota_id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotasService {
  private apiUrl = 'http://localhost/backend/plataformas/notas.php'; 

  constructor(private http: HttpClient) { }

  /**
   * Get all notes for a user
   */
  obtenerNotas(usuarioId: number): Observable<ApiResponse> {
    const params = new HttpParams().set('usuario_id', usuarioId.toString());
    return this.http.get<ApiResponse>(this.apiUrl, { params });
  }


  crearNota(note: Note, usuarioId: number): Observable<ApiResponse> {
    const noteData = {
      ...note,
      usuario_id: usuarioId
    };
    return this.http.post<ApiResponse>(this.apiUrl, noteData);
  }


  actualizarNota(note: Note, usuarioId: number): Observable<ApiResponse> {
    const noteData = {
      ...note,
      usuario_id: usuarioId
    };
    return this.http.put<ApiResponse>(this.apiUrl, noteData);
  }

  
  eliminarNota(noteId: number, usuarioId: number): Observable<ApiResponse> {
    const options = {
      body: {
        id: noteId,
        usuario_id: usuarioId
      }
    };
    return this.http.delete<ApiResponse>(this.apiUrl, options);
  }
}