import { Component, OnInit, NgModule } from '@angular/core';
import { AdopcionesService } from '../shared/adopciones.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-devolucion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './devolucion.component.html',
  styleUrl: './devolucion.component.css'
})
export class DevolucionComponent implements OnInit {
  devoluciones: any[] = [];
  productos: any[] = [];
  ventas: any[] = [];
  id_venta: number = 0;
  id_producto: number = 0;
  razon: number = 0;
  cantidad: number = 0;
  razones: any[] = [];
  mensaje: string = '';
  success: boolean = false;

  constructor (private adopcionesService: AdopcionesService){}

  ngOnInit() {
    this.adopcionesService.getVentas().subscribe(data => this.ventas = data);
    this.adopcionesService.getIDProductos().subscribe(data => this.productos = data);
    this.adopcionesService.getRazones().subscribe(data => this.razones = data); 
  }

  registrarDevolucion() {
    if (!this.id_venta || !this.id_producto || !this.cantidad || !this.razon) {
      this.mensaje = 'Por favor completa todos los campos.';
      return;
    }

    const devolucion = {
      id_venta: this.id_venta,
      id_producto: this.id_producto,
      cantidad: this.cantidad,
      razon: this.razon,
      estado: 1 //1-activa 0-inactiva
    };

    this.adopcionesService.registrarDevolucion(devolucion).subscribe(
      response => {
        this.mensaje = 'Devolución registrada con éxito';
        this.success = true;
        this.devoluciones.push(devolucion);
        this.resetForm();
      },
      error => {
        console.error('Error al registrar la devolución:', error);
        if(error.error && error.error.message) {  //mensaje personalizado
          this.mensaje = error.error.message;
        } else {
          this.mensaje = 'Error al registrar la devolución';
        }
        this.success = false;
      }
    );
  }

  resetForm() {
    this.id_venta = 0;
    this.id_producto = 0;
    this.cantidad = 0;
    this.razon = 0;
  }
}