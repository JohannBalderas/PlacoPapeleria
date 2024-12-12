import { Component, OnInit, NgModule } from '@angular/core';
import { AdopcionesService } from '../shared/adopciones.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agregar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agregar.component.html',
  styleUrl: './agregar.component.css'
})
export class AgregarComponent implements OnInit{
  tablas: string[] = [];
  tablaSeleccionada: string = '';
  nombreColumna: string = '';
  tipoColumna: string = '';
  mensaje: string = '';
  success: boolean = false;

  constructor(private adopcionesService: AdopcionesService) {}

  ngOnInit(): void {
    this.cargarTablas();
  }

  cargarTablas() {
    this.adopcionesService.retornar().subscribe({
      next: (data) => {
        this.tablas = data.map((tabla: any) => tabla['Tables_in_papeleria']);
      },
      error: (err) => console.error('Error al cargar tablas:', err),
    });
  }

  agregarColumna() {
    if (!this.tablaSeleccionada || !this.nombreColumna || !this.tipoColumna) {
      this.mensaje = 'Por favor, completa todos los campos.';
      return;
    }

    const datos = {
      tabla: this.tablaSeleccionada,
      columna: this.nombreColumna,
      tipo: this.tipoColumna,
    };

    this.adopcionesService.agregarColumna(datos).subscribe({
      next: (response) => {
        this.mensaje = `Columna "${this.nombreColumna}" añadida con éxito a la tabla "${this.tablaSeleccionada}".`;
        this.success = true;
        this.resetForm();
      },
      error: (err) => {
        console.error('Error al agregar columna:', err);
        this.mensaje = 'Error al agregar la columna.';
        this.success = false;
      },
    });
  }

  resetForm() {
    this.nombreColumna = '';
    this.tipoColumna = '';
  }
}
