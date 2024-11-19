import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Letra } from 'src/app/models/Letra';
import { LetraService } from 'src/app/services/letra.service';

@Component({
  selector: 'app-letra-listar',
  templateUrl: './letra-listar.component.html',
  styleUrls: ['./letra-listar.component.css']
})
export class LetraListarComponent {
  dataSource: MatTableDataSource<Letra> = new MatTableDataSource();
  displayedColumns: string[] =
  ['id', 'idCartera', 'idUsuario', 'fechaDeGiro', 'valorNominal', 'fechaDeDscto', 'nDias', 'tep', 'd', 'descuento', 'costesIniciales', 'costesFinales', 'seguro', 'retencion', 'valorNeto', 'valorARecibir', 'flujo', 'tcea', 'tipoMoneda','actualizar','eliminar']
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    public route: ActivatedRoute, 
    private router: Router, 
    private tuS: LetraService) {}

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
