import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdoptaComponent } from './adopta/adopta.component';
import { GaleriaComponent } from './galeria/galeria.component';
import { AboutComponent } from './about/about.component';
import { ReporteComponent } from './reporte/reporte.component';
import { DescComponent } from './desc/desc.component';
import { VentaComponent } from './venta/venta.component';
import { DevolucionComponent } from './devolucion/devolucion.component';
import { AgregarComponent } from './agregar/agregar.component';


export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'consulta', component: AdoptaComponent},
    {path: 'alta', component: GaleriaComponent},
    {path: 'modificar', component: AboutComponent},
    {path: 'baja', component: ReporteComponent},
    {path: 'desc', component: DescComponent},
    {path: 'venta', component: VentaComponent},
    {path: 'devolucion', component: DevolucionComponent},
    {path: 'agregar', component: AgregarComponent}
];