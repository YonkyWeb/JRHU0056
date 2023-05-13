import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorAzComponent } from './pages/error/error-az/error-az.component';
import { Error404Component } from './pages/error/error404/error404.component';
import { Error500Component } from './pages/error/error500/error500.component';
import { UnknownErrorComponent } from './pages/error/unknown-error/unknown-error.component';
import { IncapacidadesRadicadasComponent } from './pages/incapacidades-radicadas/incapacidades-radicadas.component';
import { VisualizadorDocumentoComponent } from './pages/visualizador-documento/visualizador-documento.component';

const routes: Routes = [
    { path: '', component: IncapacidadesRadicadasComponent },
    { path: 'incapacidades/radicacion/visualizador-documentos', component: VisualizadorDocumentoComponent },
    { path: 'incapacidades/radicacion/radicaciones', component: IncapacidadesRadicadasComponent },
    { path: 'error-az', component: ErrorAzComponent },
    { path: 'error-404', component: Error404Component },
    { path: 'error-500', component: Error500Component },
    { path: 'unknown-error', component: UnknownErrorComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'error-404' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
