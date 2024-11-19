import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';
import { Cartera } from 'src/app/models/Cartera';
import { Letra } from 'src/app/models/Letra';
import { Usuarios } from 'src/app/models/Usuarios';
import { LetraService } from 'src/app/services/letra.service';
import { UsuariosService } from 'src/app/services/usuario.service';
import { ValidationErrors, ValidatorFn } from '@angular/forms';
import { CarteraService } from 'src/app/services/cartera.service';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-letra-creaedita',
  templateUrl: './letra-creaedita.component.html',
  styleUrls: ['./letra-creaedita.component.css']
})
export class LetraCreaeditaComponent {
  form: FormGroup = new FormGroup({});
  letras: Letra = new Letra();
  mensaje: string = '';
  mensaje2: string = '';

  listaUsuarios: Usuarios[] = [];
  listaCarteras: Cartera[] = [];
  currentrole:string = "";

  id: number = 0;
  edicion: boolean = false;
  titulo:string = "Registro de letra";

  minFecha: Date = moment().add('days').toDate();
  maxFecha: Date = moment().toDate();
  maxFecha2: Date = moment().add(+1,'days').toDate();

  fecha1:Date = moment().toDate();
  fecha2:Date = moment().toDate();

  fechasvalidas: boolean = true;

  role:string = '';
  username:string = '';

  tiposdemoneda: { value: number, viewValue: string }[] = [{ value: 1, viewValue: 'Soles (1)' },
    { value: 2, viewValue: 'Dólares (2)'}]

  constructor(
    private tuS: LetraService,
    private uS: UsuariosService,
    private cS: CarteraService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private loginService: LoginService
  ) { }
  ngOnInit(): void {
    this.role=this.loginService.showRole();
    this.username=this.loginService.showUsername();

    const manana = new Date();
    manana.setDate(manana.getDate() + 1);

    this.form = this.formBuilder.group({
      id: [''],
      idCartera: ['', [Validators.required]], 
      idUsuario: ['', [Validators.required]], 
      fechaDeGiro: [new Date()], 
      valorNominal: [0.0, [Validators.required, Validators.min(0)]], 
      fechaDeDscto: [manana], 
      nDias: [0, [Validators.required, Validators.min(0)]],
      tep: [0.0, [Validators.required, Validators.min(0), Validators.max(100)]],
      d: [0.0, [Validators.required, Validators.min(0)]],
      descuento: [0.0, [Validators.required, Validators.min(0)]], 
      costesIniciales: [0.0, [Validators.required, Validators.min(0)]], 
      costesFinales: [0.0, [Validators.required, Validators.min(0)]], 
      seguro: [0.0, [Validators.required, Validators.min(0)]], 
      retencion: [0.0, [Validators.required, Validators.min(0)]], 
      valorNeto: [0.0, [Validators.required, Validators.min(0)]], 
      valorARecibir: [0.0, [Validators.required, Validators.min(0)]], 
      flujo: [0.0, [Validators.required, Validators.min(0)]],
      tcea: [0.0, [Validators.required, Validators.min(0), Validators.max(100)]],
      tipoMoneda: [0, [Validators.required, Validators.min(0)]],
    });

    this.uS.list().subscribe(data => { this.listaUsuarios = data });

    this.cS.list().subscribe(data => { this.listaCarteras = data });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id']; //xd
      this.edicion = data['id'] != null;
      if (this.edicion) {
        this.titulo="Editar letra"
      }
      this.init();
    });



  }
  registrar() {
    if (this.form.valid) {
      this.letras.id = this.form.value.id;
      this.letras.idCartera.id = this.form.value.idCartera;
      this.letras.idUsuario.id = this.form.value.idUsuario;
      this.letras.fechaDeGiro = this.form.value.fechaDeGiro;
      this.letras.valorNominal = this.form.value.valorNominal;
      this.letras.fechaDeDscto = this.form.value.fechaDeDscto;
      this.letras.nDias = this.form.value.nDias;
      this.letras.tep = this.form.value.tep;
      this.letras.d = this.form.value.d;
      this.letras.descuento = this.form.value.descuento;
      this.letras.costesIniciales = this.form.value.costesIniciales;
      this.letras.costesFinales = this.form.value.costesFinales;
      this.letras.seguro = this.form.value.seguro;
      this.letras.retencion = this.form.value.retencion;
      this.letras.valorNeto = this.form.value.valorNeto;
      this.letras.valorARecibir = this.form.value.valorARecibir;
      this.letras.flujo = this.form.value.flujo;
      this.letras.tcea = this.form.value.tcea;
      this.letras.tipoMoneda = this.form.value.tipoMoneda;

      this.fechasvalidas = true;

      if (this.letras.fechaDeGiro > this.letras.fechaDeDscto) {
        this.mensaje2 = 'La fecha de Giro no puede ser mayor que la fecha de Dscto' ;
        this.fechasvalidas = false;
      }
  
      if (this.letras.fechaDeDscto < this.letras.fechaDeGiro) {
        this.mensaje2 = 'La fecha de Dscto no puede ser menor que la fecha de Giro' ;
        this.fechasvalidas = false;
      }

      if (this.fechasvalidas)
      {
        if (this.edicion) {
          this.tuS.modificar(this.letras).subscribe((data) => {
            this.tuS.list().subscribe(data => {
              this.tuS.setList(data);
            })
  
            if (this.currentrole!=this.form.value.nombreLetra)
            {
              console.log(this.currentrole);
            }
            
          })
        } else {
          this.tuS.insert(this.letras).subscribe((data) => {
            this.tuS.list().subscribe(data => {
              this.tuS.setList(data)
            })
          })
        }
        this.router.navigate(['/components/letras/listar']);
      }

    } else {
      this.mensaje = this.obtenerMensajesDeError();
    }
  }

  obtenerMensajesDeError(): string {
    for (const controlName in this.form.controls) {
      const control = this.form.get(controlName);
      
      if (control?.errors) {
        if (control.errors['required']) {
          return `El campo ${controlName} es obligatorio.`;
        }
        if (control.errors['min']) {
          return `El campo ${controlName} debe ser mayor o igual a ${control.errors['min'].min}.`;
        }
        if (control.errors['max']) {
          return `El campo ${controlName} debe ser menor o igual a ${control.errors['max'].max}.`;
        }
        if (control.errors['pattern']) {
          return `El campo ${controlName} tiene un formato inválido.`;
        }
        if (control.errors['fechasInvalidas']) {
          return control.errors['fechasInvalidas']; // Validador personalizado para fechas
        }
      }
    }
    return "Complete todos los campos.";
  }

  obtenerControlCampo(nombreCampo: string): AbstractControl {
    const control = this.form.get(nombreCampo);
    if (!control) {
      throw new Error(`Control no encontrado para el campo ${nombreCampo}`);
    }
    return control;
  }

  init() {
    if (this.edicion) {
     
        this.tuS.listarId(this.id).subscribe((data2) => {
          this.form = new FormGroup({
          id: new FormControl(data2.id),
          idCartera: new FormControl(data2.idCartera.id),
          idUsuario: new FormControl(data2.idUsuario.id), 
          fechaDeGiro: new FormControl(data2.fechaDeGiro),
          valorNominal: new FormControl(data2.valorNominal),
          fechaDeDscto: new FormControl(data2.fechaDeDscto),
          nDias: new FormControl(data2.nDias),
          tep: new FormControl(data2.tep),
          d: new FormControl(data2.d),
          descuento: new FormControl(data2.descuento),
          costesIniciales: new FormControl(data2.costesIniciales),
          costesFinales: new FormControl(data2.costesFinales),
          seguro: new FormControl(data2.seguro),
          retencion: new FormControl(data2.retencion),
          valorNeto: new FormControl(data2.valorNeto),
          valorARecibir: new FormControl(data2.valorARecibir),
          flujo: new FormControl(data2.flujo),
          tcea: new FormControl(data2.tcea),
          tipoMoneda: new FormControl(data2.tipoMoneda)
        });
      
      });
    }
  }

  
}

