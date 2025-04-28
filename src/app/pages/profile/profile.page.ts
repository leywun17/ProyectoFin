// src/app/profile/profile.page.ts
import { Component, OnInit } from '@angular/core';
import { AuthService, UserData } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonItem,IonLabel,IonInput
} from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonItem,
    IonLabel,
    IonInput, 
    CommonModule,
    FormsModule
  ]
})
export class ProfilePage implements OnInit {
  userData: UserData | null = null;
  memberSince = new Date();
  editMode = false;

  // campos temporales para el formulario
  editName = '';
  editEmail = '';

  constructor(
    private auth: AuthService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.userData = this.auth.currentUser;
    if (this.userData) {
      this.memberSince = new Date(this.userData.createdAt);
      this.editName = this.userData.name;
      this.editEmail = this.userData.email;
    }
  }

  toggleEdit() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      // cancelar edición: restaurar datos
      this.loadData();
    }
  }

  saveProfile() {
    if (!this.userData) { return; }
    // aquí llamarías a un endpoint de actualización de perfil:
    this.auth.updateProfile({
      ...this.userData,
      name: this.editName,
      email: this.editEmail
    }).subscribe({
      next: updatedData => {
        // actualizar BehaviorSubject y recargar
        this.auth.setUserData(updatedData);
        this.editMode = false;
        this.loadData();
      },
      error: err => {
        console.error('Error al guardar perfil', err);
      }
    });
  }

  goBack() {
    this.navCtrl.back();
  }

  logout() {
    this.auth.logout();
    this.navCtrl.navigateRoot('/login');
  }
}

