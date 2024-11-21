import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';
import { TipoUsuario } from 'src/app/models/TiposUsuario';
import { Usuarios } from 'src/app/models/Usuarios';
import { TipoUsuarioService } from 'src/app/services/tipo-usuario.service';
import { UsuariosService } from 'src/app/services/usuario.service';
import { LoginService } from 'src/app/services/login.service';

var bcrypt = require('bcryptjs');

@Component({
  selector: 'app-usuario-creaedita',
  templateUrl: './usuario-creaedita.component.html',
  styleUrls: ['./usuario-creaedita.component.css']
})
export class UsuarioCreaeditaComponent implements OnInit {
  titulo:string = 'Registro de usuario';
  form: FormGroup = new FormGroup({});
  usuarios: Usuarios = new Usuarios();
  tipousuario: TipoUsuario = new TipoUsuario();
  IdUsuarioCreado: number = 0;
  currentpassword:string = "";
  newpassword:string="";

  mensaje: string = '';
  mensaje2: string = '';
  maxFecha: Date = moment().add(-1, 'days').toDate();
  fechanacimiento = new FormControl(new Date());
  
  role:string=""; //NUEVO
  username: string="";
  idUsuario: number = 0;
  edicion: boolean = false;
  constructor(
    private uS: UsuariosService,

    private tuS: TipoUsuarioService,

    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private ls: LoginService

  ) { }

  ngOnInit(): void {
    this.username=this.ls.showUsername();
    this.role=this.ls.showRole();
    
    this.form = this.formBuilder.group({
      id: [''],
      username: ['', Validators.required],
      password: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]]
    });

    this.route.params.subscribe((data: Params) => {
      this.idUsuario = data['id'];
      this.edicion = data['id'] != null;

      if (this.edicion) {this.titulo='Editar usuario'};

      this.init();
    });

  }
  registrar() {

    if (this.form.valid) {
        this.usuarios.id = this.form.value.id,
        this.usuarios.username = this.form.value.username;
        this.usuarios.password = this.form.value.password;
        this.usuarios.nombres = this.form.value.nombres;
        this.usuarios.apellidos = this.form.value.apellidos;
        this.usuarios.correo = this.form.value.correo;
        this.usuarios.telefono = this.form.value.telefono;
        this.usuarios.dni = this.form.value.dni;

        if (this.edicion==false)
        {
          this.encriptarcontraseña(this.form.value.password)
          this.usuarios.password = this.newpassword;
        }
        else {
          console.log(this.currentpassword)
          if (this.currentpassword == this.form.value.password)
          {
            this.usuarios.password = this.form.value.password
          }
          else{
            this.encriptarcontraseña(this.form.value.password)
            this.usuarios.password = this.newpassword;
          }
        }
        
      this.uS.list().subscribe(data2 => {
        let camposunicos: boolean = true;
        for (let u of data2) {
          if (this.form.value.username == u.username && this.form.value.id != u.id) {
            camposunicos = false;
            this.mensaje2 = "El nombre de usuario ya existe"
          }
          if (this.form.value.correo == u.correo && this.form.value.id != u.id) {
            camposunicos = false;
            this.mensaje2 = "El correo ya está asociado con otra cuenta"
          }

          if (this.form.value.telefono == u.telefono && this.form.value.id != u.id) {
            camposunicos = false;
            this.mensaje2 = "El teléfono ya está asociado con otra cuenta"
          }

          if (this.form.value.dni == u.dni && this.form.value.id != u.id) {
            camposunicos = false;
            this.mensaje2 = "El DNI ya está asociado con otra cuenta"
          }
        }

        if (camposunicos) {
          if (this.edicion) {
            this.uS.actualizarusuario(this.usuarios.id,this.usuarios.username,this.usuarios.password,true,
              this.usuarios.nombres, this.usuarios.apellidos, this.usuarios.correo,
              this.usuarios.dni, this.usuarios.telefono).subscribe((data) => {
              this.uS.list().subscribe(data => {
                this.uS.setList(data);
              })
            })
          } else {

            this.uS.insert(this.usuarios).subscribe((data) => {
              this.uS.list().subscribe(data => {
                
                this.uS.setList(data)

                this.uS.ultimousuariocreado().subscribe(data2 => {
                  console.log(data2)
                  this.uS.list().subscribe(data3 => {
                    for (let u of data3) {
                      if (u.username == this.usuarios.username) {

                        //Autogenerar entidades
                        this.tipousuario.nombreTipoUsuario = "CLIENTE"
                        this.tipousuario.usuarios.id = u.id
                        console.log('Se ha creado un tipo de usuario para ' + u.username)
                        this.setIdUsuarioCreado(this.idUsuario);

                        this.tuS.insert(this.tipousuario).subscribe();

                      }
                      
                    }
    
                  })
                })
              })
            })
          }
          if (this.role=='ADMIN' || this.role=='CLIENTE') {this.router.navigate(['/components/usuarios/listar']);}
          else if (this.role!='ADMIN' && this.role!='CLIENTE') {this.router.navigate(['/landingpage']);}

        }
      })
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
        if (control.errors['maxlength']) {
          return `El campo ${controlName} excede el máximo de caracteres permitidos.`;
        }
        if (control.errors['pattern']) {
          return `El campo ${controlName} contiene caracteres no válidos.`;
        }
        if (control.errors['email']) {
          return `El campo ${controlName} no tiene un formato de correo válido.`;
        }
      }
    }
    return "Por favor complete todos los campos obligatorios.";
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
      this.uS.listarId(this.idUsuario).subscribe((data) => {
        this.form = new FormGroup({
          id: new FormControl(data.id),
          username: new FormControl(data.username),
          password: new FormControl(data.password),
          nombres: new FormControl(data.nombres),
          apellidos: new FormControl(data.apellidos),
          correo: new FormControl(data.correo),
          telefono: new FormControl(data.telefono),
          dni: new FormControl(data.dni),
        });

        this.currentpassword=this.form.value.password
        console.log("La contraseña de este usuario está encriptada como: " + this.currentpassword)
      });
    } else {
      this.form = this.formBuilder.group({
        id: [''],
        username: ['', Validators.required],
        password: ['', Validators.required],
        nombres: ['', Validators.required],
        apellidos: ['', Validators.required],
        correo: ['', [Validators.required, Validators.email]],
        telefono: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
        dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]]
      });
    }
  }
  

  setIdUsuarioCreado(id:number){
    this.IdUsuarioCreado=id;
  }

  encriptarcontraseña(pass:string)
  {
    var salt = bcrypt.genSaltSync(10);
    var encriptada:string;
    encriptada = bcrypt.hashSync(pass, salt);
    encriptada = bcrypt.hashSync(pass, salt);
    console.log("La contraseña nueva encriptada es: " + encriptada);
    if (encriptada.includes("/") == false) {this.newpassword=encriptada;}
    else {console.log("La contraseña nueva encriptada tiene /, intentaré de nuevo"); this.encriptarcontraseña(pass);}
  }

}
