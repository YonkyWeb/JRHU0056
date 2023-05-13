import { Component } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';
import { Incapacidad } from 'src/app/model/incapacidad';
import { ResponseDocumentosRadicado } from 'src/app/model/response-documentos-radicado';
import { VisualizadorDocumentoService } from './visualizador-documento.service';

@Component({
    selector: 'app-visualizador-documento',
    templateUrl: './visualizador-documento.component.html',
    styleUrls: ['./visualizador-documento.component.scss']
})
export class VisualizadorDocumentoComponent {

    @ViewChild('documentacion') documentacion:ElementRef;
    incapacidad:Incapacidad = new Incapacidad();
    documentos:ResponseDocumentosRadicado[] = [];
    isLoadingDocumentos:boolean = false;
    userIp:string = '';
    documentoAVer:ResponseDocumentosRadicado;

    constructor(private router:Router,
        private visualizadorService:VisualizadorDocumentoService,
        private storage:LocalStorageService,
        private appService:AppService,
        private toast:ToastrService) {}

    ngOnInit(): void {
        this.getIncapacidadLocalStorage();
        this.findAllUploadedDocuments();
    }

    getIncapacidadLocalStorage() {
        this.incapacidad = this.storage.retrieve('incapacidad');
    }

    findAllUploadedDocuments() {
        this.appService.getIPAddress().subscribe((data:any) => {
            this.isLoadingDocumentos = true;
            this.visualizadorService.findDocumentosCargados(this.incapacidad.numeroRadicado, data.ip).subscribe({
                next: (data) => {
                    console.log(data);
                    this.documentos = data;
                }, 
                error: (error) => {
                    console.log(error);
                    this.toast.error(error.message);
                    this.appService.manageHttpError(error);
                }, 
                complete: () => {
                    this.isLoadingDocumentos = false;
                }
            });
        });
    }

    viewDocument(documento:ResponseDocumentosRadicado) {
        documento.ruta = documento.ruta.replace('AZDigital', 'AZDigital_Pruebas');
        this.documentoAVer = documento;
        this.documentacion.nativeElement.focus();
    }


    sanarUrl(url:string) {
        return this.appService.sanarUrl(url);
    }
}
