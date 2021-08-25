# -*- coding: utf-8 -*-
import json
from django.apps import apps
from django.http import QueryDict
from django.forms import model_to_dict
import importlib
get_model = apps.get_model
from django.template.loader import get_template
from django.utils.safestring import mark_safe
from django.conf import settings
from django.core.mail import send_mail, EmailMessage
import logging
import datetime
from web_sales_common import utilitarios

class ImpManag(object):
  def get_user_default_control(self, userobj):
      try:
          return userobj.username, \
                   userobj.pk, \
                   userobj.username
      except:
          return 'supervisor', \
                   1, \
                   'supervisor'

  def render_view_report(self, **kwargs):
    module_name = kwargs.get('module_name')
    class_name = kwargs.get('class_name')
    method_name = kwargs.get('method_name')
    modulo = kwargs.get('modulo')
    destinatarios = kwargs.get('destinatarios')
    requestshell = kwargs.get('requestshell')
    request = kwargs.get('request')
    title = kwargs.get('title')
    rhtml = kwargs.get('rhtml')
    filename = kwargs.get('filename')
    SbLModule = importlib.import_module(module_name)
    SbLClass = getattr(SbLModule, class_name)()
    SbLMethod = getattr(SbLClass, method_name)
    response = SbLMethod(requestshell)
    if rhtml: return response
    self.static_report_mail(html=response,
                            modulo=modulo,
                            destinatarios=destinatarios,
                            request=request,
                            title=title,
                            headers=kwargs.get('headers'),
                            fechaMail=kwargs.get('fechaMail'),
                            filename=filename
                            )

  def notificar_correo(self, *args, **kwargs):
    query_dict = kwargs.get('query_dict')
    asunto = query_dict.get('asunto')
    cuerpo = query_dict.get('cuerpo')
    destino = query_dict.getlist('destino')
    send_mail(asunto,
              cuerpo,
              settings.NOTIFICATIONS_SENDER,
              destino,
              fail_silently=False,
              html_message=cuerpo
    )
    return {'exitos': 'Enviado'}

  def static_report_mail(self, **kwargs):
      ahora = datetime.datetime.now()
      html = kwargs.get('html')
      modulo = kwargs.get('modulo')
      destinatarios = kwargs.get('destinatarios')
      request = kwargs.get('request')
      title = kwargs.get('title')
      filename = kwargs.get('filename')
      html_content = get_template('imp_man/StaticReportMail.html')\
          .render({'html': mark_safe(html), 'title': title, 'request': request})
      if not destinatarios:
          destinatarios = settings.NOTIFICATIONS
      else:
          destinatarios = destinatarios.split(',')
      if kwargs.get('headers') or filename:
          email = EmailMessage(
              '%s' % modulo,
              html_content.replace('/static/', '%s/static/' % settings.GDOMAIN).replace('<h5>', '').replace('</h5>', ''),
              settings.NOTIFICATIONS_SENDER,
              destinatarios,
              [],
              reply_to=[settings.NOTIFICATIONS_SENDER],
              headers=kwargs.get('fechaMail'),
          )
          if filename:
              email.attach_file(filename)
          email.content_subtype = 'html'
          email.send()
          return
      try:
        send_mail('%s' % modulo,
                        'Informe de Sistema Generado el %s' % ahora.strftime('%d/%m/%Y %H:%M:%S'),
                        settings.NOTIFICATIONS_SENDER,
                        destinatarios,
                        fail_silently=False,
                        html_message=html_content.replace('/static/', '%s/static/' % settings.GDOMAIN).replace('<h5>', '').replace('</h5>', '')
                        )
      except Exception as e:
        logging.error('IMPOSIBLE ENVIAR EL CORREO %s' % e)

  def get_history_model(self, *args, **kwargs):
    query_dict = kwargs.get('query_dict')
    model_track = query_dict.get('model_track')
    app_name_track = query_dict.get('app_name_track')
    pk = query_dict.get('pk')
    model_class = get_model(app_name_track, model_track)
    mobj = model_class.objects.get(pk=pk)
    hobjs = []
    for hobj in mobj.history.all().order_by('-pk'):
      hobjs.append(model_to_dict(hobj))
    return hobjs

  def get_lastchange_model(self, *args, **kwargs):
    query_dict = kwargs.get('query_dict')
    model_track = query_dict.get('model_track')
    app_name_track = query_dict.get('app_name_track')
    pk = query_dict.get('pk')
    model_class = get_model(app_name_track, model_track)
    mobj = model_class.objects.get(pk=pk)
    hobj = mobj.history.latest('history_date')
    return model_to_dict(hobj)

  def to_qdict(self, ddata):
        qdict = QueryDict(mutable=True)
        for k, d in ddata.items():
            #if isinstance(d, list):
            #    for a in d:
            #        qdict.update({k: a})
            #    continue
            qdict.update({k: d})
        return qdict

  def add_modelbulk(self, *args, **kwargs):
      rq = kwargs.get('request')
      ahora = datetime.datetime.now()
      qdict = kwargs.get('query_dict')
      bdata = json.loads(qdict.get('bdata'))
      rsp = {'rsp': []}
      for c in bdata:
          a = self.to_qdict(c)
          rsp['rsp'].append(self.add_model(*args, request=rq, query_dict=a))
      return rsp

  def add_model(self, *args, **kwargs):
      usergecos = kwargs.get('request').user.username
      ahora = datetime.datetime.now()
      qdict = kwargs.get('query_dict')
      pk = qdict.get('pk')
      model_app = qdict.get('model_app')
      model_name = qdict.get('model_name')
      modelobj = get_model(model_app, model_name)
      qdict = utilitarios.querydict_params(qdict.lists(), ['type_datatable', 'init', 'last', 'pq_datatype',
                                                           'pq_rpp', 'dparamquery', 'pq_curpage', 'pq_filter',
                                                           'pq_sort', 'lookup',
                                                           'app_name', 'model_name', 'module_name', 'class_name',
                                                           'method_name', 'pq_datatype', 'pk', 'model_app'
                                                           ])
      params = dict(qdict, **{'cargado_010': True, 'cargado_010_por_gecos': usergecos, 'cargado_010_fecha': ahora})
      #check and convert json fields
      #TODO: Separted this algorithm later
      for t in modelobj._meta.get_fields():
          if t.get_internal_type() == 'JSONField':
              v = params.get(t.name)
              if not v: continue
              if isinstance(v, str):
                  params[t.name] = json.loads(v)
      if pk:
          minsobj = modelobj.objects.get(pk=pk)
          if hasattr(minsobj, 'aprobado_050'):
              if minsobj.aprobado_050: return {'error': 'Imposible modificar'}
          modelobj.objects.filter(pk=pk).update(**params)
          minsobj = modelobj.objects.get(pk=pk)
          minsobj.save()
      else:
          modelobj.objects.create(**params)
      return {'exitos': 'Hecho'}

  def opts_model(self, *args, **kwargs):
      usergecos = kwargs.get('request').user.username
      ahora = datetime.datetime.now()
      ahoraf = ahora.strftime('%Y-%m-%d %H:%M:%S')
      qdict = kwargs.get('query_dict')
      model_app = qdict.get('model_app')
      model_name = qdict.get('model_name')
      pk = qdict.get('pk')
      op = qdict.get('op')
      da = qdict.get('da')
      checknop = qdict.get('checknop')
      checkfalse = qdict.getlist('checkfalse')
      checkcondi = qdict.getlist('checkcondi')
      checkdate = qdict.get('checkdate')
      justone = qdict.get('justone')
      mbase = get_model(model_app, model_name)
      modelobj = mbase.objects.get(pk=pk)
      opt = False
      opb = True
      if op == 'reinicializar':
          opt = 'reinicializar'
          op = 'aprobado_050'
      opobj = getattr(modelobj, op)
      opobj_fecha = getattr(modelobj, '{}_fecha'.format(op))
      if checkdate:
          if opobj:
              daysop = (ahora - opobj_fecha).days
              if daysop >= int(checkdate):
                  return {'error': 'Ya no es posible realizar la operacion, pasaron {} de la misma'.format(daysop)}
      if checkfalse:
          for a in checkfalse:
              if not getattr(modelobj, a): return {'error': 'Falta realizar el valor {}'.format(a)}
      if opt == 'reinicializar':
          fopts = ['verificado_044', 'verificado_045', 'aprobado_050']
          for f in fopts:
              setattr(modelobj, f, False)
              setattr(modelobj, '{}_por_gecos'.format(f), None)
              setattr(modelobj, '{}_fecha'.format(f), None)
          modelobj.save()
          return {'exitos': 'Reinicializado'}
      if checkcondi:
          for a in checkcondi:
              if getattr(modelobj, a): return {'error': 'No es posible cambiar el valor'}
      if da:
          funcobj = getattr(modelobj, da)
          funcobj()
          return {'exitos': 'Hecho'}

      if opobj:
          if checknop:
              if getattr(modelobj, checknop): return {'error': 'No puede quitar la marca'}
              else:
                  opb = False
                  ahoraf = None
                  usergecos = None
      if justone:
          if opobj: return {'error': 'Ya esta en el estado {}'.format(op)}
      setattr(modelobj, op, opb)
      setattr(modelobj, '{}_por_gecos'.format(op), usergecos)
      setattr(modelobj, '{}_fecha'.format(op), ahoraf)
      modelobj.save()
      return {'exitos': 'Hecho {} -> {}'.format(op, pk)}

  def update_foto_model(self, *args, **kwargs):
      qdict = kwargs.get('query_dict').dict()
      app_name = qdict.get('model_app')
      model_name = qdict.get('model_name')
      attr = qdict.get('attr')
      files = kwargs.get('files')
      pobj = files.get(attr)
      mcls = get_model(app_name, model_name)
      pk = qdict.get('pk')
      mobj = mcls.objects.get(pk=pk)
      setattr(mobj, attr, pobj)
      attrobj = getattr(mobj, attr)
      attrobj.save(pobj.name, pobj)
      mobj.save()
      return {'exitos': 'Hecho {}'.format(pk)}
