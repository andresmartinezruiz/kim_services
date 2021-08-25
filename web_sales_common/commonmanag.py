from dashboard.dashboardmanag import SbUser
import subprocess
import datetime
from django.conf import settings
import csv
import unicodecsv

class CommonTasks(object):
    def verificar_obj(self, userobj, **kwargs):
        modelobj = kwargs.get('modelobj')
        query_dict = kwargs.get('query_dict')

        ahora = datetime.datetime.now()
        sbuser = SbUser()
        username, \
        usernumber, \
        usergecos = \
            sbuser.get_user_default_control(userobj)
        params = {
            'verificado_045': True,
            'verificado_045_por': username,
            'verificado_045_por_id': usernumber,
            'verificado_045_por_gecos': usergecos,
            'verificado_045_fecha': ahora,
            'verificado_045_hora': ahora,
        }

        for k, v in params.items():
            setattr(modelobj, k, v)
        modelobj.save()

        keys = query_dict.dict().keys()
        for k in keys:
            if k.startswith('list_related'):
                attr = query_dict.get(k)
                relate_object = getattr(modelobj, attr)
                relate_object.update(**params)

        return {'exitos': ['VERIFICADO'],
                'pk': modelobj.pk }

    def anular_obj(self, userobj, **kwargs):
        modelobj = kwargs.get('modelobj')
        query_dict = kwargs.get('query_dict')

        ahora = datetime.datetime.now()
        sbuser = SbUser()
        username, \
        usernumber, \
        usergecos = \
            sbuser.get_user_default_control(userobj)
        params = {
            'cargado_010': False,
            'anulado_040': True,
            'anulado_040_por': username,
            'anulado_040_por_id': usernumber,
            'anulado_040_por_gecos': usergecos,
            'anulado_040_fecha': ahora,
            'anulado_040_hora': ahora
        }

        for k, v in params.items():
            setattr(modelobj, k, v)
        modelobj.save()

        keys = query_dict.dict().keys()
        for k in keys:
            if k.startswith('list_related'):
                attr = query_dict.get(k)
                relate_object = getattr(modelobj, attr)
                relate_object.update(**params)

        return {'exitos': ['ANULADO'],
                'pk': modelobj.pk }
    
    def aprobar_obj(self, userobj, **kwargs):
        modelobj = kwargs.get('modelobj')
        query_dict = kwargs.get('query_dict')
        ahora = datetime.datetime.now()

        sbuser = SbUser()
        username, \
        usernumber, \
        usergecos = \
            sbuser.get_user_default_control(userobj)
        params = {
            'aprobado_050': True,
            'aprobado_050_por': username,
            'aprobado_050_por_id': usernumber,
            'aprobado_050_por_gecos': usergecos,
            'aprobado_050_fecha': ahora,
            'aprobado_050_hora': ahora
        }

        for k, v in params.items():
            setattr(modelobj, k, v)
        modelobj.save()

        keys = query_dict.dict().keys()
        for k in keys:
            if k.startswith('list_related'):
                attr = query_dict.get(k)
                relate_object = getattr(modelobj, attr)
                relate_object.update(**params)

        return {'exitos': ['APROBADO'],
                'pk': modelobj.pk }

    def marcar_para_bloque_obj(self, userobj, **kwargs):
        modelobj = kwargs.get('modelobj')
        query_dict = kwargs.get('query_dict')

        ahora = datetime.datetime.now()
        sbuser = SbUser()
        username, \
        usernumber, \
        usergecos = \
            sbuser.get_user_default_control(userobj)
        params = {
            'marcado_bloque_060': True,
            'marcado_bloque_060_por': username,
            'marcado_bloque_060_por_id': usernumber,
            'marcado_bloque_060_por_gecos': usergecos,
            'marcado_bloque_060_fecha': ahora,
            'marcado_bloque_060_hora': ahora
        }

        for k, v in params.items():
            setattr(modelobj, k, v)
        modelobj.save()

        keys = query_dict.dict().keys()
        for k in keys:
            if k.startswith('list_related'):
                attr = query_dict.get(k)
                relate_object = getattr(modelobj, attr)
                relate_object.update(**params)

        return {'exitos': ['MARCADO PARA BLOQUE'],
                'pk': modelobj.pk }

    def desmarcar_para_bloque_obj(self, userobj, **kwargs):
        modelobj = kwargs.get('modelobj')
        query_dict = kwargs.get('query_dict')

        ahora = datetime.datetime.now()
        sbuser = SbUser()
        username, \
        usernumber, \
        usergecos = \
            sbuser.get_user_default_control(userobj)
        params = {
            'marcado_bloque_060': False
        }

        for k, v in params.items():
            setattr(modelobj, k, v)
        modelobj.save()

        keys = query_dict.dict().keys()
        for k in keys:
            if k.startswith('list_related'):
                attr = query_dict.get(k)
                relate_object = getattr(modelobj, attr)
                relate_object.update(**params)

        return {'exitos': ['DESMARCADO PARA BLOQUE'],
                'pk': modelobj.pk }

    def make_filters(self, class_model, exclude=[]):
        #make all the filter False to defaul, than the forms request
        #is going to make True the select for the user
        filters = {}
        for field in class_model._meta.fields:
            if field.name not in exclude:
                if field.get_internal_type() == 'BooleanField':
                    filters.update({
                        field.name: False
                    })

        return filters

def update_or_create(modelclass, **kwargs):
    try:
        obj = modelclass.objects.get(kwargs.get('get_values'))
        for key, value in kwargs.items():
            setattr(obj, key, value)
        obj.save()
    except modelclass.DoesNotExist:
        kwargs.update()
        obj = modelclass(**kwargs)
        obj.save()






