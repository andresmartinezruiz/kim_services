# Generated by Django 3.1.5 on 2021-08-25 19:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('imp_man', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='prueba',
            name='cargado_010_por_gecos',
            field=models.CharField(blank=True, max_length=120, null=True),
        ),
        migrations.AlterField(
            model_name='usertrack',
            name='params',
            field=models.JSONField(),
        ),
    ]
