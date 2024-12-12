import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdopcionesService } from '../shared/adopciones.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class HomeComponent implements OnInit {
  consultas: any[] = [];
  querySeleccionado: number = 1; 

  constructor(private http: HttpClient, private adopcionesService: AdopcionesService) {}

  ngOnInit() {}

  ejecutarQuery() {
    this.adopcionesService.obtenerQuery(this.querySeleccionado).subscribe(
      (response) => {
        this.consultas = response.data;
      },
      (error) => {
        console.error('Error al ejecutar el query:', error);
      }
    );
  }
}