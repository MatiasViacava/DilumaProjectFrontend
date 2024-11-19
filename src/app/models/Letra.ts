import { Cartera } from "./Cartera"
import { Usuarios } from "./Usuarios"

export class Letra{
    id:number=0
    idCartera:Cartera = new Cartera()
    idUsuario:Usuarios = new Usuarios()
    fechaDeGiro:Date=new Date(Date.now())
    valorNominal:number = 0.0
    fechaDeDscto:Date=new Date(Date.now())
    nDias:number = 0
    tep:number = 0.0
    d:number = 0.0
    descuento:number = 0.0
    costesIniciales:number= 0.0
    costesFinales:number= 0.0
    seguro:number= 0.0
    retencion:number= 0.0
    valorNeto:number = 0.0
    valorARecibir:number= 0.0
    flujo:number= 0.0
    tcea:number = 0.0
    tipoMoneda:number = 0
}