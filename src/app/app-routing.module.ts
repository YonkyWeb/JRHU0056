import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncapacidadesRadicadasComponent } from './pages/incapacidades-radicadas/incapacidades-radicadas.component';
import { InformacionIncapacidadComponent } from './pages/informacion-incapacidad/informacion-incapacidad.component';
import { VisualizadorDocumentoComponent } from './pages/visualizador-documento/visualizador-documento.component';

const routes: Routes = [
    { path: 'incapacidades/radicacion/informacion-incapacidad', component: InformacionIncapacidadComponent },
    { path: 'incapacidades/radicacion/visualizador-doc-incapacidad', component: VisualizadorDocumentoComponent },
    { path: 'incapacidades/radicacion/incapacidades', component: IncapacidadesRadicadasComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'incapacidades/radicacion/visualizador-doc-incapacidad' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
