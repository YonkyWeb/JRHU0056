import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { timeout } from 'rxjs';
import { Incapacidad } from 'src/app/model/incapacidad';
import { environment } from 'src/environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class IncapacidadesRadicadasService {
    
    private baseUrl:string = environment.baseUrl;

    constructor(private http:HttpClient) { }

    findAllRadicaciones() {
        return this.http.get<Incapacidad[]>(`${this.baseUrl}/incapacidades/listarIncapacidades`).pipe(timeout(20000));
    }
}
