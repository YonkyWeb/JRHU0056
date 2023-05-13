import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ResponseDocumentosRadicado } from 'src/app/model/response-documentos-radicado';

@Injectable({
    providedIn: 'root'
})
export class VisualizadorDocumentoService {

    private baseUrl:string = environment.baseUrl;

    constructor(private http:HttpClient) { }

    findDocumentosCargados(numeroRadicado:number, userIp:string) {
        return this.http.get<ResponseDocumentosRadicado[]>(`${this.baseUrl}/incapacidades/listarDocumentosPorRadicado/${numeroRadicado}/${userIp}`);
    }
}
