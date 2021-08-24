# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib.postgres.fields import JSONField
from django.conf import settings
import base64
import datetime
from django.db import models
from django.db.models import Q


from pgk_const.models import Barrio
from pgk_master.models import Hogar
from pgk_user.models import UserProfile


# Create your models here.
class OperadoraServicio(models.Model):
    nombre = models.CharField(max_length=50)
    cargado_010 = models.BooleanField(default=False)
    cargado_010_por_gecos = models.CharField(max_length=100, null=True)
    cargado_010_fecha = models.DateTimeField(null=True, blank=True)
    anulado_040 = models.BooleanField(default=False)
    anulado_040_por_gecos = models.CharField(max_length=100, null=True)
    anulado_040_fecha = models.DateTimeField(null=True, blank=True)
    aprobado_050 = models.BooleanField(default=False)
    aprobado_050_por_gecos = models.CharField(max_length=100, null=True)
    aprobado_050_fecha = models.DateTimeField(null=True, blank=True)
 
class Sintonia(models.Model):
    operadoraobj = models.ForeignKey(OperadoraServicio, blank=True, null=True, on_delete=models.CASCADE)
    canal = models.CharField(max_length=100, null=True)
    numero = models.IntegerField()
    cargado_010 = models.BooleanField(default=False)
    cargado_010_por_gecos = models.CharField(max_length=100, null=True)
    cargado_010_fecha = models.DateTimeField(null=True, blank=True)
    anulado_040 = models.BooleanField(default=False)
    anulado_040_por_gecos = models.CharField(max_length=100, null=True)
    anulado_040_fecha = models.DateTimeField(null=True, blank=True)
    aprobado_050 = models.BooleanField(default=False)
    aprobado_050_por_gecos = models.CharField(max_length=100, null=True)
    aprobado_050_fecha = models.DateTimeField(null=True, blank=True)
 
 
class Canales(models.Model):
    nombre = models.CharField(max_length=50)
    cargado_010 = models.BooleanField(default=False)
    cargado_010_por_gecos = models.CharField(max_length=100, null=True)
    cargado_010_fecha = models.DateTimeField(null=True, blank=True)
    anulado_040 = models.BooleanField(default=False)
    anulado_040_por_gecos = models.CharField(max_length=100, null=True)
    anulado_040_fecha = models.DateTimeField(null=True, blank=True)
    aprobado_050 = models.BooleanField(default=False)
    aprobado_050_por_gecos = models.CharField(max_length=100, null=True)
    aprobado_050_fecha = models.DateTimeField(null=True, blank=True)

class Meter(models.Model):
    nombre = models.CharField(max_length=50)
    nro_serie = models.CharField(max_length=50)
    tipo = models.TextField(max_length=100)
    cargado_010 = models.BooleanField(default=False)
    cargado_010_por_gecos = models.CharField(max_length=100, null=True)
    cargado_010_fecha = models.DateTimeField(null=True, blank=True)
    anulado_040 = models.BooleanField(default=False)
    anulado_040_por_gecos = models.CharField(max_length=100, null=True)
    anulado_040_fecha = models.DateTimeField(null=True, blank=True)
    aprobado_050 = models.BooleanField(default=False)
    aprobado_050_por_gecos = models.CharField(max_length=100, null=True)
    aprobado_050_fecha = models.DateTimeField(null=True, blank=True)

class Televisor(models.Model):
    marca = models.CharField(max_length=20)
    modelo = models.CharField(max_length=20)
    tipo = models.CharField(max_length=10)
    tamanho = models.IntegerField(default=0)
    nro_serie= models.CharField(max_length=50)
    cantidad = models.IntegerField(default=0)
    estado = models.CharField(max_length=10)
    senhal = models.CharField(max_length=20)
    conexion = models.CharField(max_length=20)
    cargado_010 = models.BooleanField(default=False)
    cargado_010_por_gecos = models.CharField(max_length=100, null=True)
    cargado_010_fecha = models.DateTimeField(null=True, blank=True)
    anulado_040 = models.BooleanField(default=False)
    anulado_040_por_gecos = models.CharField(max_length=100, null=True)
    anulado_040_fecha = models.DateTimeField(null=True, blank=True)
    aprobado_050 = models.BooleanField(default=False)
    aprobado_050_por_gecos = models.CharField(max_length=100, null=True)
    aprobado_050_fecha = models.DateTimeField(null=True, blank=True)
 
class Accesorios(models.Model):
    televisorobj = models.ForeignKey(Televisor, blank=True, null=True, on_delete=models.CASCADE)
    marca = models.CharField(max_length=20)
    modelo = models.CharField(max_length=20)
    tipo = models.CharField(max_length=20)
    nro_serie = models.CharField(max_length=50)
    estado = models.CharField(max_length=10)
    cargado_010 = models.BooleanField(default=False)
    cargado_010_por_gecos = models.CharField(max_length=100, null=True)
    cargado_010_fecha = models.DateTimeField(null=True, blank=True)
    anulado_040 = models.BooleanField(default=False)
    anulado_040_por_gecos = models.CharField(max_length=100, null=True)
    anulado_040_fecha = models.DateTimeField(null=True, blank=True)
    aprobado_050 = models.BooleanField(default=False)
    aprobado_050_por_gecos = models.CharField(max_length=100, null=True)
    aprobado_050_fecha = models.DateTimeField(null=True, blank=True)
 

class CircuitoHeader(models.Model):
    fecha = models.DateField(max_length=10)
    responsable1 = models.ForeignKey(UserProfile, blank=True, null=True, on_delete=models.CASCADE) 
    responsable2 = models.CharField(max_length=50)
    chofer = models.CharField(max_length=50)
    vehiculo = models.CharField(max_length=50, null=True) 
    cargado_010 = models.BooleanField(default=False)
    cargado_010_por_gecos = models.CharField(max_length=100, null=True)
    cargado_010_fecha = models.DateTimeField(null=True, blank=True)
    anulado_040 = models.BooleanField(default=False)
    anulado_040_por_gecos = models.CharField(max_length=100, null=True)
    anulado_040_fecha = models.DateTimeField(null=True, blank=True)
    aprobado_050 = models.BooleanField(default=False)
    aprobado_050_por_gecos = models.CharField(max_length=100, null=True)
    aprobado_050_fecha = models.DateTimeField(null=True, blank=True)
 
class CircuitoDetail(models.Model): 
    circuitoheaderobj = models.ForeignKey(CircuitoHeader, blank=True, null=True, on_delete=models.CASCADE) 
    horallegada = models.DateTimeField(null=True, blank=True)
    horasalida = models.DateTimeField(null=True, blank=True)
    km = models.IntegerField(default=0)
    geo = models.CharField(max_length=100, null=True, blank=True)
    hogar = models.ForeignKey(Hogar, blank=True, null=True, on_delete=models.CASCADE) 
    barrio = models.CharField(max_length=100, null=True, blank=True)
    ciudad = models.CharField(max_length=100, null=True, blank=True)
    motivovisita = models.CharField(max_length=100, null=True, blank=True)
    estado = models.CharField(max_length=100, null=True, blank=True)
    efectividad = models.BooleanField(default=False)
    proximavisita=models.DateTimeField(null=True) 
    cargado_010 = models.BooleanField(default=False)
    cargado_010_por_gecos = models.CharField(max_length=100, null=True)
    cargado_010_fecha = models.DateTimeField(null=True, blank=True)
    anulado_040 = models.BooleanField(default=False)
    anulado_040_por_gecos = models.CharField(max_length=100, null=True)
    anulado_040_fecha = models.DateTimeField(null=True, blank=True)
    aprobado_050 = models.BooleanField(default=False)
    aprobado_050_por_gecos = models.CharField(max_length=100, null=True)
    aprobado_050_fecha = models.DateTimeField(null=True, blank=True)

class CircuitoDetailRelevamiento(models.Model):
    circuitodetailtaskobj = models.ForeignKey(CircuitoDetail, blank=True, null=True, on_delete=models.CASCADE) 
    entrevistado = models.CharField(max_length=100, null=True, blank=True)
    relaciondelentrevistado = models.CharField(max_length=100, null=True, blank=True)
    telefono = models.CharField(max_length=100, null=True, blank = True) 
    cargado_010 = models.BooleanField(default=False)
    cargado_010_por_gecos = models.CharField(max_length=100, null=True)
    cargado_010_fecha = models.DateTimeField(null=True, blank=True)
    anulado_040 = models.BooleanField(default=False)
    anulado_040_por_gecos = models.CharField(max_length=100, null=True)
    anulado_040_fecha = models.DateTimeField(null=True, blank=True)
    aprobado_050 = models.BooleanField(default=False)
    aprobado_050_por_gecos = models.CharField(max_length=100, null=True)
    aprobado_050_fecha = models.DateTimeField(null=True, blank=True)
    

class CircuitoDetailSiguienteVisita(models.Model):
    circuitodetailtaskobj = models.ForeignKey(CircuitoDetail, blank=True, null=True, on_delete=models.CASCADE) 
    recomendacion = models.CharField(max_length=100, null=True)
    cargado_010 = models.BooleanField(default=False)
    cargado_010_por_gecos = models.CharField(max_length=100, null=True)
    cargado_010_fecha = models.DateTimeField(null=True, blank=True)
    anulado_040 = models.BooleanField(default=False)
    anulado_040_por_gecos = models.CharField(max_length=100, null=True)
    anulado_040_fecha = models.DateTimeField(null=True, blank=True)
    aprobado_050 = models.BooleanField(default=False)
    aprobado_050_por_gecos = models.CharField(max_length=100, null=True)
    aprobado_050_fecha = models.DateTimeField(null=True, blank=True)

class CircuitoDetailMateriales(models.Model):
    circuitodetailtaskobj = models.ForeignKey(CircuitoDetail, blank=True, null=True, on_delete=models.CASCADE) 
    materialutilizado = models.ForeignKey(Accesorios, blank=True, null=True, on_delete=models.CASCADE) 
    cargado_010 = models.BooleanField(default=False)
    cargado_010_por_gecos = models.CharField(max_length=100, null=True)
    cargado_010_fecha = models.DateTimeField(null=True, blank=True)
    anulado_040 = models.BooleanField(default=False)
    anulado_040_por_gecos = models.CharField(max_length=100, null=True)
    anulado_040_fecha = models.DateTimeField(null=True, blank=True)
    aprobado_050 = models.BooleanField(default=False)
    aprobado_050_por_gecos = models.CharField(max_length=100, null=True)
    aprobado_050_fecha = models.DateTimeField(null=True, blank=True)


