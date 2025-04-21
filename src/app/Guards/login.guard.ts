import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userData = localStorage.getItem("userData")
    console.log("AuthGuard: Verificando autenticación", userData);
    if (userData) {
      this.router.navigate(['/home']); 
      return false;
    }
    return true; // Si está autenticado, permite el acceso a login
  }
}
