import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonList, IonItem, IonCard, IonCardContent, IonFab, IonFabButton, IonIcon, IonRouterLink, IonFabList } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { NotasService, Note } from '../services/notas.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonFabList, /* IonList, */ IonContent, IonHeader, /* IonItem, */ IonCard, IonCardContent, IonFab, IonFabButton, IonIcon, CommonModule],
})
export class HomePage implements OnInit {
  notes: Note[] = [];
  currentDate = new Date();
  selectedDate: Date = new Date();
  daysOfWeek: { date: number; weekday: string; fullDate: Date }[] = [];
  userId!: number;
  loading = false;
  error = '';

  constructor(private notasService: NotasService, private authService: AuthService, private router: Router) { };

  ngOnInit(): void {
    this.authService.userData$.subscribe(userData => {
      if (userData) {
        this.userId = userData.id;
        this.loadNotes();
      } else {
        console.log(this.userId)
        console.log(userData)
        console.warn('No hay usuario logueado');
        this.error = 'Debes iniciar sesión para ver las notas.';
      }
    });
    this.generateCurrentWeek();
  }
  loadNotes(): void {
    if (this.userId == null) { // null o undefined
      console.error('userId no está definido en loadNotes');
      this.loading = false;
      this.error = 'No se encontró el usuario para cargar las notas.';
      return;
    }

    this.loading = true;
    this.notasService.obtenerNotas(this.userId).subscribe({
      next: (response) => {
        if (response.success && response.notas) {
          this.notes = response.notas;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading notes: ' + err.message;
        this.loading = false;
      }
    });
  }

  goToProfile(): void {
    this.router.navigate(['/profile']); // 🚀 Navegar a la página de perfil
  }

  generateCurrentWeek(): void {
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    const dayOffset = today.getDay() === 0 ? -6 : 1 - today.getDay(); // lunes como primer día
    firstDayOfWeek.setDate(today.getDate() + dayOffset);

    const weekdays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

    this.daysOfWeek = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(firstDayOfWeek);
      date.setDate(firstDayOfWeek.getDate() + i);
      return {
        date: date.getDate(),
        weekday: weekdays[i],
        fullDate: date
      };
    });

    this.selectedDate = today;
  }

  selectDay(day: Date): void {
    this.selectedDate = day;
  }

  isSelected(day: Date): boolean {
    return (
      day.getFullYear() === this.selectedDate.getFullYear() &&
      day.getMonth() === this.selectedDate.getMonth() &&
      day.getDate() === this.selectedDate.getDate()
    );
  }

}