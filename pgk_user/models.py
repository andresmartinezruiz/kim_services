# -*- coding: utf-8 -*-

from django.db.models import Q
from django.contrib.postgres.fields import JSONField
from django.db import models
from django.conf import settings
from django.contrib.auth.models import User

import os
import json
import base64
import datetime

# Create your models here.

class Puestos(models.Model):
    puesto = models.CharField(max_length=80, unique=True)
    cargado_010 = models.BooleanField(default=False)
    cargado_010_por = models.CharField(max_length=120, null=True, blank=True)
    cargado_010_por_id = models.IntegerField( null=True, blank=True)
    cargado_010_por_gecos = models.CharField(max_length=120, null=True, blank=True, verbose_name='CARGADO POR')
    cargado_010_fecha = models.DateField(null=True, blank=True, verbose_name='CARGADO FECHA')
    cargado_010_hora = models.TimeField(null=True, blank=True, verbose_name='CARGADO HORA')
    cargado_010_motivo = models.CharField(max_length=120, null=True, blank=True)
    anulado_040 = models.BooleanField(default=False)
    anulado_040_por = models.CharField(max_length=120, null=True, blank=True)
    anulado_040_por_id = models.IntegerField( null=True, blank=True)
    anulado_040_por_gecos = models.CharField(max_length=120, null=True, blank=True)
    anulado_040_fecha = models.DateField(null=True, blank=True)
    anulado_040_hora = models.TimeField(null=True, blank=True)
    anulado_040_motivo = models.CharField(max_length=120, null=True, blank=True)
    verificado_045 = models.BooleanField(default=False)
    verificado_045_por = models.CharField(max_length=120, null=True, blank=True)
    verificado_045_por_id = models.IntegerField( null=True, blank=True)
    verificado_045_por_gecos = models.CharField(max_length=120, null=True, blank=True)
    verificado_045_fecha = models.DateField(null=True, blank=True)
    verificado_045_hora = models.TimeField(null=True, blank=True)
    verificado_045_motivo = models.CharField(max_length=120, null=True, blank=True)
    aprobado_050 = models.BooleanField(default=False)
    aprobado_050_por = models.CharField(max_length=120, null=True, blank=True)
    aprobado_050_por_id = models.IntegerField( null=True, blank=True)
    aprobado_050_por_gecos = models.CharField(max_length=120, null=True, blank=True)
    aprobado_050_fecha = models.DateField(null=True, blank=True)
    aprobado_050_hora = models.TimeField(null=True, blank=True)
    aprobado_050_motivo = models.CharField(max_length=120, null=True, blank=True)
    procesado_060 = models.BooleanField(default=False)
    procesado_060_por = models.CharField(max_length=120, null=True, blank=True)
    procesado_060_por_id = models.IntegerField( null=True, blank=True)
    procesado_060_por_gecos = models.CharField(max_length=120, null=True, blank=True)
    procesado_060_fecha = models.DateField(null=True, blank=True)
    procesado_060_hora = models.TimeField(null=True, blank=True)
    procesado_060_motivo = models.CharField(max_length=120, null=True, blank=True)

    def __unicode__(self):
        return self.puesto

class AreaTrabajo(models.Model):
    areatrabajo = models.CharField(max_length=80, unique=True)
    cargado_010 = models.BooleanField(default=False)
    cargado_010_por = models.CharField(max_length=120, null=True, blank=True)
    cargado_010_por_id = models.IntegerField( null=True, blank=True)
    cargado_010_por_gecos = models.CharField(max_length=120, null=True, blank=True, verbose_name='CARGADO POR')
    cargado_010_fecha = models.DateField(null=True, blank=True, verbose_name='CARGADO FECHA')
    cargado_010_hora = models.TimeField(null=True, blank=True, verbose_name='CARGADO HORA')
    cargado_010_motivo = models.CharField(max_length=120, null=True, blank=True)
    anulado_040 = models.BooleanField(default=False)
    anulado_040_por = models.CharField(max_length=120, null=True, blank=True)
    anulado_040_por_id = models.IntegerField( null=True, blank=True)
    anulado_040_por_gecos = models.CharField(max_length=120, null=True, blank=True)
    anulado_040_fecha = models.DateField(null=True, blank=True)
    anulado_040_hora = models.TimeField(null=True, blank=True)
    anulado_040_motivo = models.CharField(max_length=120, null=True, blank=True)
    verificado_045 = models.BooleanField(default=False)
    verificado_045_por = models.CharField(max_length=120, null=True, blank=True)
    verificado_045_por_id = models.IntegerField( null=True, blank=True)
    verificado_045_por_gecos = models.CharField(max_length=120, null=True, blank=True)
    verificado_045_fecha = models.DateField(null=True, blank=True)
    verificado_045_hora = models.TimeField(null=True, blank=True)
    verificado_045_motivo = models.CharField(max_length=120, null=True, blank=True)
    aprobado_050 = models.BooleanField(default=False)
    aprobado_050_por = models.CharField(max_length=120, null=True, blank=True)
    aprobado_050_por_id = models.IntegerField( null=True, blank=True)
    aprobado_050_por_gecos = models.CharField(max_length=120, null=True, blank=True)
    aprobado_050_fecha = models.DateField(null=True, blank=True)
    aprobado_050_hora = models.TimeField(null=True, blank=True)
    aprobado_050_motivo = models.CharField(max_length=120, null=True, blank=True)
    procesado_060 = models.BooleanField(default=False)
    procesado_060_por = models.CharField(max_length=120, null=True, blank=True)
    procesado_060_por_id = models.IntegerField( null=True, blank=True)
    procesado_060_por_gecos = models.CharField(max_length=120, null=True, blank=True)
    procesado_060_fecha = models.DateField(null=True, blank=True)
    procesado_060_hora = models.TimeField(null=True, blank=True)
    procesado_060_motivo = models.CharField(max_length=120, null=True, blank=True)

    def __unicode__(self):
        return self.areatrabajo

class PuestoAreaTrabajo(models.Model):
    puestoobj = models.ForeignKey(Puestos,on_delete=models.CASCADE)
    areatrabajoobj = models.ForeignKey(AreaTrabajo,on_delete=models.CASCADE)
    accessrole = JSONField(null=True, blank=True)
    cargado_010 = models.BooleanField(default=False)
    cargado_010_por = models.CharField(max_length=120, null=True, blank=True)
    cargado_010_por_id = models.IntegerField( null=True, blank=True)
    cargado_010_por_gecos = models.CharField(max_length=120, null=True, blank=True, verbose_name='CARGADO POR')
    cargado_010_fecha = models.DateField(null=True, blank=True, verbose_name='CARGADO FECHA')
    cargado_010_hora = models.TimeField(null=True, blank=True, verbose_name='CARGADO HORA')
    cargado_010_motivo = models.CharField(max_length=120, null=True, blank=True)
    anulado_040 = models.BooleanField(default=False)
    anulado_040_por = models.CharField(max_length=120, null=True, blank=True)
    anulado_040_por_id = models.IntegerField( null=True, blank=True)
    anulado_040_por_gecos = models.CharField(max_length=120, null=True, blank=True)
    anulado_040_fecha = models.DateField(null=True, blank=True)
    anulado_040_hora = models.TimeField(null=True, blank=True)
    anulado_040_motivo = models.CharField(max_length=120, null=True, blank=True)
    verificado_045 = models.BooleanField(default=False)
    verificado_045_por = models.CharField(max_length=120, null=True, blank=True)
    verificado_045_por_id = models.IntegerField( null=True, blank=True)
    verificado_045_por_gecos = models.CharField(max_length=120, null=True, blank=True)
    verificado_045_fecha = models.DateField(null=True, blank=True)
    verificado_045_hora = models.TimeField(null=True, blank=True)
    verificado_045_motivo = models.CharField(max_length=120, null=True, blank=True)
    aprobado_050 = models.BooleanField(default=False)
    aprobado_050_por = models.CharField(max_length=120, null=True, blank=True)
    aprobado_050_por_id = models.IntegerField( null=True, blank=True)
    aprobado_050_por_gecos = models.CharField(max_length=120, null=True, blank=True)
    aprobado_050_fecha = models.DateField(null=True, blank=True)
    aprobado_050_hora = models.TimeField(null=True, blank=True)
    aprobado_050_motivo = models.CharField(max_length=120, null=True, blank=True)
    procesado_060 = models.BooleanField(default=False)
    procesado_060_por = models.CharField(max_length=120, null=True, blank=True)
    procesado_060_por_id = models.IntegerField( null=True, blank=True)
    procesado_060_por_gecos = models.CharField(max_length=120, null=True, blank=True)
    procesado_060_fecha = models.DateField(null=True, blank=True)
    procesado_060_hora = models.TimeField(null=True, blank=True)
    procesado_060_motivo = models.CharField(max_length=120, null=True, blank=True)

    def __unicode__(self):
        return '%s - %s' % (self.puestoobj.puesto, self.areatrabajoobj.areatrabajo)

    class Meta:
        unique_together = ('puestoobj', 'areatrabajoobj')

class UserProfile(models.Model):
    empresa = models.CharField(max_length=60, default='IBO')
    work_empresa = JSONField(default=['IBO'])
    userobj = models.OneToOneField(User, verbose_name='USUARIO', on_delete=models.PROTECT)
    tipo_bodeguero = models.CharField(max_length=15, null=True, default='LLEVA')
    #photo = models.ImageField(upload_to='dashboard/profiles/', max_length=260, null=True, verbose_name='FOTO', help_text='Foto Perfil')
    #photo_web = models.BooleanField(default=False)
    bloqueo_exento = models.BooleanField(default=False)
    bloqueo = models.BooleanField(default=False)
    desbloqueo_fecha = models.DateField(null=True)
    ea_teamleader = models.BooleanField(default=False)
    ea_grupo = models.CharField(max_length=60, default='ND')
    #backphoto = models.ImageField(upload_to='dashboard/profiles/', max_length=260, null=True, verbose_name='FOTO')
    clientecod = models.CharField(max_length=15, blank=True, null=True)
    supervisor_ventas = models.CharField(max_length=30, null=True,blank=True)
    vendedor_listas = JSONField(null=True, blank=True)
    puestoareatrabajoobj = models.ForeignKey(PuestoAreaTrabajo, verbose_name='PUESTO AREA',on_delete=models.CASCADE)
    cedula = models.CharField(max_length=40, null=True, blank=True, verbose_name='CEDULA')
    celular = models.CharField(max_length=150, blank=True, verbose_name='CELULAR')
    geoposicion = models.CharField(max_length=150)
    imei = models.CharField(max_length=300, blank=True, verbose_name='IMEI')
    device_id = models.CharField(max_length=300, default='ND')
    wlc = models.CharField(max_length=200, null=True, blank=True)
    codigo_operador = models.CharField(max_length=20, null=True, blank=True, verbose_name='CODIGO OPERADOR')
    ldap_uidnumber = models.BigIntegerField(null=True, blank=True)
    correo = models.EmailField(default='nomail@rkf.com.py')
    cclara = models.CharField(max_length=30, default='n/a')
    last_changepassword = models.DateTimeField(null=True)
    aprobadofechahora =  models.CharField(max_length=50, null=True, blank=True)
    aprobadopor =  models.CharField(max_length=50, null=True, blank=True)
    area_rrhh =  models.CharField(max_length=50, null=True, blank=True)
    cadenaid =  models.IntegerField(null=True, blank=True)
    cargadofechahora =  models.CharField(max_length=50, null=True, blank=True)
    cargadopor =  models.CharField(max_length=50, null=True, blank=True)
    cargo_rrhh =  models.CharField(max_length=50, null=True, blank=True)
    clienteid =  models.IntegerField(null=True, blank=True)
    cliente_porcentajeretencion = models.DecimalField(max_digits=19, decimal_places=6, null=True, blank=True)
    cliente_retenerdesde =  models.DecimalField(max_digits=19, decimal_places=6, null=True, blank=True)
    comentarios =  models.TextField(max_length=50, null=True, blank=True)
    nombrefactura = models.CharField(max_length=120, null=True, blank=True)
    nombrefantasia = models.CharField(max_length=120, null=True, blank=True)
    proveedorconvale =  models.BooleanField(default=False),
    proveedorivaenotrocheque = models.DecimalField(max_digits=19, decimal_places=6, null=True, blank=True)
    proveedortipogasto = models.BooleanField(default=False)
    ramonegocioid =  models.BooleanField(default=False)
    ruc = models.CharField(max_length=80, null=True, blank=True)
    razonsocial =  models.CharField(max_length=80, null=True, blank=True)
    regimenturismo = models.BooleanField(default=False)
    rucdv =  models.IntegerField( null=True, blank=True)
    varios1 =  models.CharField(max_length=80, null=True, blank=True)
    varios2 =  models.CharField(max_length=80, null=True, blank=True)
    varios3 =  models.CharField(max_length=80, null=True, blank=True)
    varios4 =  models.CharField(max_length=80, null=True, blank=True)
    varios5 = models.CharField(max_length=80, null=True, blank=True)
    verificadofechahora = models.CharField(max_length=80, null=True, blank=True)
    verificadopor = models.CharField(max_length=80, null=True, blank=True)
    escliente =  models.BooleanField(default=False)
    esclienteactivo =  models.BooleanField(default=False)
    escontacto = models.BooleanField(default=False)
    espersonal = models.BooleanField(default=False)
    espersonalactivo =  models.BooleanField(default=False)
    esproveedor = models.BooleanField(default=False)
    esproveedoractivo = models.BooleanField(default=False)
    esproveedormercaderia = models.BooleanField(default=False)
    area =  models.CharField(max_length=80, null=True, blank=True)
    categoria = models.CharField(max_length=80, null=True, blank=True)
    celularempresa = models.CharField(max_length=80, null=True, blank=True)
    centrocostoid = models.CharField(max_length=80, null=True, blank=True)
    codigoempleadoanterior = models.CharField(max_length=80, null=True, blank=True)
    conbonificacion = models.BooleanField(default=False)
    ctabancaria = models.CharField(max_length=80, null=True, blank=True)
    d_usu = models.CharField(max_length=80, null=True, blank=True)
    departamento = models.CharField(max_length=80, null=True, blank=True)
    documentoidentidad = models.CharField(max_length=80, null=True, blank=True)
    documentoidentidaddv = models.IntegerField( null=True, blank=True)
    empleadoid = models.IntegerField( null=True, blank=True)
    escalasalarial = models.CharField(max_length=80, null=True, blank=True)
    estado = models.CharField(max_length=80, null=True, blank=True)
    estadocivil = models.CharField(max_length=80, null=True, blank=True)
    fechaips = models.CharField(max_length=80, null=True, blank=True)
    fechaingreso = models.DateTimeField(max_length=80, null=True, blank=True)
    fechanacimiento = models.CharField(max_length=80, null=True, blank=True)
    fecharetiro = models.CharField(max_length=80, null=True, blank=True)
    formacobro = models.CharField(max_length=80, null=True, blank=True)
    horario = models.CharField(max_length=80, null=True, blank=True)
    calendario = JSONField(default={})
    entrada = models.DateTimeField(null=True)
    inactivofechahora = models.CharField(max_length=80, null=True, blank=True)
    ldapinactivofechahora = models.CharField(max_length=80, null=True, blank=True)
    ldapinactivooperador = models.CharField(max_length=80, null=True, blank=True)
    lugarnacimiento = models.CharField(max_length=80, null=True, blank=True)
    marcaasistencia = models.BooleanField(default=False)
    motivoretiro = models.CharField(max_length=80, null=True, blank=True)
    nacionalidad = models.CharField(max_length=80, null=True, blank=True)
    nivelacademico = models.CharField(max_length=80, null=True, blank=True)
    nrobaja = models.CharField(max_length=80, null=True, blank=True)
    nroips = models.CharField(max_length=80, null=True, blank=True)
    nrolicenciaconducir = models.CharField(max_length=80, null=True, blank=True)
    nrooperadoranterior = models.CharField(max_length=80, null=True, blank=True)
    poseeterreno = models.CharField(max_length=80, null=True, blank=True)
    poseevehiculo = models.CharField(max_length=80, null=True, blank=True)
    poseevivienda = models.CharField(max_length=80, null=True, blank=True)
    profesion = models.CharField(max_length=80, null=True, blank=True)
    puesto = models.CharField(max_length=80, null=True, blank=True)
    role = models.CharField(max_length=80, null=True, blank=True)
    sexo = models.CharField(max_length=80, null=True, blank=True)
    sue_legajoid = models.IntegerField( null=True, blank=True)
    tipoempleado = models.CharField(max_length=80, null=True, blank=True)
    tipolicenciaconducir = models.CharField(max_length=80, null=True, blank=True)
    tipomarcacion = models.CharField(max_length=80, null=True, blank=True)
    tipousuario = models.CharField(max_length=80, null=True, blank=True)
    aprobador = models.BooleanField(default=False)
    permisos = JSONField(null=True, blank=True)
    equipo = JSONField(null=True, blank=True)
    hide_ui = JSONField(null=True, blank=True)
    network = JSONField(default=[])
    internet_finger = JSONField(default=[])
    menu = JSONField(default={})
    impresora = JSONField(default=[])
    emails = JSONField(default=[])
    gpolicies = JSONField(default={})
    onesignaltoken = JSONField(default={})
    api_calls = JSONField(default=[])
    responsable_operacion = JSONField(default=[])
    superior_cargo = JSONField(default=[])
    personal_cargo = JSONField(default=[])
    cargado_010 = models.BooleanField(default=False)
    cargado_010_por = models.CharField(max_length=120, null=True, blank=True)
    cargado_010_por_id = models.IntegerField( null=True, blank=True)
    cargado_010_por_gecos = models.CharField(max_length=120, null=True, blank=True, verbose_name='CARGADO POR')
    cargado_010_fecha = models.DateField(null=True, blank=True, verbose_name='CARGADO FECHA')
    cargado_010_hora = models.TimeField(null=True, blank=True, verbose_name='CARGADO HORA')
    cargado_010_motivo = models.CharField(max_length=120, null=True, blank=True)
    libre_011 = models.BooleanField(default=True)
    libre_011_por = models.CharField(max_length=120, null=True, blank=True)
    libre_011_por_id = models.IntegerField( null=True, blank=True)
    libre_011_por_gecos = models.CharField(max_length=120, null=True, blank=True)
    libre_011_fecha = models.DateField(null=True, blank=True)
    libre_011_hora = models.TimeField(null=True, blank=True)
    libre_011_motivo = models.CharField(max_length=120, null=True, blank=True)
    anulado_040 = models.BooleanField(default=False)
    anulado_040_por = models.CharField(max_length=120, null=True, blank=True)
    anulado_040_por_id = models.IntegerField( null=True, blank=True)
    anulado_040_por_gecos = models.CharField(max_length=120, null=True, blank=True)
    anulado_040_fecha = models.DateField(null=True, blank=True)
    anulado_040_hora = models.TimeField(null=True, blank=True)
    anulado_040_motivo = models.CharField(max_length=120, null=True, blank=True)
    verificado_045 = models.BooleanField(default=False)
    verificado_045_por = models.CharField(max_length=120, null=True, blank=True)
    verificado_045_por_id = models.IntegerField( null=True, blank=True)
    verificado_045_por_gecos = models.CharField(max_length=120, null=True, blank=True)
    verificado_045_fecha = models.DateField(null=True, blank=True)
    verificado_045_hora = models.TimeField(null=True, blank=True)
    verificado_045_motivo = models.CharField(max_length=120, null=True, blank=True)
    aprobado_050 = models.BooleanField(default=False)
    aprobado_050_por = models.CharField(max_length=120, null=True, blank=True)
    aprobado_050_por_id = models.IntegerField( null=True, blank=True)
    aprobado_050_por_gecos = models.CharField(max_length=120, null=True, blank=True)
    aprobado_050_fecha = models.DateField(null=True, blank=True)
    aprobado_050_hora = models.TimeField(null=True, blank=True)
    aprobado_050_motivo = models.CharField(max_length=120, null=True, blank=True)
    procesado_060 = models.BooleanField(default=False)
    procesado_060_por = models.CharField(max_length=120, null=True, blank=True)
    procesado_060_por_id = models.IntegerField( null=True, blank=True)
    procesado_060_por_gecos = models.CharField(max_length=120, null=True, blank=True)
    procesado_060_fecha = models.DateField(null=True, blank=True)
    procesado_060_hora = models.TimeField(null=True, blank=True)
    procesado_060_motivo = models.CharField(max_length=120, null=True, blank=True)
