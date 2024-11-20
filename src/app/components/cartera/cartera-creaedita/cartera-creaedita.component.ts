import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';
import { Cartera } from 'src/app/models/Cartera';
import { Usuarios } from 'src/app/models/Usuarios';
import { CarteraService } from 'src/app/services/cartera.service';
import { LoginService } from 'src/app/services/login.service';
import { UsuariosService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-cartera-creaedita',
  templateUrl: './cartera-creaedita.component.html',
  styleUrls: ['./cartera-creaedita.component.css']
})
export class CarteraCreaeditaComponent {
  form: FormGroup = new FormGroup({});
  carteras: Cartera = new Cartera();
  mensaje: string = '';
  mensaje2: string = '';

  listaUsuarios: Usuarios[] = [];
  listaCarteras: Cartera[] = [];
  currentrole:string = "";

  id: number = 0;
  edicion: boolean = false;
  titulo:string = "Registro de cartera";

  minFecha: Date = moment().add('days').toDate();
  maxFecha: Date = moment().toDate();
  maxFecha2: Date = moment().add(+1,'days').toDate();

  fecha1:Date = moment().toDate();
  fecha2:Date = moment().toDate();

  tiposdemoneda: { value: number, viewValue: string }[] = [{ value: 1, viewValue: 'Soles (1)' },
    { value: 2, viewValue: 'Dólares (2)'}]

  tipos: { value: number, viewValue: string }[] = [{ value: 1, viewValue: 'Inicio (1)' },
    { value: 2, viewValue: 'Fin (2)'},{ value: 3, viewValue: 'Inicio/Fin (3)'}]
    

  fechasvalidas: boolean = true;

  role:string = '';
  username:string = '';

  constructor(
    private tuS: CarteraService,
    private uS: UsuariosService,
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
      fechaDescuento: [new Date()],
      diasXAnio: [0, [Validators.required, Validators.min(1)]],
      comisionActivacion: [0.0, [Validators.required, Validators.min(0)]],
      comisionActivacionTipo: [0, [Validators.required, Validators.min(0)]],
      fotocopias: [0.0, [Validators.required, Validators.min(0)]],
      fotocopiasTipo: [0, [Validators.required, Validators.min(0)]],
      estudioDeTitulos: [0.0, [Validators.required, Validators.min(0)]],
      estudioDeTitulosTipo: [0, [Validators.required, Validators.min(0)]],
      gastosAdministrativos: [0.0, [Validators.required, Validators.min(0)]],
      gastosAdministrativosTipo: [0, [Validators.required, Validators.min(0)]],
      portes: [0.0, [Validators.required, Validators.min(0)]],
      portesTipo: [0, [Validators.required, Validators.min(0)]],
      seguro: [0.0, [Validators.required, Validators.min(0)]],
      seguroTipo: [0, [Validators.required, Validators.min(0)]],
      retencion: [0.0, [Validators.required, Validators.min(0)]],
      retencionTipo: [0, [Validators.required, Validators.min(0)]],
      teaCompensatoria: [0.0, [Validators.required, Validators.min(0), Validators.max(100)]],
      nDeInstr: [0],
      totalARecibir: [0.0, [Validators.required, Validators.min(0)]],
      tceaCartera: [0.0, [Validators.required, Validators.min(0), Validators.max(100)]],
      tipoMoneda: [1, [Validators.required, Validators.min(0)]]
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id']; //xd
      this.edicion = data['id'] != null;
      if (this.edicion) {
        this.titulo="Editar cartera " + this.id
      }
      this.init();
    });



  }
  registrar() {
    if (this.form.valid) {
      this.carteras.id = this.form.value.id;
      this.carteras.fechaDescuento = this.form.value.fechaDescuento;
      this.carteras.diasXAnio = this.form.value.diasXAnio;
      this.carteras.comisionActivacion = this.form.value.comisionActivacion;
      this.carteras.comisionActivacionTipo = this.form.value.comisionActivacionTipo;
      this.carteras.fotocopias = this.form.value.fotocopias;
      this.carteras.fotocopiasTipo = this.form.value.fotocopiasTipo;
      this.carteras.estudioDeTitulos = this.form.value.estudioDeTitulos;
      this.carteras.estudioDeTitulosTipo = this.form.value.estudioDeTitulosTipo;
      this.carteras.gastosAdministrativos = this.form.value.gastosAdministrativos;
      this.carteras.gastosAdministrativosTipo = this.form.value.gastosAdministrativosTipo;
      this.carteras.portes = this.form.value.portes;
      this.carteras.portesTipo = this.form.value.portesTipo;
      this.carteras.seguro = this.form.value.seguro;
      this.carteras.seguroTipo = this.form.value.seguroTipo;
      this.carteras.retencion = this.form.value.retencion;
      this.carteras.retencionTipo = this.form.value.retencionTipo;
      this.carteras.teaCompensatoria = this.form.value.teaCompensatoria;
      this.carteras.nDeInstr = this.form.value.nDeInstr;
      this.carteras.totalARecibir = this.form.value.totalARecibir;
      this.carteras.tceaCartera = this.form.value.tceaCartera;
      this.carteras.tipoMoneda = this.form.value.tipoMoneda;
     

 
        if (this.edicion) {
          this.tuS.modificar(this.carteras).subscribe((data) => {
            this.tuS.list().subscribe(data => {
              this.tuS.setList(data);
            })
  
            if (this.currentrole!=this.form.value.nombreCartera)
            {
              console.log(this.currentrole);
            }
            
          })
        } else {
          this.tuS.insert(this.carteras).subscribe((data) => {
            this.tuS.list().subscribe(data => {
              this.tuS.setList(data)
            })
          })
        }
        this.router.navigate(['/components/carteras/listar']);

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
     
        this.tuS.listarId(this.id).subscribe((data) => {
          this.form = new FormGroup({
            id: new FormControl(data.id),
            fechaDescuento: new FormControl(data.fechaDescuento),
            diasXAnio: new FormControl(data.diasXAnio),
            comisionActivacion: new FormControl(data.comisionActivacion),
            comisionActivacionTipo: new FormControl(data.comisionActivacionTipo),
            fotocopias: new FormControl(data.fotocopias),
            fotocopiasTipo: new FormControl(data.fotocopiasTipo),
            estudioDeTitulos: new FormControl(data.estudioDeTitulos),
            estudioDeTitulosTipo: new FormControl(data.estudioDeTitulosTipo),
            gastosAdministrativos: new FormControl(data.gastosAdministrativos),
            gastosAdministrativosTipo: new FormControl(data.gastosAdministrativosTipo),
            portes: new FormControl(data.portes),
            portesTipo: new FormControl(data.portesTipo),
            seguro: new FormControl(data.seguro),
            seguroTipo: new FormControl(data.seguroTipo),
            retencion: new FormControl(data.retencion),
            retencionTipo: new FormControl(data.retencionTipo),
            teaCompensatoria: new FormControl(data.teaCompensatoria),
            nDeInstr: new FormControl(data.nDeInstr),
            totalARecibir: new FormControl(data.totalARecibir),
            tceaCartera: new FormControl(data.tceaCartera),
            tipoMoneda: new FormControl(data.tipoMoneda)
         
        });
      
      });
    }}
  }
