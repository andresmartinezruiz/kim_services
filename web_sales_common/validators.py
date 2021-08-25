from django.core.exceptions import ValidationError
import datetime
from finance_man.models import ModoIva

def not_zero(value):
    if value <= 0:
        raise ValidationError('Cargue un valor mayor a 0')

def length_fixty(value):
    if len(value) > 50:
        raise ValidationError('Solo se permite 50 Caracteres de largo')

def length_sixty(value):
    if len(value) > 100:
        raise ValidationError('Solo se permite 60 Caracteres de largo')

def check_iva(value):
    try:
        ModoIva.objects.get(porcentaje=value)
    except:
        v = [ iva.porcentaje for iva in ModoIva.objects.all() ]
        raise ValidationError('Valores admitidos para el Iva %s' % v)

def validate_fecha(value):
    if value == '0' or value == 0:
        return datetime.datetime.now()



