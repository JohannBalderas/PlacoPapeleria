import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdopcionesService } from '../shared/adopciones.service';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.css'],
})
export class GaleriaComponent {
  tablas: string[] = [];
  tablaSeleccionada: string = '';
  estructuraTabla: string[] = [];
  nuevoRegistro: any = {};
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

  cargarEstructuraTabla() {
    if (this.tablaSeleccionada) {
      this.adopcionesService.obtenerEstructuraTabla(this.tablaSeleccionada).subscribe({
        next: (data) => {
          this.estructuraTabla = data.map((columna: any) => columna.Field);
          this.nuevoRegistro = {}; 
        },
        error: (err) => console.error('Error al cargar estructura de la tabla:', err),
      });
    }
  }

  darDeAlta() {
    this.adopcionesService.agregarRegistro(this.tablaSeleccionada, this.nuevoRegistro).subscribe({
      next: () => {
        this.mensaje = 'Registro agregado exitosamente';
        this.success = true;
        this.nuevoRegistro = {}; //limpia el formulario
      },
      error: (err) => {
        this.mensaje = 'Error al agregar el registro';
        this.success = false;
        console.error('Error al agregar registro:', err);
      },
    });
  }  
}