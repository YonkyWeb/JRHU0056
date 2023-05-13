import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { Table } from 'primeng/table';
import { AppService } from 'src/app/app.service';
import { Incapacidad } from 'src/app/model/incapacidad';
import { IncapacidadesRadicadasService } from './incapacidades-radicadas.service';

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

    constructor(private radicacionesService:IncapacidadesRadicadasService,
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
        this.modalService.open(modal);
        this.incapacidadSelected = incapacidad;
    }

    viewDocumentacion(incapacidad:Incapacidad) {
        this.stogare.store('incapacidad', incapacidad)
        this.router.navigate(['incapacidades/radicacion/visualizador-documentos']);
        window.scroll(0,0);
    }

    
}
