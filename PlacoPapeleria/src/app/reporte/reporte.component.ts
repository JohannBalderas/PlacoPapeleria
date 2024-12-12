import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdopcionesService } from '../shared/adopciones.service';

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
})
export class ReporteComponent implements OnInit {
  tablas: string[] = [];
  tablaSeleccionada: string = '';
  idRegistro: string = '';
  mensaje: string = '';
  success: boolean = false;

  constructor(private adopcionesService: AdopcionesService) {}

  ngOnInit(): void {
    //obtener las tablas disponibles al cargar el componente
    this.adopcionesService.retornar().subscribe({
      next: (data) => {
        this.tablas = data.map((tabla: any) => tabla['Tables_in_papeleria']);
        this.tablaSeleccionada = this.tablas[0] || '';
      },
      error: (err) => {
        console.error('Error al cargar tablas:', err);
        this.mensaje = 'Error al cargar tablas.';
        this.success = false;
      },
    });
  }

  eliminarRegistro(): void {
    if (!this.tablaSeleccionada || !this.idRegistro.trim()) {
      this.mensaje = 'Debe seleccionar una tabla y proporcionar un ID.';
      this.success = false;
      return;
    }

    //confirmar la eliminación
    if (
      !confirm(
        `¿Estás seguro de eliminar el registro con ID: ${this.idRegistro}?`
      )
    ) {
      return;
    }

    //llamar al servicio para eliminar
    this.adopcionesService
      .eliminarRegistro(this.tablaSeleccionada, this.idRegistro)
      .subscribe({
        next: () => {
          this.mensaje = `El registro con ID: ${this.idRegistro} ha sido eliminado correctamente.`;
          this.success = true;
          this.idRegistro = ''; //limpiar el campo de ID
        },
        error: (err) => {
          console.error('Error al eliminar registro:', err);
          this.mensaje = 'Hubo un error al eliminar el registro.';
          this.success = false;
          this.idRegistro = ''; //limpiar el campo de ID
        },
      });
  }
}