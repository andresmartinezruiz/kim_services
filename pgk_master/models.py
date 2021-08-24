# -*- coding: utf-8 -*-

#django
from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from django.db.models import Q
from django.contrib.postgres.fields import JSONField

#others
from __future__ import unicode_literals
import os
import json
import base64
import datetime


# Create your models here.

class Hogar(models.Model):
    hogarid = models.AutoField(primary_key=True)
    direccion = models.CharField(max_length=50)
    barrio = models.CharField(max_length=50)
    ciudad = models.CharField(max_length=50)
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
    hogar = models.ForeignKey(Hogar, blank=True, null=True, on_delete=models.CASCADE)
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
    chapa = models.CharField(max_length=100, null=True)
    marca = models.CharField(max_length=100, null=True)
    modelo = models.CharField(max_length=100, null=True)
    tipo = models.CharField(max_length=100, null=True)
    cargado_010 = models.BooleanField(default=False)
    cargado_010_por_gecos = models.CharField(max_length=100, null=True)
    cargado_010_fecha = models.DateTimeField(null=True, blank=True)
    anulado_040 = models.BooleanField(default=False)
    anulado_040_por_gecos = models.CharField(max_length=100, null=True)
    anulado_040_fecha = models.DateTimeField(null=True, blank=True)
    aprobado_050 = models.BooleanField(default=False)
    aprobado_050_por_gecos = models.CharField(max_length=100, null=True)
    aprobado_050_fecha = models.DateTimeField(null=True, blank=True)