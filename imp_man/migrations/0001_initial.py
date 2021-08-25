# -*- coding: utf-8 -*-
# Generated by Django 1.11.17 on 2021-08-25 15:42
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Prueba',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=120)),
                ('apellido', models.CharField(max_length=120)),
                ('cargado_010', models.BooleanField(default=False)),
                ('cargado_010_por_gecos', models.BooleanField(default=False)),
                ('cargado_010_fecha', models.DateTimeField(blank=True, null=True)),
                ('anulado_040', models.BooleanField(default=False)),
                ('anulado_040_por_gecos', models.CharField(blank=True, max_length=120, null=True)),
                ('anulado_040_fecha', models.DateTimeField(blank=True, null=True)),
                ('verificado_045', models.BooleanField(default=False)),
                ('verificado_045_por_gecos', models.CharField(blank=True, max_length=120, null=True)),
                ('verificado_045_fecha', models.DateTimeField(blank=True, null=True)),
                ('aprobado_050', models.BooleanField(default=False)),
                ('aprobado_050_por_gecos', models.CharField(blank=True, max_length=120, null=True)),
                ('aprobado_050_fecha', models.DateTimeField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='UserTrack',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha', models.DateTimeField()),
                ('username', models.CharField(max_length=120)),
                ('scheme', models.CharField(max_length=120)),
                ('path', models.CharField(max_length=120)),
                ('path_info', models.CharField(max_length=120)),
                ('method', models.CharField(max_length=120)),
                ('encoding', models.CharField(max_length=120)),
                ('content_params', models.CharField(max_length=120)),
                ('cookies', models.CharField(max_length=120)),
                ('content_length', models.CharField(max_length=120)),
                ('content_type', models.CharField(max_length=120)),
                ('http_accept', models.CharField(max_length=120)),
                ('http_accept_encoding', models.CharField(max_length=120)),
                ('http_accept_language', models.CharField(max_length=120)),
                ('http_host', models.CharField(max_length=120)),
                ('http_referer', models.CharField(max_length=120)),
                ('http_user_agent', models.CharField(max_length=120)),
                ('query_string', models.CharField(max_length=120)),
                ('remote_addr', models.CharField(max_length=120)),
                ('remote_host', models.CharField(max_length=120)),
                ('remote_user', models.CharField(max_length=120)),
                ('request_method', models.CharField(max_length=120)),
                ('server_name', models.CharField(max_length=120)),
                ('server_port', models.CharField(max_length=120)),
                ('params', django.contrib.postgres.fields.jsonb.JSONField()),
            ],
        ),
    ]