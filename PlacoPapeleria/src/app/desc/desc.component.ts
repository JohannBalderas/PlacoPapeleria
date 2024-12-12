import { Component, OnInit } from '@angular/core';
import { AdopcionesService } from '../shared/adopciones.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-desc',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './desc.component.html',
  styleUrls: ['./desc.component.css'],
})
export class DescComponent implements OnInit {
  tablas: string[] = [];
  tablaSeleccionada: string = '';
  estructuraTabla: any[] = [];

  constructor(private adopcionesService: AdopcionesService) {}

  ngOnInit(): void {
    this.recuperarTablas();
  }

  recuperarTablas() {
    this.adopcionesService.retornar().subscribe({
      next: (data) => {
        this.tablas = data.map((tabla: any) => tabla['Tables_in_papeleria']);
      },
      error: (err) => console.error('Error al recuperar tablas:', err),
    });
  }

  cargarEstructuraTabla() {
    if (this.tablaSeleccionada) {
      this.adopcionesService.obtenerEstructuraTabla(this.tablaSeleccionada).subscribe({
        next: (data) => {
          console.log('Datos recibidos del backend:', data);
          this.estructuraTabla = data;
        },
        error: (err) => console.error('Error al cargar la estructura de la tabla:', err),
      });
    }
  }  
}