# Generated by Django 3.2 on 2021-08-24 21:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('pgk_master', '0001_initial'),
        ('pgk_user', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Accesorios',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('marca', models.CharField(max_length=20)),
                ('modelo', models.CharField(max_length=20)),
                ('tipo', models.CharField(max_length=20)),
                ('nro_serie', models.CharField(max_length=50)),
                ('estado', models.CharField(max_length=10)),
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
            name='Canales',
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
            name='CircuitoDetail',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('horallegada', models.DateTimeField(blank=True, null=True)),
                ('horasalida', models.DateTimeField(blank=True, null=True)),
                ('km', models.IntegerField(default=0)),
                ('geo', models.CharField(blank=True, max_length=100, null=True)),
                ('barrio', models.CharField(blank=True, max_length=100, null=True)),
                ('ciudad', models.CharField(blank=True, max_length=100, null=True)),
                ('motivovisita', models.CharField(blank=True, max_length=100, null=True)),
                ('estado', models.CharField(blank=True, max_length=100, null=True)),
                ('efectividad', models.BooleanField(default=False)),
                ('proximavisita', models.DateTimeField(null=True)),
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
            name='Meter',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=50)),
                ('nro_serie', models.CharField(max_length=50)),
                ('tipo', models.TextField(max_length=100)),
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
            name='OperadoraServicio',
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
            name='Televisor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('marca', models.CharField(max_length=20)),
                ('modelo', models.CharField(max_length=20)),
                ('tipo', models.CharField(max_length=10)),
                ('tamanho', models.IntegerField(default=0)),
                ('nro_serie', models.CharField(max_length=50)),
                ('cantidad', models.IntegerField(default=0)),
                ('estado', models.CharField(max_length=10)),
                ('senhal', models.CharField(max_length=20)),
                ('conexion', models.CharField(max_length=20)),
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
            name='Sintonia',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('canal', models.CharField(max_length=100, null=True)),
                ('numero', models.IntegerField()),
                ('cargado_010', models.BooleanField(default=False)),
                ('cargado_010_por_gecos', models.CharField(max_length=100, null=True)),
                ('cargado_010_fecha', models.DateTimeField(blank=True, null=True)),
                ('anulado_040', models.BooleanField(default=False)),
                ('anulado_040_por_gecos', models.CharField(max_length=100, null=True)),
                ('anulado_040_fecha', models.DateTimeField(blank=True, null=True)),
                ('aprobado_050', models.BooleanField(default=False)),
                ('aprobado_050_por_gecos', models.CharField(max_length=100, null=True)),
                ('aprobado_050_fecha', models.DateTimeField(blank=True, null=True)),
                ('operadoraobj', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='pgk_tecnic.operadoraservicio')),
            ],
        ),
        migrations.CreateModel(
            name='CircuitoHeader',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha', models.DateField(max_length=10)),
                ('responsable2', models.CharField(max_length=50)),
                ('chofer', models.CharField(max_length=50)),
                ('vehiculo', models.CharField(max_length=50, null=True)),
                ('cargado_010', models.BooleanField(default=False)),
                ('cargado_010_por_gecos', models.CharField(max_length=100, null=True)),
                ('cargado_010_fecha', models.DateTimeField(blank=True, null=True)),
                ('anulado_040', models.BooleanField(default=False)),
                ('anulado_040_por_gecos', models.CharField(max_length=100, null=True)),
                ('anulado_040_fecha', models.DateTimeField(blank=True, null=True)),
                ('aprobado_050', models.BooleanField(default=False)),
                ('aprobado_050_por_gecos', models.CharField(max_length=100, null=True)),
                ('aprobado_050_fecha', models.DateTimeField(blank=True, null=True)),
                ('responsable1', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='pgk_user.userprofile')),
            ],
        ),
        migrations.CreateModel(
            name='CircuitoDetailSiguienteVisita',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('recomendacion', models.CharField(max_length=100, null=True)),
                ('cargado_010', models.BooleanField(default=False)),
                ('cargado_010_por_gecos', models.CharField(max_length=100, null=True)),
                ('cargado_010_fecha', models.DateTimeField(blank=True, null=True)),
                ('anulado_040', models.BooleanField(default=False)),
                ('anulado_040_por_gecos', models.CharField(max_length=100, null=True)),
                ('anulado_040_fecha', models.DateTimeField(blank=True, null=True)),
                ('aprobado_050', models.BooleanField(default=False)),
                ('aprobado_050_por_gecos', models.CharField(max_length=100, null=True)),
                ('aprobado_050_fecha', models.DateTimeField(blank=True, null=True)),
                ('circuitodetailtaskobj', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='pgk_tecnic.circuitodetail')),
            ],
        ),
        migrations.CreateModel(
            name='CircuitoDetailRelevamiento',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entrevistado', models.CharField(blank=True, max_length=100, null=True)),
                ('relaciondelentrevistado', models.CharField(blank=True, max_length=100, null=True)),
                ('telefono', models.CharField(blank=True, max_length=100, null=True)),
                ('cargado_010', models.BooleanField(default=False)),
                ('cargado_010_por_gecos', models.CharField(max_length=100, null=True)),
                ('cargado_010_fecha', models.DateTimeField(blank=True, null=True)),
                ('anulado_040', models.BooleanField(default=False)),
                ('anulado_040_por_gecos', models.CharField(max_length=100, null=True)),
                ('anulado_040_fecha', models.DateTimeField(blank=True, null=True)),
                ('aprobado_050', models.BooleanField(default=False)),
                ('aprobado_050_por_gecos', models.CharField(max_length=100, null=True)),
                ('aprobado_050_fecha', models.DateTimeField(blank=True, null=True)),
                ('circuitodetailtaskobj', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='pgk_tecnic.circuitodetail')),
            ],
        ),
        migrations.CreateModel(
            name='CircuitoDetailMateriales',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cargado_010', models.BooleanField(default=False)),
                ('cargado_010_por_gecos', models.CharField(max_length=100, null=True)),
                ('cargado_010_fecha', models.DateTimeField(blank=True, null=True)),
                ('anulado_040', models.BooleanField(default=False)),
                ('anulado_040_por_gecos', models.CharField(max_length=100, null=True)),
                ('anulado_040_fecha', models.DateTimeField(blank=True, null=True)),
                ('aprobado_050', models.BooleanField(default=False)),
                ('aprobado_050_por_gecos', models.CharField(max_length=100, null=True)),
                ('aprobado_050_fecha', models.DateTimeField(blank=True, null=True)),
                ('circuitodetailtaskobj', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='pgk_tecnic.circuitodetail')),
                ('materialutilizado', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='pgk_tecnic.accesorios')),
            ],
        ),
        migrations.AddField(
            model_name='circuitodetail',
            name='circuitoheaderobj',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='pgk_tecnic.circuitoheader'),
        ),
        migrations.AddField(
            model_name='circuitodetail',
            name='hogar',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='pgk_master.hogar'),
        ),
        migrations.AddField(
            model_name='accesorios',
            name='televisorobj',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='pgk_tecnic.televisor'),
        ),
    ]