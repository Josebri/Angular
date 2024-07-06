import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  texts = [
    {
      heading: '¿Quiénes Somos?',
      subtext: 'Somos Jose Briceño y Jesus Finol y creamos este manejador de inventario para nuestra clase de manejo de frameworks con la finalidad de sacar 20.'
    },
    {
      heading: '¿Qué Utilizamos en Este Proyecto?',
      subtext: 'Utilizamos un backend con Node, y creamos este aspecto visual con Angular, donde creamos los componentes de las vistas que están viendo en estos momentos.'
    }
  ];
  currentIndex = 0;
  currentText = this.texts[this.currentIndex];

  constructor(private router: Router) {}

  ngOnInit(): void {
    setInterval(() => {
      this.nextText();
    }, 15000); // Cambiar cada 15 segundos
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  nextText(): void {
    this.currentIndex = (this.currentIndex + 1) % this.texts.length;
    this.currentText = this.texts[this.currentIndex];
  }

  previousText(): void {
    this.currentIndex = (this.currentIndex - 1 + this.texts.length) % this.texts.length;
    this.currentText = this.texts[this.currentIndex];
  }
}
