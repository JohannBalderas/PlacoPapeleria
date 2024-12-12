import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdopcionesService {
  private apiUrl = 'http://localhost:3000/api'; //direccion del backend

  constructor(private http: HttpClient) {}

  retornar(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tablas`);
  }

  obtenerDatosTabla(tabla: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/tabla/${tabla}`);
  }

  obtenerEstructuraTabla(tabla: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/estructura/${tabla}`);
  }

  agregarRegistro(tabla: string, registro: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/tabla/${tabla}`, registro);
  }

  eliminarRegistro(tabla: string, id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tabla/${tabla}/${id}`);
  }

  obtenerRegistro(tabla: string, id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/tabla/${tabla}/registro/${id}`);
  }

  actualizarRegistro(tabla: string, id: string, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/tabla/${tabla}/registro/${id}`, datos);
  }

  obtenerQuery(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/query/${id}`);
  }

  getProductos(search?: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/productos`, {
      params: search ? { search } : {},
      responseType: 'json' as 'json'
    });
  }

  getIDProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ID_productos`);
  }
  
  registrarVenta(venta: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/venta`, venta); 
  }  
  
  getEmpleados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/empleados`);
  }
  
  getFormasPago(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/formas_pago`);
  }

  getStock(idProducto: number, idSucursal: number): Observable<any> {
    return this.http.get(`/api/inventario/${idProducto}/${idSucursal}`);
  }

  getSucursales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sucursales`);
  }

  getVentas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ventas`);
  }
  
  registrarDevolucion(devolucion: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/devoluciones`, devolucion);
  }

  getRazones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/razones`);
  }

  agregarColumna(datos: { tabla: string; columna: string; tipo: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/agregar-columna`, datos);
  }
  
}