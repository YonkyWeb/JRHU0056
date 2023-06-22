import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observacion } from 'src/app/model/observacion';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class IncapacidadesRadicadasCptService {

    private baseUrl:string = environment.baseUrl;

    constructor(private http:HttpClient) { }

    findObservacionesByNumeroRadicado(radicado:number) {
        return this.http.get<Observacion[]>(`${this.baseUrl}/incapacidades/listarObservacionPorRadicado/${radicado}`);
    }
}
