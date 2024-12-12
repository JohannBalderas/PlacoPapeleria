import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdopcionesService } from '../shared/adopciones.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
  tablas: string[] = [];
  tablaSeleccionada: string = '';
  idRegistro: string = '';
  registroSeleccionado: any = null;
  campos: any[] = [];
  mensaje: string = '';
  success: boolean = false;

  constructor(private adopcionesService: AdopcionesService) {}

  ngOnInit(): void {
    this.obtenerTablas();
  }

  //obtener las tablas disponibles
  obtenerTablas(): void {
    this.adopcionesService.retornar().subscribe(
      (data) => {
        this.tablas = data.map((tabla: any) => Object.values(tabla)[0]);
      },
      (error) => {
        this.mensaje = 'Error al cargar las tablas';
        this.success = false;
      }
    );
  }

  cargarEstructuraTabla(): void {
    if (!this.tablaSeleccionada) return;

    this.adopcionesService.obtenerEstructuraTabla(this.tablaSeleccionada).subscribe(
      (data) => {
        this.campos = data;
      },
      (error) => {
        this.mensaje = 'Error al obtener la estructura de la tabla';
        this.success = false;
      }
    );
  }

  cargarRegistro(): void {
    if (!this.tablaSeleccionada || !this.idRegistro) {
      this.mensaje = 'Debe seleccionar una tabla y proporcionar un ID válido';
      this.success = false;
      return;
    }
  
    this.adopcionesService.obtenerEstructuraTabla(this.tablaSeleccionada).subscribe(
      (estructura) => {
        const campoId = estructura.find((col: any) => col.Key === 'PRI')?.Field;
  
        if (!campoId) {
          this.mensaje = 'No se encontró una clave primaria en la tabla seleccionada';
          this.success = false;
          return;
        }
  
        this.adopcionesService.obtenerDatosTabla(this.tablaSeleccionada).subscribe(
          (data) => {
            const registro = data.find((item: any) => item[campoId] === parseInt(this.idRegistro, 10));
            if (registro) {
              this.registroSeleccionado = { ...registro };
              this.mensaje = '';
              this.success = true;
            } else {
              this.mensaje = `Registro no encontrado con ${campoId}: ${this.idRegistro}`;
              this.success = false;
            }
          },
          (error) => {
            this.mensaje = 'Error al cargar el registro';
            this.success = false;
          }
        );
      },
      (error) => {
        this.mensaje = 'Error al obtener la estructura de la tabla';
        this.success = false;
      }
    );
  }
  
  

  guardarCambios(): void {
    if (!this.tablaSeleccionada || !this.registroSeleccionado) {
      this.mensaje = 'No se puede guardar porque falta información del registro';
      this.success = false;
      return;
    }
  
    //obtener la clave primaria para enviar correctamente el ID
    this.adopcionesService.obtenerEstructuraTabla(this.tablaSeleccionada).subscribe(
      (estructura) => {
        const campoId = estructura.find((col: any) => col.Key === 'PRI')?.Field;
  
        if (!campoId) {
          this.mensaje = 'No se encontró una clave primaria en la tabla seleccionada';
          this.success = false;
          return;
        }
  
        const id = this.registroSeleccionado[campoId];
  
        //llamar al servicio para actualizar el registro
        this.adopcionesService.actualizarRegistro(this.tablaSeleccionada, id, this.registroSeleccionado).subscribe(
          (response) => {
            this.mensaje = 'Registro actualizado correctamente';
            this.success = true;
          },
          (error) => {
            console.error('Error al actualizar el registro:', error);
            this.mensaje = 'Error al guardar los cambios';
            this.success = false;
          }
        );
      },
      (error) => {
        this.mensaje = 'Error al obtener la estructura de la tabla';
        this.success = false;
      }
    );
  }
  
}