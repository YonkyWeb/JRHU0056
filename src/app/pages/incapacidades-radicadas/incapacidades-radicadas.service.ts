import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Incapacidad } from 'src/app/model/incapacidad';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class IncapacidadesRadicadasService {
    
    private baseUrl:string = environment.baseUrl;

    constructor(private http:HttpClient) { }

    findAllRadicaciones() {
        return this.http.get<Incapacidad[]>(`${this.baseUrl}/incapacidades/listarIncapacidades`);
    }
}
