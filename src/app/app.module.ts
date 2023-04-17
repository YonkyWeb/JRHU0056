import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { VisualizadorDocumentoComponent } from './pages/visualizador-documento/visualizador-documento.component';
import { InformacionIncapacidadComponent } from './pages/informacion-incapacidad/informacion-incapacidad.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IncapacidadesRadicadasComponent } from './pages/incapacidades-radicadas/incapacidades-radicadas.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    VisualizadorDocumentoComponent,
    InformacionIncapacidadComponent,
    IncapacidadesRadicadasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
