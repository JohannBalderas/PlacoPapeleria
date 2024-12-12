import { HttpClient } from '@angular/common/http';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdopcionesService } from '../shared/adopciones.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.css'
})
export class VentaComponent implements OnInit {
  mensaje: string = '';
  success: boolean = false;
  empleados: any[] = [];
  formasPago: any[] = [];
  sucursales: any[] = [];
  id_empleado: number = 0;
  id_formapago: number = 0;
  id_cliente: number = 0;
  id_sucursal: number = 0;
  carrito: Array<any> = []; 
  productos: any[] = [];
  total: number = 0; 

  constructor(private adopcionesService: AdopcionesService) {}

  ngOnInit() {
    this.adopcionesService.getProductos().subscribe(data => this.productos = data);
    this.adopcionesService.getEmpleados().subscribe(data => {
      console.log('Empleados:', data);
      this.empleados = data;
    });
  
    this.adopcionesService.getFormasPago().subscribe(data => {
      console.log('Formas de Pago:', data);
      this.formasPago = data;
    });

    this.adopcionesService.getSucursales().subscribe(data => {
      console.log('Sucursales:', data);
      this.sucursales = data;
    });
  }

  buscarProductos(termino: string) {
    this.adopcionesService.getProductos(termino).subscribe((data) => {
      this.productos = data;
    });
  }

  agregarProducto(producto: any) {
    const productoEnCarrito = this.carrito.find(p => p.id_producto === producto.id_producto);
    if (productoEnCarrito) {
      productoEnCarrito.cantidad += 1;
    } else {
      this.carrito.push({ ...producto, cantidad: 1, precio_unitario: producto.precio });
    }
    this.actualizarTotal();
  }
  

  actualizarTotal() {
    this.total = this.carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  }

  finalizarVenta() {
    if (!this.id_empleado || !this.id_formapago || !this.id_cliente || !this.id_sucursal) {
      alert('Por favor selecciona un empleado, un cliente, una forma de pago y una sucursal.');
      return;
    }
  
    const venta = {
      id_cliente: this.id_cliente,
      id_empleado: this.id_empleado,
      id_formapago: this.id_formapago,
      id_sucursal: this.id_sucursal,
      productos: this.carrito.map(({ id_producto, cantidad, precio }) => ({
        id_producto,
        cantidad,
        precio_unitario: precio
      })),
      total: this.total,
    };
  
    this.adopcionesService.registrarVenta(venta).subscribe({
      next: (response: any) => {
        this.mensaje = 'Venta realizada con éxito';
        this.success = true;
        this.carrito = [];
        this.total = 0;
        this.id_empleado = 0;
        this.id_formapago = 0;
        this.id_cliente = 0;
        this.id_sucursal = 0;
      },
      error: (err) => {
        this.mensaje = err.error.message || 'Error al procesar la venta';
        this.success = false;
      }
    });
  }
}