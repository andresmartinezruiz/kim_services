# Generated by Django 3.2 on 2021-08-24 21:38

from django.conf import settings
import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='AreaTrabajo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('areatrabajo', models.CharField(max_length=80, unique=True)),
                ('cargado_010', models.BooleanField(default=False)),
                ('cargado_010_por', models.CharField(blank=True, max_length=120, null=True)),
                ('cargado_010_por_id', models.IntegerField(blank=True, null=True)),
                ('cargado_010_por_gecos', models.CharField(blank=True, max_length=120, null=True, verbose_name='CARGADO POR')),
                ('cargado_010_fecha', models.DateField(blank=True, null=True, verbose_name='CARGADO FECHA')),
                ('cargado_010_hora', models.TimeField(blank=True, null=True, verbose_name='CARGADO HORA')),
                ('cargado_010_motivo', models.CharField(blank=True, max_length=120, null=True)),
                ('anulado_040', models.BooleanField(default=False)),
                ('anulado_040_por', models.CharField(blank=True, max_length=120, null=True)),
                ('anulado_040_por_id', models.IntegerField(blank=True, null=True)),
                ('anulado_040_por_gecos', models.CharField(blank=True, max_length=120, null=True)),
                ('anulado_040_fecha', models.DateField(blank=True, null=True)),
                ('anulado_040_hora', models.TimeField(blank=True, null=True)),
                ('anulado_040_motivo', models.CharField(blank=True, max_length=120, null=True)),
                ('verificado_045', models.BooleanField(default=False)),
                ('verificado_045_por', models.CharField(blank=True, max_length=120, null=True)),
                ('verificado_045_por_id', models.IntegerField(blank=True, null=True)),
                ('verificado_045_por_gecos', models.CharField(blank=True, max_length=120, null=True)),
                ('verificado_045_fecha', models.DateField(blank=True, null=True)),
                ('verificado_045_hora', models.TimeField(blank=True, null=True)),
                ('verificado_045_motivo', models.CharField(blank=True, max_length=120, null=True)),
                ('aprobado_050', models.BooleanField(default=False)),
                ('aprobado_050_por', models.CharField(blank=True, max_length=120, null=True)),
                ('aprobado_050_por_id', models.IntegerField(blank=True, null=True)),
                ('aprobado_050_por_gecos', models.CharField(blank=True, max_length=120, null=True)),
                ('aprobado_050_fecha', models.DateField(blank=True, null=True)),
                ('aprobado_050_hora', models.TimeField(blank=True, null=True)),
                ('aprobado_050_motivo', models.CharField(blank=True, max_length=120, null=True)),
                ('procesado_060', models.BooleanField(default=False)),
                ('procesado_060_por', models.CharField(blank=True, max_length=120, null=True)),
                ('procesado_060_por_id', models.IntegerField(blank=True, null=True)),
                ('procesado_060_por_gecos', models.CharField(blank=True, max_length=120, null=True)),
                ('procesado_060_fecha', models.DateField(blank=True, null=True)),
                ('procesado_060_hora', models.TimeField(blank=True, null=True)),
                ('procesado_060_motivo', models.CharField(blank=True, max_length=120, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='PuestoAreaTrabajo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('accessrole', django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True)),
                ('cargado_010', models.BooleanField(default=False)),
                ('cargado_010_por', models.CharField(blank=True, max_length=120, null=True)),
                ('cargado_010_por_id', models.IntegerField(blank=True, null=True)),
                ('cargado_010_por_gecos', models.CharField(blank=True, max_length=120, null=True, verbose_name='CARGADO POR')),
                ('cargado_010_fecha', models.DateField(blank=True, null=True, verbose_name='CARGADO FECHA')),
                ('cargado_010_hora', models.TimeField(blank=True, null=True, verbose_name='CARGADO HORA')),
                ('cargado_010_motivo', models.CharField(blank=True, max_length=120, null=True)),
                ('anulado_040', models.BooleanField(default=False)),
                ('anulado_040_por', models.CharField(blank=True, max_length=120, null=True)),
                ('anulado_040_por_id', models.IntegerField(blank=True, null=True)),
                ('anulado_040_por_gecos', models.CharField(blank=True, max_length=120, null=True)),
                ('anulado_040_fecha', models.DateField(blank=True, null=True)),
                ('anulado_040_hora', models.TimeField(blank=True, null=True)),
                ('anulado_040_motivo', models.CharField(blank=True, max_length=120, null=True)),
                ('verificado_045', models.BooleanField(default=False)),
                ('verificado_045_por', models.CharField(blank=True, max_length=120, null=True)),
                ('verificado_045_por_id', models.IntegerField(blank=True, null=True)),
                ('verificado_045_por_gecos', models.CharField(blank=True, max_length=120, null=True)),
                ('verificado_045_fecha', models.DateField(blank=True, null=True)),
                ('verificado_045_hora', models.TimeField(blank=True, null=True)),
                ('verificado_045_motivo', models.CharField(blank=True, max_length=120, null=True)),
                ('aprobado_050', models.BooleanField(default=False)),
                ('aprobado_050_por', models.CharField(blank=True, max_length=120, null=True)),
                ('aprobado_050_por_id', models.IntegerField(blank=True, null=True)),
                ('aprobado_050_por_gecos', models.CharField(blank=True, max_length=120, null=True)),
                ('aprobado_050_fecha', models.DateField(blank=True, null=True)),
                ('aprobado_050_hora', models.TimeField(blank=True, null=True)),
                ('aprobado_050_motivo', models.CharField(blank=True, max_length=120, null=True)),
                ('procesado_060', models.BooleanField(default=False)),
                ('procesado_060_por', models.CharField(blank=True, max_length=120, null=True)),
                ('procesado_060_por_id', models.IntegerField(blank=True, null=True)),
                ('procesado_060_por_gecos', models.CharField(blank=True, max_length=120, null=True)),
                ('procesado_060_fecha', models.DateField(blank=True, null=True)),
                ('procesado_060_hora', models.TimeField(blank=True, null=True)),
                ('procesado_060_motivo', models.CharField(blank=True, max_length=120, null=True)),
                ('areatrabajoobj', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pgk_user.areatrabajo')),
            ],
        ),
        migrations.CreateModel(
            name='Puestos',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('puesto', models.CharField(max_length=80, unique=True)),
                ('cargado_010', models.BooleanField(default=False)),
                ('cargado_010_por', models.CharField(blank=True, max_length=120, null=True)),
                ('cargado_010_por_id', models.IntegerField(blank=True, null=True)),
                ('cargado_010_por_gecos', models.CharField(blank=True, max_length=120, null=True, verbose_name='CARGADO POR')),
                ('cargado_010_fecha', models.DateField(blank=True, null=True, verbose_name='CARGADO FECHA')),
                ('cargado_010_hora', models.TimeField(blank=True, null=True, verbose_name='CARGADO HORA')),
                ('cargado_010_motivo', models.CharField(blank=True, max_length=120, null=True)),
                ('anulado_040', models.BooleanField(default=False)),
                ('anulado_040_por', models.CharField(blank=True, max_length=120, null=True)),
                ('anulado_040_por_id', models.IntegerField(blank=True, null=True)),
                ('anulado_040_por_gecos', models.CharField(blank=True, max_length=120, null=True)),
                ('anulado_040_fecha', models.DateField(blank=True, null=True)),
                ('anulado_040_hora', models.TimeField(blank=True, null=True)),
                ('anulado_040_motivo', models.CharField(blank=True, max_length=120, null=True)),
                ('verificado_045', models.BooleanField(default=False)),
                ('verificado_045_por', models.CharField(blank=True, max_length=120, null=True)),
                ('verificado_045_por_id', models.IntegerField(blank=True, null=True)),
                ('verificado_045_por_gecos', models.CharField(blank=True, max_length=120, null=True)),
                ('verificado_045_fecha', models.DateField(blank=True, null=True)),
                ('verificado_045_hora', models.TimeField(blank=True, null=True)),
                ('verificado_045_motivo', models.CharField(blank=True, max_length=120, null=True)),
                ('aprobado_050', models.BooleanField(default=False)),
                ('aprobado_050_por', models.CharField(blank=True, max_length=120, null=True)),
                ('aprobado_050_por_id', models.IntegerField(blank=True, null=True)),
                ('aprobado_050_por_gecos', models.CharField(blank=True, max_length=120, null=True)),
                ('aprobado_050_fecha', models.DateField(blank=True, null=True)),
                ('aprobado_050_hora', models.TimeField(blank=True, null=True)),
                ('aprobado_050_motivo', models.CharField(blank=True, max_length=120, null=True)),
                ('procesado_060', models.BooleanField(default=False)),
                ('procesado_060_por', models.CharField(blank=True, max_length=120, null=True)),
                ('procesado_060_por_id', models.IntegerField(blank=True, null=True)),
                ('procesado_060_por_gecos', models.CharField(blank=True, max_length=120, null=True)),
                ('procesado_060_fecha', models.DateField(blank=True, null=True)),
                ('procesado_060_hora', models.TimeField(blank=True, null=True)),
                ('procesado_060_motivo', models.CharField(blank=True, max_length=120, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('empresa', models.CharField(default='IBO', max_length=60)),
                ('work_empresa', django.contrib.postgres.fields.jsonb.JSONField(default=['IBO'])),
                ('tipo_bodeguero', models.CharField(default='LLEVA', max_length=15, null=True)),
                ('bloqueo_exento', models.BooleanField(default=False)),
                ('bloqueo', models.BooleanField(default=False)),
                ('desbloqueo_fecha', models.DateField(null=True)),
                ('ea_teamleader', models.BooleanField(default=False)),
                ('ea_grupo', models.CharField(default='ND', max_length=60)),
                ('clientecod', models.CharField(blank=True, max_length=15, null=True)),
                ('supervisor_ventas', models.CharField(blank=True, max_length=30, null=True)),
                ('vendedor_listas', django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True)),
                ('cedula', models.CharField(blank=True, max_length=40, null=True, verbose_name='CEDULA')),
                ('celular', models.CharField(blank=True, max_length=150, verbose_name='CELULAR')),
                ('geoposicion', models.CharField(max_length=150)),
                ('imei', models.CharField(blank=True, max_length=300, verbose_name='IMEI')),
                ('device_id', models.CharField(default='ND', max_length=300)),
                ('wlc', models.CharField(blank=True, max_length=200, null=True)),
                ('codigo_operador', models.CharField(blank=True, max_length=20, null=True, verbose_name='CODIGO OPERADOR')),
                ('ldap_uidnumber', models.BigIntegerField(blank=True, null=True)),
                ('correo', models.EmailField(default='nomail@rkf.com.py', max_length=254)),
                ('cclara', models.CharField(default='n/a', max_length=30)),
                ('last_changepassword', models.DateTimeField(null=True)),
                ('aprobadofechahora', models.CharField(blank=True, max_length=50, null=True)),
                ('aprobadopor', models.CharField(blank=True, max_length=50, null=True)),
                ('area_rrhh', models.CharField(blank=True, max_length=50, null=True)),
                ('cadenaid', models.IntegerField(blank=True, null=True)),
                ('cargadofechahora', models.CharField(blank=True, max_length=50, null=True)),
                ('cargadopor', models.CharField(blank=True, max_length=50, null=True)),
                ('cargo_rrhh', models.CharField(blank=True, max_length=50, null=True)),
                ('clienteid', models.IntegerField(blank=True, null=True)),
                ('cliente_porcentajeretencion', models.DecimalField(blank=True, decimal_places=6, max_digits=19, null=True)),
                ('cliente_retenerdesde', models.DecimalField(blank=True, decimal_places=6, max_digits=19, null=True)),
                ('comentarios', models.TextField(blank=True, max_length=50, null=True)),
                ('nombrefactura', models.CharField(blank=True, max_length=120, null=True)),
                ('nombrefantasia', models.CharField(blank=True, max_length=120, null=True)),
                ('proveedorivaenotrocheque', models.DecimalField(blank=True, decimal_places=6, max_digits=19, null=True)),
                ('proveedortipogasto', models.BooleanField(default=False)),
                ('ramonegocioid', models.BooleanField(default=False)),
                ('ruc', models.CharField(blank=True, max_length=80, null=True)),
                ('razonsocial', models.CharField(blank=True, max_length=80, null=True)),
                ('regimenturismo', models.BooleanField(default=False)),
                ('rucdv', models.IntegerField(blank=True, null=True)),
                ('varios1', models.CharField(blank=True, max_length=80, null=True)),
                ('varios2', models.CharField(blank=True, max_length=80, null=True)),
                ('varios3', models.CharField(blank=True, max_length=80, null=True)),
                ('varios4', models.CharField(blank=True, max_length=80, null=True)),
                ('varios5', models.CharField(blank=True, max_length=80, null=True)),
                ('verificadofechahora', models.CharField(blank=True, max_length=80, null=True)),
                ('verificadopor', models.CharField(blank=True, max_length=80, null=True)),
                ('escliente', models.BooleanField(default=False)),
                ('esclienteactivo', models.BooleanField(default=False)),
                ('escontacto', models.BooleanField(default=False)),
                ('espersonal', models.BooleanField(default=False)),
                ('espersonalactivo', models.BooleanField(default=False)),
                ('esproveedor', models.BooleanField(default=False)),
                ('esproveedoractivo', models.BooleanField(default=False)),
                ('esproveedormercaderia', models.BooleanField(default=False)),
                ('area', models.CharField(blank=True, max_length=80, null=True)),
                ('categoria', models.CharField(blank=True, max_length=80, null=True)),
                ('celularempresa', models.CharField(blank=True, max_length=80, null=True)),
                ('centrocostoid', models.CharField(blank=True, max_length=80, null=True)),
                ('codigoempleadoanterior', models.CharField(blank=True, max_length=80, null=True)),
                ('conbonificacion', models.BooleanField(default=False)),
                ('ctabancaria', models.CharField(blank=True, max_length=80, null=True)),
                ('d_usu', models.CharField(blank=True, max_length=80, null=True)),
                ('departamento', models.CharField(blank=True, max_length=80, null=True)),
                ('documentoidentidad', models.CharField(blank=True, max_length=80, null=True)),
                ('documentoidentidaddv', models.IntegerField(blank=True, null=True)),
                ('empleadoid', models.IntegerField(blank=True, null=True)),
                ('escalasalarial', models.CharField(blank=True, max_length=80, null=True)),
                ('estado', models.CharField(blank=True, max_length=80, null=True)),
                ('estadocivil', models.CharField(blank=True, max_length=80, null=True)),
                ('fechaips', models.CharField(blank=True, max_length=80, null=True)),
                ('fechaingreso', models.DateTimeField(blank=True, max_length=80, null=True)),
                ('fechanacimiento', models.CharField(blank=True, max_length=80, null=True)),
                ('fecharetiro', models.CharField(blank=True, max_length=80, null=True)),
                ('formacobro', models.CharField(blank=True, max_length=80, null=True)),
                ('horario', models.CharField(blank=True, max_length=80, null=True)),
                ('calendario', django.contrib.postgres.fields.jsonb.JSONField(default={})),
                ('entrada', models.DateTimeField(null=True)),
                ('inactivofechahora', models.CharField(blank=True, max_length=80, null=True)),
                ('ldapinactivofechahora', models.CharField(blank=True, max_length=80, null=True)),
                ('ldapinactivooperador', models.CharField(blank=True, max_length=80, null=True)),
                ('lugarnacimiento', models.CharField(blank=True, max_length=80, null=True)),
                ('marcaasistencia', models.BooleanField(default=False)),
                ('motivoretiro', models.CharField(blank=True, max_length=80, null=True)),
                ('nacionalidad', models.CharField(blank=True, max_length=80, null=True)),
                ('nivelacademico', models.CharField(blank=True, max_length=80, null=True)),
                ('nrobaja', models.CharField(blank=True, max_length=80, null=True)),
                ('nroips', models.CharField(blank=True, max_length=80, null=True)),
                ('nrolicenciaconducir', models.CharField(blank=True, max_length=80, null=True)),
                ('nrooperadoranterior', models.CharField(blank=True, max_length=80, null=True)),
                ('poseeterreno', models.CharField(blank=True, max_length=80, null=True)),
                ('poseevehiculo', models.CharField(blank=True, max_length=80, null=True)),
                ('poseevivienda', models.CharField(blank=True, max_length=80, null=True)),
                ('profesion', models.CharField(blank=True, max_length=80, null=True)),
                ('puesto', models.CharField(blank=True, max_length=80, null=True)),
                ('role', models.CharField(blank=True, max_length=80, null=True)),
                ('sexo', models.CharField(blank=True, max_length=80, null=True)),
                ('sue_legajoid', models.IntegerField(blank=True, null=True)),
                ('tipoempleado', models.CharField(blank=True, max_length=80, null=True)),
                ('tipolicenciaconducir', models.CharField(blank=True, max_length=80, null=True)),
                ('tipomarcacion', models.CharField(blank=True, max_length=80, null=True)),
                ('tipousuario', models.CharField(blank=True, max_length=80, null=True)),
                ('aprobador', models.BooleanField(default=False)),
                ('permisos', django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True)),
                ('equipo', django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True)),
                ('hide_ui', django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True)),
                ('network', django.contrib.postgres.fields.jsonb.JSONField(default=[])),
                ('internet_finger', django.contrib.postgres.fields.jsonb.JSONField(default=[])),
                ('menu', django.contrib.postgres.fields.jsonb.JSONField(default={})),
                ('impresora', django.contrib.postgres.fields.jsonb.JSONField(default=[])),
                ('emails', django.contrib.postgres.fields.jsonb.JSONField(default=[])),
                ('gpolicies', django.contrib.postgres.fields.jsonb.JSONField(default={})),
                ('onesignaltoken', django.contrib.postgres.fields.jsonb.JSONField(default={})),
                ('api_calls', django.contrib.postgres.fields.jsonb.JSONField(default=[])),
                ('responsable_operacion', django.contrib.postgres.fields.jsonb.JSONField(default=[])),
                ('superior_cargo', django.contrib.postgres.fields.jsonb.JSONField(default=[])),
                ('personal_cargo', django.contrib.postgres.fields.jsonb.JSONField(default=[])),
                ('cargado_010', models.BooleanField(default=False)),
                ('cargado_010_por', models.CharField(blank=True, max_length=120, null=True)),
                ('cargado_010_por_id', models.IntegerField(blank=True, null=True)),
                ('cargado_010_por_gecos', models.CharField(blank=True, max_length=120, null=True, verbose_name='CARGADO POR')),
                ('cargado_010_fecha', models.DateField(blank=True, null=True, verbose_name='CARGADO FECHA')),
                ('cargado_010_hora', models.TimeField(blank=True, null=True, verbose_name='CARGADO HORA')),
                ('cargado_010_motivo', models.CharField(blank=True, max_length=120, null=True)),
                ('libre_011', models.BooleanField(default=True)),
                ('libre_011_por', models.CharField(blank=True, max_length=120, null=True)),
                ('libre_011_por_id', models.IntegerField(blank=True, null=True)),
                ('libre_011_por_gecos', models.CharField(blank=True, max_length=120, null=True)),
                ('libre_011_fecha', models.DateField(blank=True, null=True)),
                ('libre_011_hora', models.TimeField(blank=True, null=True)),
                ('libre_011_motivo', models.CharField(blank=True, max_length=120, null=True)),
                ('anulado_040', models.BooleanField(default=False)),
                ('anulado_040_por', models.CharField(blank=True, max_length=120, null=True)),
                ('anulado_040_por_id', models.IntegerField(blank=True, null=True)),
                ('anulado_040_por_gecos', models.CharField(blank=True, max_length=120, null=True)),
                ('anulado_040_fecha', models.DateField(blank=True, null=True)),
                ('anulado_040_hora', models.TimeField(blank=True, null=True)),
                ('anulado_040_motivo', models.CharField(blank=True, max_length=120, null=True)),
                ('verificado_045', models.BooleanField(default=False)),
                ('verificado_045_por', models.CharField(blank=True, max_length=120, null=True)),
                ('verificado_045_por_id', models.IntegerField(blank=True, null=True)),
                ('verificado_045_por_gecos', models.CharField(blank=True, max_length=120, null=True)),
                ('verificado_045_fecha', models.DateField(blank=True, null=True)),
                ('verificado_045_hora', models.TimeField(blank=True, null=True)),
                ('verificado_045_motivo', models.CharField(blank=True, max_length=120, null=True)),
                ('aprobado_050', models.BooleanField(default=False)),
                ('aprobado_050_por', models.CharField(blank=True, max_length=120, null=True)),
                ('aprobado_050_por_id', models.IntegerField(blank=True, null=True)),
                ('aprobado_050_por_gecos', models.CharField(blank=True, max_length=120, null=True)),
                ('aprobado_050_fecha', models.DateField(blank=True, null=True)),
                ('aprobado_050_hora', models.TimeField(blank=True, null=True)),
                ('aprobado_050_motivo', models.CharField(blank=True, max_length=120, null=True)),
                ('procesado_060', models.BooleanField(default=False)),
                ('procesado_060_por', models.CharField(blank=True, max_length=120, null=True)),
                ('procesado_060_por_id', models.IntegerField(blank=True, null=True)),
                ('procesado_060_por_gecos', models.CharField(blank=True, max_length=120, null=True)),
                ('procesado_060_fecha', models.DateField(blank=True, null=True)),
                ('procesado_060_hora', models.TimeField(blank=True, null=True)),
                ('procesado_060_motivo', models.CharField(blank=True, max_length=120, null=True)),
                ('puestoareatrabajoobj', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pgk_user.puestoareatrabajo', verbose_name='PUESTO AREA')),
                ('userobj', models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL, verbose_name='USUARIO')),
            ],
        ),
        migrations.AddField(
            model_name='puestoareatrabajo',
            name='puestoobj',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pgk_user.puestos'),
        ),
        migrations.AlterUniqueTogether(
            name='puestoareatrabajo',
            unique_together={('puestoobj', 'areatrabajoobj')},
        ),
    ]
