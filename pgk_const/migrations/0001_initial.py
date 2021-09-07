# Generated by Django 3.2 on 2021-09-06 19:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Pais',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=50)),
                ('cargado_010', models.BooleanField(default=False)),
                ('cargado_010_por_gecos', models.CharField(max_length=100, null=True)),
                ('cargado_010_fecha', models.DateTimeField(blank=True, null=True)),
                ('anulado_040', models.BooleanField(default=False)),
                ('anulado_040_por_gecos', models.CharField(max_length=100, null=True)),
                ('anulado_040_fecha', models.DateTimeField(blank=True, null=True)),
                ('aprobado_050', models.BooleanField(default=False)),
                ('aprobado_050_por_gecos', models.CharField(max_length=100, null=True)),
                ('aprobado_050_fecha', models.DateTimeField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Ciudad',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombreciudad', models.CharField(help_text='nombreCiudad', max_length=70)),
                ('cargado_010', models.BooleanField(default=False)),
                ('cargado_010_por_gecos', models.CharField(max_length=100, null=True)),
                ('cargado_010_fecha', models.DateTimeField(blank=True, null=True)),
                ('anulado_040', models.BooleanField(default=False)),
                ('anulado_040_por_gecos', models.CharField(max_length=100, null=True)),
                ('anulado_040_fecha', models.DateTimeField(blank=True, null=True)),
                ('aprobado_050', models.BooleanField(default=False)),
                ('aprobado_050_por_gecos', models.CharField(max_length=100, null=True)),
                ('aprobado_050_fecha', models.DateTimeField(blank=True, null=True)),
                ('nombrepais', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='pgk_const.pais')),
            ],
        ),
        migrations.CreateModel(
            name='Barrio',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombrebarrio', models.CharField(help_text='nombreBarrio', max_length=70)),
                ('cargado_010', models.BooleanField(default=False)),
                ('cargado_010_por_gecos', models.CharField(max_length=100, null=True)),
                ('cargado_010_fecha', models.DateTimeField(blank=True, null=True)),
                ('anulado_040', models.BooleanField(default=False)),
                ('anulado_040_por_gecos', models.CharField(max_length=100, null=True)),
                ('anulado_040_fecha', models.DateTimeField(blank=True, null=True)),
                ('aprobado_050', models.BooleanField(default=False)),
                ('aprobado_050_por_gecos', models.CharField(max_length=100, null=True)),
                ('aprobado_050_fecha', models.DateTimeField(blank=True, null=True)),
                ('nombreciudad', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='pgk_const.ciudad')),
            ],
        ),
    ]
