import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoUsuario } from 'src/app/models/TiposUsuario';
import { TipoUsuarioService } from 'src/app/services/tipo-usuario.service';

@Component({
  selector: 'app-tipo-usuario-listar',
  templateUrl: './tipo-usuario-listar.component.html',
  styleUrls: ['./tipo-usuario-listar.component.css']
})
export class TipoUsuarioListarComponent {
  dataSource: MatTableDataSource<TipoUsuario> = new MatTableDataSource();
  displayedColumns: string[] =
  ['codigo', 'nombre','usuario_id','actualizar','eliminar']
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    public route: ActivatedRoute, 
    private router: Router, 
    private tuS: TipoUsuarioService) {}

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
  eliminar(idTipoUsuario: number){
    this.tuS.eliminar(idTipoUsuario).subscribe(() => {
      this.tuS.list().subscribe(data => {
        this.tuS.setList(data);
      });
    });
  }
  iralink(comp1:string, comp2:string){
    this.router.navigate(['components/tipousuario/',comp1, comp2]);
  }
}
