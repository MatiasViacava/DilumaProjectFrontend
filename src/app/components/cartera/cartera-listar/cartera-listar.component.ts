import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Cartera } from 'src/app/models/Cartera';
import { CarteraService } from 'src/app/services/cartera.service';

@Component({
  selector: 'app-cartera-listar',
  templateUrl: './cartera-listar.component.html',
  styleUrls: ['./cartera-listar.component.css']
})
export class CarteraListarComponent {
  dataSource: MatTableDataSource<Cartera> = new MatTableDataSource();
  displayedColumns: string[] =
  ['id', 'fechaDescuento', 'diasXAnio', 'comisionActivacion', 'comisionActivacionTipo', 'fotocopias', 'fotocopiasTipo', 'estudioDeTitulos', 'estudioDeTitulosTipo', 'gastosAdministrativos', 'gastosAdministrativosTipo', 'portes', 'portesTipo', 'seguro', 'seguroTipo', 'retencion', 'retencionTipo', 'teaCompensatoria', 'nDeInstr', 'totalARecibir', 'tceaCartera', 'tipoMoneda','actualizar','eliminar']
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    public route: ActivatedRoute, 
    private router: Router, 
    private tuS: CarteraService) {}

  ngOnInit(): void {
    this.tuS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
    this.tuS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    }); 
  }
  eliminar(idLetra: number){
    this.tuS.eliminar(idLetra).subscribe(() => {
      this.tuS.list().subscribe(data => {
        this.tuS.setList(data);
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
