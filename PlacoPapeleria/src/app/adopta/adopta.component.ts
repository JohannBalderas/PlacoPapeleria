import { Component } from '@angular/core';
import { AdopcionesService } from '../shared/adopciones.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-adopta',
  standalone: true,
  templateUrl: './adopta.component.html',
  styleUrls: ['./adopta.component.css'],
  imports: [CommonModule, FormsModule],
})
export class AdoptaComponent {
  tablas: string[] = [];
  tablaSeleccionada: string = '';
  datosTabla: any[] = [];
  columnas: string[] = [];

  constructor(public adopcionesService: AdopcionesService) {}

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

  mostrarDatos() {
    if (this.tablaSeleccionada) {
      this.adopcionesService.obtenerDatosTabla(this.tablaSeleccionada).subscribe({
        next: (data) => {
          if (data.length > 0) {
            this.columnas = Object.keys(data[0]);
            this.datosTabla = data;
          } else {
            this.columnas = [];
            this.datosTabla = [];
          }
        },
        error: (err) => console.error('Error al recuperar datos de la tabla:', err),
      });
    }
  }
}