import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { VisualizadorDocumentoComponent } from './pages/visualizador-documento/visualizador-documento.component';
import { IncapacidadesRadicadasComponent } from './pages/incapacidades-radicadas/incapacidades-radicadas.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { ToastrModule } from 'ngx-toastr';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { Error404Component } from './pages/error/error404/error404.component';
import { Error500Component } from './pages/error/error500/error500.component';
import { UnknownErrorComponent } from './pages/error/unknown-error/unknown-error.component';
import { ErrorAzComponent } from './pages/error/error-az/error-az.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    VisualizadorDocumentoComponent,
    IncapacidadesRadicadasComponent,
    Error404Component,
    Error500Component,
    UnknownErrorComponent,
    ErrorAzComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgxWebstorageModule.forRoot(),
    NgbModule,
    TableModule,
    ButtonModule,
    TabMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
