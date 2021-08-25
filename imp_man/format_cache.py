#coding: utf-8
from django.apps import apps
get_models = apps.get_models
import re
import logging
from web_sales_common import utilitarios
import json
class FormatCache(object):
    def model_keyfiels(self):
      params = {   'prueba': {
        'fields': [
          'id',
          'nombre', 'apellido',
        'cargado_010',
        'cargado_010_por_gecos',
        'cargado_010_fecha',
        'anulado_040',
        'anulado_040_por_gecos',
        'anulado_040_fecha',
        'verificado_045',
        'verificado_045_por_gecos',
        'verificado_045_fecha',
        'aprobado_050',
        'aprobado_050_por_gecos',
        'aprobado_050_fecha',
        ]
      }   }
      return params

    def serial_model(self, mobj, modelname, **kwargs):
          keyfilter = self.model_keyfiels()
          paramsmdict = keyfilter.get(modelname)
          idp = paramsmdict.pop('id', 'pk')
          # methods = paramsmdict.pop('methods', [])
          if kwargs.get('explicit_key'):
              keyfilter.update({'explicit_key': True, 'keyname': modelname})
          mdict = utilitarios.serial_model(mobj, **keyfilter)              
          try:
            mdict = utilitarios.serial_model(mobj, **keyfilter)  
          except Exception as e:
            msg = 'Error Cacheando {} {} {}' .format(e,   mobj._meta.model_name, modelname)
            logging.error(msg)
          if re.search('\.', idp):
            idp, secondidp = idp.split('.')
            try:
              mdict['_id'] = getattr(getattr(mobj, idp), secondidp)
            except Exception as e:
              mdict['_id'] = mobj.pk
          else:
            try:
              mdict['_id'] = getattr(mobj, idp)
            except Exception as e:
              mdict['_id'] = mobj.pk
          # for method in methods:
          #   mdict[method] = getattr(mobj, method)()
          if kwargs.get('parse_json'):
            mdict = json.dumps(mdict, cls=utilitarios.NetipaJSONEncoder)
            return json.loads(mdict)
          return mdict

