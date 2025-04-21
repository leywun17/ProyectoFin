import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  status: number;
  message: string;
  userData?: {
    id: number;
    name: string;
    email: string;
    // Otros campos que retorne el endpoint
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Se usa la URL base, posteriormente se concatena el archivo login.php
  private apiUrl = 'http://localhost/backend/plataformas/';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<LoginResponse> {
    const credentials = { email, password };
    return this.http.post<LoginResponse>(
      `${this.apiUrl}login.php`,
      credentials,
    ); 
  }
}
