import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Cartera } from 'src/app/models/Cartera';
import { CarteraService } from 'src/app/services/cartera.service';
import { LetraService } from 'src/app/services/letra.service';
import { LoginService } from 'src/app/services/login.service';

function calculateTIRNoPer(cashFlows: number[], dates: (Date | string)[], diasXAnio: number): number {
  // Convertir cualquier string a Date
  const convertedDates = dates.map(date => (typeof date === 'string' ? new Date(date) : date));

  const maxIterations = 1000; // Iteraciones máximas para la convergencia
  const tolerance = 1e-7; // Tolerancia para la precisión del cálculo
  const daysInYear = diasXAnio;

  if (cashFlows.length !== convertedDates.length) {
    throw new Error("La cantidad de flujos debe coincidir con la cantidad de fechas.");
  }

  const baseDate = convertedDates[0];
  const days = convertedDates.map(date => (date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));

  function npv(rate: number): number {
    return cashFlows.reduce((sum, flow, i) => sum + flow / Math.pow(1 + rate, days[i] / daysInYear), 0);
  }

  function npvPrime(rate: number): number {
    return cashFlows.reduce(
      (sum, flow, i) =>
        sum - (flow * (days[i] / daysInYear)) / Math.pow(1 + rate, (days[i] / daysInYear) + 1),
      0
    );
  }

  let rate = 0.1;
  for (let i = 0; i < maxIterations; i++) {
    const npvValue = npv(rate);
    const npvDerivative = npvPrime(rate);
    const newRate = rate - npvValue / npvDerivative;

    if (Math.abs(newRate - rate) < tolerance) {
      return newRate;
    }
    rate = newRate;
  }

  throw new Error("No se pudo calcular la TIR.");
}

@Component({
  selector: 'app-cartera-listar',
  templateUrl: './cartera-listar.component.html',
  styleUrls: ['./cartera-listar.component.css']
})
export class CarteraListarComponent {
  dataSource: MatTableDataSource<Cartera> = new MatTableDataSource();
  displayedColumns: string[] =
  ['actualizar','id','tipoMoneda','cambio', 'fechaDescuento', 'diasXAnio', 'comisionActivacion', 'comisionActivacionTipo', 'fotocopias', 'fotocopiasTipo', 'estudioDeTitulos', 'estudioDeTitulosTipo', 'gastosAdministrativos', 'gastosAdministrativosTipo', 'portes', 'portesTipo', 'seguro', 'seguroTipo', 'retencion', 'retencionTipo', 'teaCompensatoria', 'nDeInstr', 'totalARecibir', 'tceaCartera','eliminar']
  
  role:string="";
  username: string="";
  numerotemp:number = 0;
  flujotemp:number = 0.0;
  cashFlows: number[] = [];
  dates: Date[] = [];
  sumaValorRCartera:number=0;
  tempDate: Date=new Date();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    public route: ActivatedRoute, 
    private router: Router, 
    private cS: CarteraService,
    private lS: LetraService,
    private loginService: LoginService) {}

  ngOnInit(): void {


    this.cS.list().subscribe((cartera)=> {
      for (let c of cartera){

        this.lS.list().subscribe((letras)=> {
          this.numerotemp = 0;

          this.sumaValorRCartera = 0;
          this.tempDate;
          this.dates = [];
          this.cashFlows=[]
          for (let l of letras){

            if(c.id==l.idCartera.id){

              this.numerotemp++
              console.log('La cartera ' + c.id + ' posee a la letra ' + l.id)  

              this.cashFlows.push(l.flujo)
              this.dates.push(l.fechaDeDscto)
              this.sumaValorRCartera=this.sumaValorRCartera+l.valorARecibir;
              this.tempDate=c.fechaDescuento;
            }

          }


          this.dates.push(this.tempDate);
          this.cashFlows.push(this.sumaValorRCartera);

          console.log(this.dates)
          console.log(this.cashFlows)
          console.log('RESUMEN: La cartera ' + c.id + ' posee ' + this.numerotemp + ' letras.')  


          c.id=c.id,
          c.fechaDescuento=c.fechaDescuento;
          c.diasXAnio=c.diasXAnio
          c.comisionActivacion=c.comisionActivacion
          c.comisionActivacionTipo=c.comisionActivacionTipo
          c.fotocopias=c.fotocopias
          c.fotocopiasTipo=c.fotocopiasTipo
          c.estudioDeTitulos=c.estudioDeTitulos
          c.estudioDeTitulosTipo=c.estudioDeTitulosTipo
          c.gastosAdministrativos=c.gastosAdministrativos
          c.gastosAdministrativosTipo=c.gastosAdministrativosTipo
          c.portes=c.portes
          c.portesTipo=c.portesTipo
          c.seguro=c.seguro
          c.seguroTipo=c.seguroTipo
          c.retencion=c.retencion
          c.retencionTipo=c.retencionTipo
          c.teaCompensatoria=c.teaCompensatoria
          c.nDeInstr=this.numerotemp
          c.totalARecibir=c.totalARecibir
          c.tceaCartera=calculateTIRNoPer(this.cashFlows,this.dates,c.diasXAnio)
          c.tipoMoneda=c.tipoMoneda
          c.cambio=c.cambio;
          this.cS.modificar(c).subscribe();

          console.log('RESUMEN TCEA: El TCEA de la cartera ' + c.id + ' es ' + calculateTIRNoPer(this.cashFlows,this.dates,c.diasXAnio))

        })
      }})

      this.cS.list().subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      });

    this.cS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
   
    }); 
  }
  eliminar(idLetra: number){
    this.cS.eliminar(idLetra).subscribe(() => {
      this.cS.list().subscribe(data => {
        this.cS.setList(data);
      });
    });
  }
  iralink(comp1:string, comp2:string){
    this.router.navigate(['components/carteras/',comp1, comp2]);
  }

  getTiposTexto(tipo: number): string {
    switch (tipo) {
      case 1:
        return 'Inicio (1)';
      case 2:
        return 'Fin (2)';
      case 3:
        return 'Inicio/Fin (3)';
      default:
        return `Desconocido (${tipo})`; // Opcional, para valores no definidos
    }
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
