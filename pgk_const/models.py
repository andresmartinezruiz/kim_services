# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.
class Pais(models.Model):
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

class Ciudad(models.Model):
    nombreciudad = models.CharField(help_text='nombreCiudad', max_length=70) 
    nombrepais = models.ForeignKey(Pais, blank=True, null=True, on_delete=models.CASCADE)
    cargado_010 = models.BooleanField(default=False)
    cargado_010_por_gecos = models.CharField(max_length=100, null=True)
    cargado_010_fecha = models.DateTimeField(null=True, blank=True)
    anulado_040 = models.BooleanField(default=False)
    anulado_040_por_gecos = models.CharField(max_length=100, null=True)
    anulado_040_fecha = models.DateTimeField(null=True, blank=True)
    aprobado_050 = models.BooleanField(default=False)
    aprobado_050_por_gecos = models.CharField(max_length=100, null=True)
    aprobado_050_fecha = models.DateTimeField(null=True, blank=True)

class Barrio(models.Model):
    nombrebarrio = models.CharField(help_text='nombreBarrio', max_length=70)  # Field name made lowercase.
    nombreciudad = models.ForeignKey(Ciudad, blank=True, null=True, on_delete=models.CASCADE) 
    cargado_010 = models.BooleanField(default=False)
    cargado_010_por_gecos = models.CharField(max_length=100, null=True)
    cargado_010_fecha = models.DateTimeField(null=True, blank=True)
    anulado_040 = models.BooleanField(default=False)
    anulado_040_por_gecos = models.CharField(max_length=100, null=True)
    anulado_040_fecha = models.DateTimeField(null=True, blank=True)
    aprobado_050 = models.BooleanField(default=False)
    aprobado_050_por_gecos = models.CharField(max_length=100, null=True)
    aprobado_050_fecha = models.DateTimeField(null=True, blank=True)



