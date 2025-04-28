import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonImg,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  ToastController, 
  LoadingController,
  IonProgressBar
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { lockClosedOutline, bookOutline, brushOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonImg, 
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    CommonModule, 
    FormsModule,
    IonProgressBar,
  ]
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';
  
  isLoading: boolean = true;

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private router: Router,
    private loadingController: LoadingController
  ) {
    addIcons({bookOutline,brushOutline,lockClosedOutline});
  }

  async ngOnInit() {
    await new Promise(resolve => setTimeout(resolve, 5000));

    this.isLoading = false;
  }
  //metodos asincronos
  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    toast.present();
  }

  async login() {
    if (!this.email || !this.password) {
      this.presentToast('Por favor completa todos los campos', 'warning');
      return;
    }
    
    // Crear y mostrar el modal de carga
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'circles',
      cssClass: 'loading-modal',
      backdropDismiss: false
    });
    
    await loading.present();
    
    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        loading.dismiss();
        console.log(response);
        
        if (response.status === 200) {
          
          localStorage.setItem("userData", JSON.stringify(response.userData));

          this.presentToast('Inicio de sesión exitoso', 'success');
          
          this.router.navigate(['/home']);
        } else {
          this.presentToast(response.message || 'Inicio de sesión fallido', 'danger');
        }
      },
      error: (error: any) => {
        loading.dismiss();
        console.error('Error de inicio de sesión:', error);
        this.presentToast('Ocurrió un error. Por favor intenta de nuevo.', 'danger');
      }
    });
  }

  goToRegister(): void {
    this.router.navigateByUrl('/register');
  }
}