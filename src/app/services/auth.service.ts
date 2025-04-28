// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


export interface LoginResponse {
  status: number;
  message: string;
  token?: string;
  userData?: UserData;
}
export interface UserData {
  id: number;
  name: string;
  email: string;
  avatarUrl: string | null;   // ahora existe
  createdAt: string;          // ahora existe
}


@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost/backend/plataformas/';
  private _userData = new BehaviorSubject<UserData | null>(null);
  public  userData$ = this._userData.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}login.php`, 
      { email, password },
      { withCredentials: true }   // <-- AGREGAR ESTO
    ).pipe(
      tap(resp => {
        if (resp.status === 200 && resp.userData) {
          this._userData.next(resp.userData);
        }
      })
    );
  }
  

  updateProfile(newData: UserData): Observable<UserData> {
    // Llamada PUT a tu endpoint de profile, por ej. profile.php
    return this.http.put<UserData>(`${this.apiUrl}profile.php`, newData, { withCredentials: true })
      .pipe(tap(data => {
        this._userData.next(data);
      }));
  }
  setUserData(data: UserData): void {
    this._userData.next(data);
  }

  logout(): void {
    this._userData.next(null);
  }

  get currentUser(): UserData | null {
    return this._userData.value;
  }

  getUserId(): number | null {
    return this._userData.value?.id ?? null;
  }
}
