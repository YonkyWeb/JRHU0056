import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';
import { ResponseDocumentosRadicado } from 'src/app/model/response-documentos-radicado';
import { VisualizadorDocumentoService } from './visualizador-documento.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Incapacidad } from 'src/app/model/incapacidad';
import { EstadosDocumentoCargadoEnum, EstadosDocumentoEnum, EstadosObservacionEnum, UsuarioSesionEnum } from 'src/app/model/enums';
import { DocumentoConcatenar } from 'src/app/model/documento-concatenar';
import { RequestCambioEstadoDocumento } from 'src/app/model/request-cambio-estado-documento';
import { DocumentoAdminMesaControl } from 'src/app/model/documento-admin-mesa-control';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EstadoObservacion } from 'src/app/model/estado-observacion';
import { RequestCambioEstadoRadicado } from 'src/app/model/request-cambio-estado-radicado';

@Component({
    selector: 'app-visualizador-documento',
    templateUrl: './visualizador-documento.component.html',
    styleUrls: ['./visualizador-documento.component.scss']
})
export class VisualizadorDocumentoComponent {

    incapacidadSelected: Incapacidad = new Incapacidad();
    documentos: ResponseDocumentosRadicado[] = [];
    documentosToUpdate: DocumentoAdminMesaControl[] = [];
    estadosObservacion:EstadoObservacion[] = [];

    requestCambiarEstadoRadicacion:RequestCambioEstadoRadicado = new RequestCambioEstadoRadicado();

    rutaDocumentoSelected: string = '';
    nombreDocumentoSelected: string = '';
    errorMessage: string = '';

    documentoSelectedObservacion:DocumentoAdminMesaControl;
    estadoObservacion:string = '';
    observacion:string;
    observacionDocumentoRechazado:string = '';

    isLoadingDocumentos: boolean = false;
    isLoadingDocumento: boolean = false;
    isLoadingConcatDocs: boolean = false;
    isLoadingDevolverRadicacion: boolean = false;
    isLoadingEnTranscripcionRadicacion: boolean = false;
    isShowingDocument: boolean = false;

    submittedObservacion:boolean = false;
    submittedObservacionDoc:boolean = false;

    documentosCargados: DocumentoConcatenar[] = [];

    modalConcatDocs: any;
    modalLoading: any;
    modalError: any;
    modalObservacionRadicacion: any;
    modalObservacionDocumento: any;

    formObservacion: FormGroup = new FormGroup({
        estadoObservacion: new FormControl(''),
        observacion: new FormControl(''),
    });

    isCanceledConcatDocs: boolean = false;

    constructor(private router: Router,
        private visualizadorService: VisualizadorDocumentoService,
        private storage: LocalStorageService,
        private appService: AppService,
        private toast: ToastrService,
        private modalService: NgbModal,
        private fb: FormBuilder) { }

    formObservacionDoc: FormGroup = new FormGroup({
        observacionDoc: new FormControl(''),
    });

    ngOnInit(): void {
        this.getIncapacidadLocalStorage();
        this.findAllUploadedDocuments();
        this.findEstadosObservacion();
        this.buildFormObservacionDoc();
        this.buildFormObservacion();
    }

    getIncapacidadLocalStorage() {
        this.incapacidadSelected = this.storage.retrieve(UsuarioSesionEnum.incapacidad);
    }

    findAllUploadedDocuments() {
        this.isLoadingDocumentos = true;
        this.documentosToUpdate = [];
        this.appService.getIPAddress().subscribe((data: any) => {
            this.visualizadorService.findDocumentosCargados(this.incapacidadSelected.numeroRadicado, data.ip).subscribe({
                next: (data) => {
                    console.log(data);
                    this.documentos = data;
                    this.documentos.forEach(d => {
                        let documento: DocumentoAdminMesaControl = new DocumentoAdminMesaControl();
                        documento.idDocumento = d.documento.idDocumento;
                        documento.documento = d.documento.nombreDocumento;
                        documento.radicado = this.incapacidadSelected.numeroRadicado;
                        documento.azCodigo = d.azCodigoCli;
                        documento.ruta = d.ruta;
                        documento.documentoRequerido = d.documentoRequerido;
                        documento.estadoCarga = this.getEstadoDocumento(d);
                        documento.estadoValidar = d.estadoDelDocumento;
                        documento.observacion = '';
                        this.documentosToUpdate.push(documento);
                    });
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

    showDocument(documento: DocumentoAdminMesaControl) {
        this.isShowingDocument = true;
        this.isLoadingDocumento = true;
        this.rutaDocumentoSelected = documento.ruta;
        this.nombreDocumentoSelected = documento.documento;
        this.visualizadorService.makeViewDocumentRequest(this.rutaDocumentoSelected).subscribe({
            next: (data) => {
                console.log(data);
            },
            error: (error) => {
                console.log(error);
                this.toast.error(error);
            },
            complete: () => {
                this.isLoadingDocumento = false;
            }
        });
    }

    hideDocument() {
        this.isShowingDocument = false;
    }

    sanarUrl(url: string) {
        return this.appService.sanarUrl(url);
    }

    getEstadoDocumento(documento: ResponseDocumentosRadicado): string {
        let estado: string = EstadosDocumentoCargadoEnum.no_cargado;
        if (documento.azCodigoCli) {
            if (documento.azCodigoCli.length > 0) {
                estado = EstadosDocumentoCargadoEnum.Cargado;
            }
        }
        return estado;
    }

    findCountDocumentoPorEstado(estado: string): number {
        let counter: number = 0;
        this.documentosToUpdate.forEach(d => {
            if (d.estadoCarga === estado) {
                counter++;
            }
        });

        return counter;
    }

    openConcatDocsModal(modalConcat: any, modalError: any, modalLoading: any) {
        this.documentosCargados = [];

        this.modalConcatDocs = this.modalService.open(modalConcat);
        this.modalError = modalError;
        this.modalLoading = modalLoading;

        this.documentosToUpdate.forEach(d => {
            if (d.estadoCarga === EstadosDocumentoCargadoEnum.Cargado) {
                let documentoConcat: DocumentoConcatenar = new DocumentoConcatenar();
                documentoConcat.idDocumento = parseInt(d.idDocumento);
                documentoConcat.azCodigoCli = d.azCodigo;
                documentoConcat.documento = d.documento;
                documentoConcat.checked = false;
                this.documentosCargados.push(documentoConcat);
            }
        });
    }

    concatAndDownload() {
        let base64:string = '';
        this.closeModalConcatDocs();
        this.openModalLoading(this.modalLoading);
        this.isLoadingConcatDocs = true;
        
        this.visualizadorService.concatDocuments(this.getAzCodigosForDocument()).subscribe({
            next: (data) => {
                console.log(data);
                base64 = data.mensaje;
            },
            error: (error) => {
                console.log(error);
                this.closeModalLoading();
                this.openModalError(this.modalError);
                this.toast.error(error.message);
                this.appService.manageHttpError(error);
            },
            complete: () => {
                this.isLoadingConcatDocs = false;
                this.closeModalLoading();
                this.downloadConcatedDocument(base64, 'documento_concatenado.pdf');
                if (!this.isCanceledConcatDocs) {
                    this.toast.success("Se ha concatenado correctamente los documentos.");
                }
            }
        });
    }

    downloadConcatedDocument(base64:string, fileName:string) {
        this.appService.downloadPDF(base64, fileName);
    }

    findEstadosObservacion() {
        this.isLoadingDocumentos = true;
        this.visualizadorService.findEstadosObservacion().subscribe({
            next: (response) => {
                console.log(response);
                this.estadosObservacion = response;
            },
            error: (error) => {
                console.log(error);
                this.toast.error(error.message);
                this.appService.manageHttpError(error);
            },
            complete: () => {
                this.isLoadingDocumentos = true;
            }
        });
    }

    sanarStringCoding(wrongText: string): string {
        return this.appService.sanarStringCoding(wrongText);
    }

    convertStringFirstCapitalLetter(str: string) {
        return this.appService.convertStringFirstCapitalLetter(str);
    }

    getAzCodigosForDocument(): string[] {
        let azCodigos: string[] = [];
        this.documentosCargados.forEach(dc => {
            console.log(dc);
            if (dc.checked) {
                azCodigos.push(dc.azCodigoCli);
            }
        });
        return azCodigos;
    }

    buildFormObservacionDoc() {
        this.formObservacionDoc = this.fb.group({
            observacionDoc: ['', Validators.required],
        });
    }

    buildFormObservacion() {
        this.formObservacion = this.fb.group({
            estadoObservacion: ['', Validators.required],
            observacion: ['', Validators.required],
        });
    }

    openModalConcatDocs(modal: any) {
        this.modalConcatDocs = this.modalService.open(modal);
    }

    openModalLoading(modal: any) {
        this.modalLoading = this.modalService.open(modal, { backdrop: 'static', centered: true });
    }

    openModalError(modal: any) {
        this.modalError = this.modalService.open(modal, { centered: true });
    }

    openModalObservacionRadicacion(modal: any) {
        this.modalObservacionRadicacion = this.modalService.open(modal);
    }

    openModalObservacionDocumento(modal: any) {
        this.modalObservacionDocumento = this.modalService.open(modal);
    }

    closeModalConcatDocs() {
        this.modalConcatDocs.close();
    }

    closeModalError() {
        this.modalError.close();
    }

    closeModalObservacionRadicacion() {
        this.modalObservacionRadicacion.close();
    }

    closeModalObservacionDocumento() {
        this.modalObservacionDocumento.close();
    }

    closeModalLoading() {
        this.modalLoading.close();
    }

    cancelConcatDocs() {
        this.isCanceledConcatDocs = true;
        this.visualizadorService.cancelRequest();
        this.closeModalLoading();
        this.toast.warning('Se ha cancelado la concatenación de los documentos.');
    }
    
    devolverRadicacion(modalObservacion: any, modalLoading: any, modalError: any) {
        if (this.validIncapacidadDevolver().length > 0) {
            this.errorMessage = '<p>Para cambiar la radicación a <strong>"Devolución"</strong> debe validar lo siguiente:</p><ul>' +
            this.validIncapacidadDevolver() + '</ul></p>';
            window.scroll(0, 0);
            return;
        }

        this.errorMessage = '';
        this.modalObservacionRadicacion = modalObservacion;
        this.modalLoading = modalLoading;
        this.modalError = modalError;
        this.openModalObservacionRadicacion(this.modalObservacionRadicacion);
    }

    incapacidadEnTranscripcion() {
        if (this.validIncapacidadEnTranscripcion().length > 0) {
            this.errorMessage = '<p>Para cambiar la radicación a <strong>"En Transcripción"</strong> debe validar lo siguiente:</p><ul>' +
                this.validIncapacidadEnTranscripcion() + '</ul></p>';
            window.scroll(0, 0);
            return;
        }

        this.errorMessage = '';

        let requestCambioEstadoRadicado:RequestCambioEstadoRadicado = new RequestCambioEstadoRadicado();

        requestCambioEstadoRadicado.numeroRadicado = this.incapacidadSelected.numeroRadicado;
        requestCambioEstadoRadicado.estadoRadicado = EstadosObservacionEnum.EN_TRANSCRIPCION;
        requestCambioEstadoRadicado.observacion = 'SE CAMBIA EN TRANSCRIPCION';

        console.log(requestCambioEstadoRadicado);

        this.updateEstadoRadicacion(requestCambioEstadoRadicado, this.modalLoading);
    }

    devolverRadicacionObservacion() {
        this.submittedObservacion = true;

        if(this.formObservacion.invalid)  {
            return;
        }

        let requestCambioEstadoRadicado:RequestCambioEstadoRadicado = new RequestCambioEstadoRadicado();

        requestCambioEstadoRadicado.numeroRadicado = this.incapacidadSelected.numeroRadicado;
        requestCambioEstadoRadicado.estadoRadicado = this.estadoObservacion;
        requestCambioEstadoRadicado.observacion = this.observacion;

        console.log(requestCambioEstadoRadicado);

        this.updateEstadoRadicacion(requestCambioEstadoRadicado, this.modalLoading);
        this.closeModalObservacionRadicacion();
    }

    aprobarDocumento(documento: DocumentoAdminMesaControl) {
        documento.estadoValidar = EstadosDocumentoEnum.APROBADO;
        documento.observacion = '';
        this.toast.success('Documento APROBADO');
    }

    openDevolverDocumentoModal(documento: DocumentoAdminMesaControl, modal: any) {
        this.observacionDocumentoRechazado = '';
        this.documentoSelectedObservacion = documento;
        
        this.openModalObservacionDocumento(modal);
    }

    devolverDocumento() {
        this.submittedObservacionDoc = true;
        if(this.formObservacionDoc.invalid) {
            return;
        }

        this.documentoSelectedObservacion.observacion = this.observacionDocumentoRechazado;
        this.documentoSelectedObservacion.estadoValidar = EstadosDocumentoEnum.RECHAZADO;
        this.closeModalObservacionDocumento();
        this.toast.success('Observación registrada correctamente.');
    }

    sinValidarDocumento(documento: DocumentoAdminMesaControl) {
        documento.estadoValidar = EstadosDocumentoEnum.SIN_VALIDAR;
        this.toast.warning('Documento SIN VALIDAR');
    }

    validIncapacidadEnTranscripcion(): string {
        let message: string = '';

        this.documentosToUpdate.forEach(d => {
            if (d.estadoValidar === EstadosDocumentoEnum.SIN_VALIDAR && d.estadoCarga === EstadosDocumentoCargadoEnum.no_cargado && d.documentoRequerido === 'S') {
                message += '<li>El documento <strong>' + this.convertStringFirstCapitalLetter(d.documento) + '</strong> debe ser cargado por el usuario.</li>';
            }

            if (d.estadoValidar === EstadosDocumentoEnum.SIN_VALIDAR && d.estadoCarga === EstadosDocumentoCargadoEnum.Cargado) {
                message += '<li>El documento <strong>' + this.convertStringFirstCapitalLetter(d.documento) + '</strong> debe ser validado.</li>';
            }

            if (d.estadoValidar === EstadosDocumentoEnum.RECHAZADO && d.estadoCarga === EstadosDocumentoCargadoEnum.Cargado) {
                message += '<li>El documento <strong>' + this.convertStringFirstCapitalLetter(d.documento) + '</strong> debe ser <strong>APROBADO</strong>.</li>';
            }
        });

        return message;
    }

    validIncapacidadDevolver(): string {
        let message: string = '';
        let documentosRechazados: number = 0;
        let documentosAprobados: number = 0;
        let totalDocumentos: number = this.documentosToUpdate.length;

        this.documentosToUpdate.forEach(d => {
            if (d.estadoValidar === EstadosDocumentoEnum.SIN_VALIDAR && d.estadoCarga === EstadosDocumentoCargadoEnum.Cargado) {
                message += '<li>El documento <strong>' + this.convertStringFirstCapitalLetter(d.documento) + '</strong> debe ser validado.</li>';
            }

            if (d.estadoValidar === EstadosDocumentoEnum.RECHAZADO && d.estadoCarga === EstadosDocumentoCargadoEnum.Cargado) {
                documentosRechazados++;
            }
        });

        if (documentosRechazados == 0 && totalDocumentos == documentosAprobados) {
            message += '<li>No hay documentos <strong>RECHAZADOS</strong>.</li>';
        }

        return message;
    }

    getDocumentosRequestCambioEstado(): RequestCambioEstadoDocumento[] {
        let documentosCambioEstado: RequestCambioEstadoDocumento[] = [];

        this.documentosToUpdate.forEach(d => {
            if (d.estadoCarga != EstadosDocumentoCargadoEnum.no_cargado) {
                let docCambioEstado: RequestCambioEstadoDocumento = new RequestCambioEstadoDocumento();
                docCambioEstado.numeroRadicado = d.radicado;
                docCambioEstado.codigoDocumento = parseInt(d.idDocumento);
                docCambioEstado.estadoDocumento = d.estadoValidar;
                docCambioEstado.observacion = d.observacion;
                documentosCambioEstado.push(docCambioEstado);
            }
        });

        return documentosCambioEstado;
    }

    get fod(): { [key: string]: AbstractControl } {
        return this.formObservacionDoc.controls;
    }

    get fo(): { [key: string]: AbstractControl } {
        return this.formObservacion.controls;
    }

    saveObservaciones(requestList:RequestCambioEstadoDocumento[]) {
        requestList.forEach(request => {
            this.visualizadorService.updateEstadoDocumento(request).subscribe({
                next: (response) => {
                    console.log(response);
                }, 
                error: (error) => {
                    console.log(error);
                    this.toast.error(error.message);
                },
                complete: () => {

                }
            });
        });
    }

    updateEstadoRadicacion(request:RequestCambioEstadoRadicado, modal:any) {
        this.openModalLoading(modal);
        this.visualizadorService.updateEstadoRadicado(request).subscribe({
            next: (data) => {
                console.log(data);
                this.toast.success('Radicacion devuelta correctamente.');
            }, 
            error: (error) => {
                console.log(error);
                this.toast.error(error.message);
                this.closeModalLoading();
                this.openModalError(this.modalError);
            },
            complete: () => {
                this.saveObservaciones(this.getObservacionesRequestPorDocumento());
                this.closeModalObservacionRadicacion();
                this.closeModalLoading();
                this.router.navigate(['/incapacidades/radicacion/radicaciones-cpt']);
            }
        });
    }

    getObservacionesRequestPorDocumento() {
        let requestList:RequestCambioEstadoDocumento[] = [];
        this.documentosToUpdate.forEach(doc => {
            let request:RequestCambioEstadoDocumento = new RequestCambioEstadoDocumento();

            request.numeroRadicado = doc.radicado;
            request.codigoDocumento = parseInt(doc.idDocumento);
            request.estadoDocumento = doc.estadoValidar;
            request.observacion = doc.observacion;

            requestList.push(request);
        });

        return requestList;
    }
}

