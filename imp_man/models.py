# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from django.db.models import JSONField

# Create your models here.
class UserTrack(models.Model):
    fecha = models.DateTimeField()
    username = models.CharField(max_length=120)
    scheme = models.CharField(max_length=120)
    path = models.CharField(max_length=120)
    path_info = models.CharField(max_length=120)
    method = models.CharField(max_length=120)
    encoding = models.CharField(max_length=120)
    content_type = models.CharField(max_length=120)
    content_params = models.CharField(max_length=120)
    cookies = models.CharField(max_length=120)
    content_length = models.CharField(max_length=120)
    content_type = models.CharField(max_length=120)
    http_accept = models.CharField(max_length=120)
    http_accept_encoding = models.CharField(max_length=120)
    http_accept_language = models.CharField(max_length=120)
    http_host = models.CharField(max_length=120)
    http_referer = models.CharField(max_length=120)
    http_user_agent = models.CharField(max_length=120)
    query_string = models.CharField(max_length=120)
    remote_addr = models.CharField(max_length=120)
    remote_host = models.CharField(max_length=120)
    remote_user = models.CharField(max_length=120)
    request_method = models.CharField(max_length=120)
    server_name = models.CharField(max_length=120)
    server_port = models.CharField(max_length=120)
    params = JSONField()

class Prueba(models.Model):
    nombre = models.CharField(max_length=120)
    apellido = models.CharField(max_length=120)    
    cargado_010 = models.BooleanField(default=False)
    cargado_010_por_gecos = models.CharField(max_length=120, null=True, blank=True)
    cargado_010_fecha = models.DateTimeField(null=True, blank=True)    
    anulado_040 = models.BooleanField(default=False)
    anulado_040_por_gecos = models.CharField(max_length=120, null=True, blank=True)
    anulado_040_fecha = models.DateTimeField(null=True, blank=True)
    verificado_045 = models.BooleanField(default=False)
    verificado_045_por_gecos = models.CharField(max_length=120, null=True, blank=True)
    verificado_045_fecha = models.DateTimeField(null=True, blank=True)
    aprobado_050 = models.BooleanField(default=False)
    aprobado_050_por_gecos = models.CharField(max_length=120, null=True, blank=True)
    aprobado_050_fecha = models.DateTimeField(null=True, blank=True)