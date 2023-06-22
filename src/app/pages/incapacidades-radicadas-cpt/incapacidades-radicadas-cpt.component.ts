import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { Table } from 'primeng/table';
import { AppService } from 'src/app/app.service';
import { EstadosRadicadoEnum } from 'src/app/model/enums';
import { Incapacidad } from 'src/app/model/incapacidad';
import { Observacion } from 'src/app/model/observacion';
import { IncapacidadesRadicadasService } from '../incapacidades-radicadas/incapacidades-radicadas.service';
import { IncapacidadesRadicadasCptService } from './incapacidades-radicadas-cpt.service';

@Component({
    selector: 'app-incapacidades-radicadas-cpt',
    templateUrl: './incapacidades-radicadas-cpt.component.html',
    styleUrls: ['./incapacidades-radicadas-cpt.component.scss']
})
export class IncapacidadesRadicadasCptComponent {

    numeroRadicadoSeleccionado:number;
    isLoadingIncapacidades:boolean = false;
    isLoadingObservaciones:boolean = false;
    incapacidades:Incapacidad[] = [];
    incapacidadSelected:Incapacidad;
    errorMessageWarning:string = '';
    observacionesConsulta:Observacion[] = [];

    constructor(private radicacionesService:IncapacidadesRadicadasService,
        private radicacionCptService:IncapacidadesRadicadasCptService,
        private toastr:ToastrService,
        private appService:AppService,
        private modalService:NgbModal,
        private stogare:LocalStorageService,
        private router:Router) {}

    ngOnInit(): void {
        this.findAllRadicaciones();
    }


    getGlobalFilterFields() {
        return ['numeroRadicado', 'fechaInicial', 'fechaFinal', 'fechaDeRadicacion', 'tipoIncapacidad', 'nombreEmpresa'];
    }

    clearTable(table: Table) {
        table.clear();
    }

    filter(dtIncapacidades:any, event:any) {
        return dtIncapacidades.filterGlobal(event.target.value, 'contains')
    }

    findAllRadicaciones() {
        this.isLoadingIncapacidades = true;
        this.radicacionesService.findAllRadicaciones().subscribe({
            next: (data) => {
                console.log(data);
                this.incapacidades = data;
                this.incapacidades = this.incapacidades.filter(inc => inc.estado.includes(EstadosRadicadoEnum.CPT));
            },
            error: (error) => {
                console.log(error);
                this.toastr.error(error.message);
                this.appService.manageHttpError(error);
            },
            complete: () => {
                this.isLoadingIncapacidades = false;
            }
        });
    }

    viewDetailsIncapacidad(incapacidad:Incapacidad, modal:any) {
        this.modalService.open(modal, { centered: true });
        this.incapacidadSelected = incapacidad;
    }

    viewDocumentacion(incapacidad:Incapacidad) {
        this.stogare.store('incapacidad', incapacidad)
        this.router.navigate(['incapacidades/radicacion/visualizador-documentos']);
        window.scroll(0,0);
    }

    viewObservacionesIncapacidad(incapacidad:Incapacidad, modal:any) {
        this.observacionesConsulta = [];
        this.modalService.open(modal, { centered: true });
        this.findObservacionesByNumeroRadicado(incapacidad.numeroRadicado);
    }

    findObservacionesByNumeroRadicado(radicado:number) {
        console.log(radicado);
        this.numeroRadicadoSeleccionado = radicado;
        this.isLoadingObservaciones = true;
        this.observacionesConsulta = [];
        this.radicacionCptService.findObservacionesByNumeroRadicado(radicado).subscribe({
            next: (data) => {
                console.log(data);
                this.observacionesConsulta = data;
            },
            error: (error) => {
                console.log(error);
                this.toastr.error(error.message);
                this.appService.manageHttpError(error);
            }, 
            complete: () => {
                this.isLoadingObservaciones = false;
            }
        });
    }
}
