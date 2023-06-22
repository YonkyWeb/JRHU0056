import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ResponseDocumentosRadicado } from 'src/app/model/response-documentos-radicado';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { EstadoObservacion } from 'src/app/model/estado-observacion';
import { RequestCambioEstadoDocumento } from 'src/app/model/request-cambio-estado-documento';
import { RequestCambioEstadoRadicado } from 'src/app/model/request-cambio-estado-radicado';
import { ResponseCambioEstadoDocumento } from 'src/app/model/response-cambio-estado-documento';

@Injectable({
    providedIn: 'root'
})
export class VisualizadorDocumentoService {

    private baseUrl: string = environment.baseUrl;
    private cancelRequest$ = new Subject<void>();
    private requestSubscription: Subscription;


    constructor(private http: HttpClient,
        private router:Router) { }

    findDocumentosCargados(numeroRadicado: number, userIp: string) {
        return this.http.get<ResponseDocumentosRadicado[]>(`${this.baseUrl}/incapacidades/listarDocumentosPorRadicado/${numeroRadicado}/${userIp}`);
    }

    concatDocuments(azCodigos: string[]) {
        return this.http.post<any>(`${this.baseUrl}/incapacidades/concatenarDocumentos`, azCodigos).pipe(takeUntil(this.cancelRequest$));
    }

    makeViewDocumentRequest(ruta:string) {
        return this.http.get<any>(ruta);
    }

    findEstadosObservacion() {
        return this.http.get<EstadoObservacion[]>(`${this.baseUrl}/incapacidades/listarEstadosObservaciones`);
    }

    cancelRequest(): void {
        this.cancelRequest$.next();
    }

    updateEstadoDocumento(request:RequestCambioEstadoDocumento) {
        return this.http.post<ResponseCambioEstadoDocumento>(`${this.baseUrl}/incapacidades/actulizarDocumentos`, request);
    }

    updateEstadoRadicado(request:RequestCambioEstadoRadicado) {
        return this.http.put(`${this.baseUrl}/incapacidades/actualizarEstado`, request);
    }
}
