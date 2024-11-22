import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Letra } from 'src/app/models/Letra';
import { CarteraService } from 'src/app/services/cartera.service';
import { LetraService } from 'src/app/services/letra.service';
import { UsuariosService } from 'src/app/services/usuario.service';
import { LoginService } from 'src/app/services/login.service';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-letra-listar',
  templateUrl: './letra-listar.component.html',
  styleUrls: ['./letra-listar.component.css']
})
export class LetraListarComponent {

  dataSource: MatTableDataSource<Letra> = new MatTableDataSource();
  displayedColumns: string[] =
  ['actualizar','id', 'idCartera', 'tipoMoneda', 'idUsuario', 'fechaDeGiro', 'valorNominal', 'fechaDeDscto', 'nDias', 'tep', 'd', 'descuento', 'costesIniciales', 'costesFinales', 'seguro', 'retencion', 'valorNeto', 'valorARecibir', 'flujo', 'tcea','eliminar']
  
  numerotemp:number = 0;
  flujotemp:number = 0.0;
  cashFlows: number[] = [];
  dates: Date[] = [];
  sumaValorRCartera:number=0;
  tempDate: Date=new Date();

  role:string="";
  username: string="";

  @ViewChild(MatSort) sort!: MatSort;

ngAfterViewInit() {
  this.lS.list().subscribe((data) => {
    const sortedData = data.sort((a, b) => a.id - b.id);
    this.dataSource = new MatTableDataSource(sortedData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  });
}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    public route: ActivatedRoute, 
    private cS: CarteraService,
    private router: Router, 
    private lS: LetraService,
    private uS:UsuariosService,
    private loginService:LoginService) {}

  ngOnInit(): void {
    this.role=this.loginService.showRole();
    this.username=this.loginService.showUsername();




    //Actualizar datos

    this.lS.list().subscribe((letras)=> {
      for (let l of letras)
      {
        this.cS.list().subscribe((carteras)=>
        {
          for (let c of carteras)
          {
            if (c.id == l.idCartera.id)
            {
              if (l.tipoMoneda == l.idCartera.tipoMoneda) {l.valorNominal=l.valorNominal}
              else if (l.idCartera.tipoMoneda==2 && l.tipoMoneda==1) {l.valorNominal=l.valorNominal/l.idCartera.cambio}
              else if (l.idCartera.tipoMoneda==1 && l.tipoMoneda == 2) {l.valorNominal=l.valorNominal*l.idCartera.cambio}
              
              const fechadescuentocartera = new Date(c.fechaDescuento);
              const fechadescuentoletra = new Date(l.fechaDeDscto);
              const diferenciaEnMilisegundos = fechadescuentoletra.getTime() - fechadescuentocartera.getTime();
              const nDiasCalculados = Math.ceil(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));
              console.log(nDiasCalculados)

              const tep = (Math.pow(1 + (c.teaCompensatoria/100.00), nDiasCalculados / c.diasXAnio) - 1);

              const d = tep/(1 + tep);

              const descuento = Math.round((l.valorNominal* d) * 100) / 100;

              let costesIniciales = 0.0;
              let costesFinales = 0.0;

              if (l.idCartera.comisionActivacionTipo == 1) {costesIniciales += c.comisionActivacion;} else {costesFinales += c.comisionActivacion;}
              if (l.idCartera.fotocopiasTipo == 1) {costesIniciales += c.fotocopias;} else {costesFinales += c.fotocopias;}
              if (l.idCartera.estudioDeTitulosTipo == 1) {costesIniciales += c.estudioDeTitulos;} else {costesFinales += c.estudioDeTitulos;}
              if (l.idCartera.gastosAdministrativosTipo == 1) {costesIniciales += c.gastosAdministrativos;} else {costesFinales += c.gastosAdministrativos;}
              if (l.idCartera.portesTipo == 1) {costesIniciales += c.portes;} else {costesFinales += c.portes;}

              const seguro = Math.round(((c.seguro/100.00) / c.diasXAnio * nDiasCalculados * l.valorNominal) * 100) / 100;
              const retencion = Math.round(((c.retencion/100.00) * l.valorNominal) * 100) / 100;

              const valorneto = l.valorNominal - descuento;
              const valorARecibir = valorneto - costesIniciales - seguro - retencion; 

              console.log('La letra ' + l.id + ' pertenece a la cartera ' + c.id)

              l.id = l.id;
              l.idCartera=l.idCartera
              l.idUsuario=l.idUsuario
              l.fechaDeGiro=l.fechaDeGiro
              l.valorNominal=l.valorNominal
              l.fechaDeDscto=l.fechaDeDscto
              l.nDias=nDiasCalculados 
              l.tep=tep
              l.d=d
              l.descuento=descuento
              l.costesIniciales=costesIniciales
              l.costesFinales=costesFinales
              l.seguro=seguro
              l.retencion=retencion
              l.valorNeto=valorneto
              l.valorARecibir=valorARecibir
              l.flujo=l.flujo
              l.tcea=l.tcea

              if (l.tipoMoneda == l.idCartera.tipoMoneda) {l.tipoMoneda=l.tipoMoneda}
              else if (l.idCartera.tipoMoneda==2 && l.tipoMoneda==1) {l.tipoMoneda=2}
              else if (l.idCartera.tipoMoneda==1 && l.tipoMoneda == 2) {l.tipoMoneda=1}
              
              this.lS.modificar(l).subscribe();
            }
          }
        })
        
      }

      for (let l of letras)
        {
          this.cS.list().subscribe((carteras)=>
          { 
           
            for (let c of carteras)
            {
              for (let c2 of carteras)
              {
                this.flujotemp = 0;
                for (let l2 of letras)
                  {
                    if (l2.idCartera.id == c2.id)
                      this.flujotemp += l2.valorARecibir;
                  }
                  console.log('RESUMEN 2: El flujo total de la cartera ' + c2.id + ' es ' + this.flujotemp)

                  c2.id=c2.id,
                  c2.fechaDescuento=c2.fechaDescuento,
                  c2.diasXAnio=c2.diasXAnio,
                  c2.comisionActivacion=c2.comisionActivacion,
                  c2.comisionActivacionTipo=c2.comisionActivacionTipo,
                  c2.fotocopias=c2.fotocopias,
                  c2.fotocopiasTipo=c2.fotocopiasTipo,
                  c2.estudioDeTitulos=c2.estudioDeTitulos,
                  c2.estudioDeTitulosTipo=c2.estudioDeTitulosTipo,
                  c2.gastosAdministrativos=c2.gastosAdministrativos,
                  c2.gastosAdministrativosTipo=c2.gastosAdministrativosTipo,
                  c2.portes=c2.portes,
                  c2.portesTipo=c2.portesTipo,
                  c2.seguro=c2.seguro,
                  c2.seguroTipo=c2.seguroTipo,
                  c2.retencion=c2.retencion,
                  c2.retencionTipo=c2.retencionTipo,
                  c2.teaCompensatoria=c2.teaCompensatoria,
                  c2.nDeInstr=c2.nDeInstr,
                  c2.totalARecibir=this.flujotemp,
                  c2.tceaCartera=c2.tceaCartera,
                  c2.tipoMoneda=c2.tipoMoneda,
                  c.cambio=c.cambio
                  this.cS.modificar(c2).subscribe();
              } 


              if (c.id == l.idCartera.id)
              {
                console.log('La letra ' + l.id + ' pertenece a la cartera ' + c.id)
                console.log('El flujo total de la cartera ' + c.id + ' es ' + c.totalARecibir)

                const flujo = (l.valorNominal * -1) - l.costesFinales + l.retencion;

                const tcea = Math.pow(-flujo / l.valorARecibir, c.diasXAnio/ l.nDias) - 1;

                l.id = l.id;
                l.idCartera=l.idCartera
                l.idUsuario=l.idUsuario
                l.fechaDeGiro=l.fechaDeGiro
                l.valorNominal=l.valorNominal
                l.fechaDeDscto=l.fechaDeDscto
                l.nDias=l.nDias
                l.tep=l.tep
                l.d=l.d
                l.descuento=l.descuento
                l.costesIniciales=l.costesIniciales
                l.costesFinales=l.costesFinales
                l.seguro=l.seguro
                l.retencion=l.retencion
                l.valorNeto=l.valorNeto
                l.valorARecibir=l.valorARecibir
                l.flujo=flujo
                l.tcea=tcea;
                l.tipoMoneda=l.tipoMoneda
                this.lS.modificar(l).subscribe();
              }
            }
          })
          
        }
    })
    
    this.lS.list().subscribe((data) => {
      const sortedData = data.sort((a, b) => a.id - b.id);

      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });

    this.lS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    }); 




  }
  eliminar(idLetra: number){
    this.lS.eliminar(idLetra).subscribe(() => {
      this.lS.list().subscribe(data => {
        this.lS.setList(data);
      });
    });
  }
  iralink(comp1:string, comp2:string){
    this.router.navigate(['components/letras/',comp1, comp2]);
  }

  getMonedasTipoTexto(tipo: number): string {
    switch (tipo) {
      case 1:
        return 'Soles (1)';
      case 2:
        return 'Dólares (2)';
      default:
        return `Desconocido (${tipo})`; // Opcional, para valores no definidos
    }
  }
}
