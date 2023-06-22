import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { Table } from 'primeng/table';
import { AppService } from 'src/app/app.service';
import { Incapacidad } from 'src/app/model/incapacidad';
import { EstadosRadicadoEnum } from 'src/app/model/enums';
import { IncapacidadesRadicadasService } from './incapacidades-radicadas.service';
import { Observacion } from 'src/app/model/observacion';
import { IncapacidadesRadicadasCptService } from '../incapacidades-radicadas-cpt/incapacidades-radicadas-cpt.service';

@Component({
    selector: 'app-incapacidades-radicadas',
    templateUrl: './incapacidades-radicadas.component.html',
    styleUrls: ['./incapacidades-radicadas.component.scss']
})
export class IncapacidadesRadicadasComponent {

    isLoading:boolean = false;
    incapacidades:Incapacidad[] = [];
    incapacidadSelected:Incapacidad;
    errorMessageWarning:string = '';
    observacionesConsulta:Observacion[] = [];
    numeroRadicadoSeleccionado:number;
    isLoadingObservaciones:boolean = false;

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
        this.isLoading = true;
        this.radicacionesService.findAllRadicaciones().subscribe({
            next: (data) => {
                console.log(data);
                this.incapacidades = data;
                this.incapacidades = this.incapacidades.filter(inc => !inc.estado.includes(EstadosRadicadoEnum.CPT));
            },
            error: (error) => {
                console.log(error);
                this.toastr.error(error.message);
                this.appService.manageHttpError(error);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    viewDetailsIncapacidad(incapacidad:Incapacidad, modal:any) {
        this.modalService.open(modal, { centered: true });
        this.incapacidadSelected = incapacidad;
    }

    viewObservacionesIncapacidad(incapacidad:Incapacidad, modalObservaciones:any) {
        this.observacionesConsulta = [];
        this.modalService.open(modalObservaciones, { centered: true });
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
