# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.

class Hogar(models.Model):
    hogarid = models.AutoField(primary_key=True)
    Direccion = models.CharField(max_length=50)
    Barrio = models.CharField(max_lenght=50)
    Ciudad = models.CharField(max_lenght=50)
    cargado_010 = models.BooleanField(default=False)
    cargado_010_por_gecos = models.CharField(max_length=100, null=True)
    cargado_010_fecha = models.DateTimeField(null=True, blank=True)
    anulado_040 = models.BooleanField(default=False)
    anulado_040_por_gecos = models.CharField(max_length=100, null=True)
    anulado_040_fecha = models.DateTimeField(null=True, blank=True)
    aprobado_050 = models.BooleanField(default=False)
    aprobado_050_por_gecos = models.CharField(max_length=100, null=True)
    aprobado_050_fecha = models.DateTimeField(null=True, blank=True)

class Catastro(models.Model):
    nombre = models.CharField(max_length=50)
    nacionalidad = models.CharField(max_length=20)
    sexo = models.CharField(max_length=10)
    hogar = models.ForeignKey('CHogar', blank=True, null=True, on_delete=models.CASCADE)
    relacion = models.CharField(max_length=10)
    estadocivil = models.CharField(max_length=20)
    cargado_010 = models.BooleanField(default=False)
    cargado_010_por_gecos = models.CharField(max_length=100, null=True)
    cargado_010_fecha = models.DateTimeField(null=True, blank=True)
    anulado_040 = models.BooleanField(default=False)
    anulado_040_por_gecos = models.CharField(max_length=100, null=True)
    anulado_040_fecha = models.DateTimeField(null=True, blank=True)
    aprobado_050 = models.BooleanField(default=False)
    aprobado_050_por_gecos = models.CharField(max_length=100, null=True)
    aprobado_050_fecha = models.DateTimeField(null=True, blank=True)

class Rodados(models.Model):
    Chapa = models.CharField(max_lenght=100, null=True)
    Marca = models.CharField(max_lenght=100, null=True)
    Modelo = models.CharField(max_lenght=100, null=True)
    Tipo = models.CharField(max_lenght=100, null=True)
    cargado_010 = models.BooleanField(default=False)
    cargado_010_por_gecos = models.CharField(max_length=100, null=True)
    cargado_010_fecha = models.DateTimeField(null=True, blank=True)
    anulado_040 = models.BooleanField(default=False)
    anulado_040_por_gecos = models.CharField(max_length=100, null=True)
    anulado_040_fecha = models.DateTimeField(null=True, blank=True)
    aprobado_050 = models.BooleanField(default=False)
    aprobado_050_por_gecos = models.CharField(max_length=100, null=True)
    aprobado_050_fecha = models.DateTimeField(null=True, blank=True)