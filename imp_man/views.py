# Create your views here.
# -*- coding: utf-8 -*-
import shutil
from raven.contrib.django.raven_compat.models import client as ravenclient
from django.contrib.auth import login
from PIL import Image
import math
import base64
from web_sales_common import utilitarios
import uuid
import codecs
from django.forms import model_to_dict
import datetime
from django.views.generic import View
from django.utils.safestring import mark_safe
import os
import re
from urllib.parse import unquote
from django.http import QueryDict
from django.shortcuts import render, HttpResponse
from django.db.models import Q
#imports outside
from django.contrib.auth.models import User
from imp_man.decorators import grab_error, mgrab_error_get, mgrab_error_post, mgrab_error_anonymous, \
    mtrack_user, track_user
from imp_man import format_cache
from web_sales_common import utilitarios
import json
# from django.db.models.loading import get_model, get_app
from django.apps import apps
get_model = apps.get_model
from django.core.files import File
from django.views.decorators.csrf import csrf_exempt
import importlib

@csrf_exempt
def default_page(request):
    if request.method == 'POST':    
        return HttpResponse('Esta es una aplicacion dinamica no muestra nada por defecto, hay que interactuar con la API')
    if request.method == 'GET':    
#        return HttpResponse('Esta es una aplicacion dinamica no muestra nada por defecto, hay que interactuar con la API')        
       h = 'hola mundo'
       return render(request, 'BaseDinamic.html', {'z': h})
@csrf_exempt
def static_page(request):
    if request.POST.get('html'):
        html = request.POST.get('html')
        return render(request, 'imp_man/StaticPage.html', {'html': mark_safe(html)})

def show_pdf_file(request, filename):
    try:
        wrapper = File(file('/%s' % filename))
    except Exception as e:
        return HttpResponse(json.dumps({'error': ['NO SE PUDO IMPRIMIR EL DOCUMENTO %s' % str(e)]}),
                            content_type='application/javascript' )
    response = HttpResponse(wrapper, content_type='application/image')
    response['Content-Disposition'] = 'attachment; filename="%s"' % filename.split('/')[-1]
    response['Content-Length'] = os.path.getsize('/%s' % filename)
    return response

def show_restructure_file(request, filename):
    try:
        wrapper = File(file('/%s' % filename))
    except Exception as e:
        return HttpResponse(json.dumps({'error': ['NO SE PUDO IMPRIMIR EL DOCUMENTO %s' % str(e)]}),
                            content_type='application/javascript' )
    response = HttpResponse(wrapper, content_type='text/plain')
    response['Content-Disposition'] = 'attachment; filename="%s"' % filename.split('/')[-1]
    response['Content-Length'] = os.path.getsize('/%s' % filename)
    return response

@csrf_exempt
def execute_operations(request):
    if request.method == 'POST':
        pk = request.POST.get('pk')
        app_name = request.POST.get('app_name')
        model_name = request.POST.get('model_name')
        module_name = request.POST.get('module_name')
        class_name = request.POST.get('class_name')
        method_name = request.POST.get('method_name')
        # list_related = request.POST.getlist('list_related')
        model_class = get_model(app_name, model_name)
        try:
            modelobj = model_class.objects.get(pk=pk)
        except:
            ravenclient.captureException()
            return HttpResponse(json.dumps({'error': ['EL REGISTRO NO EXISTE',
                              'SI ESTA VIENDO UNA TABLA DE DATOS ACTUALICELA POR FAVOR'
                              ]}), content_type='application/javascript')
        SbLModule = importlib.import_module(module_name)
        SbLClass = getattr(SbLModule, class_name)()
        SbLMethod = getattr(SbLClass, method_name)

        response = SbLMethod(request.user,
                             modelobj=modelobj,
                             query_dict=request.POST,
                             files=request.FILES
                             )

        return HttpResponse(json.dumps(response), content_type='application/javascript')

@csrf_exempt
#@grab_error
#@track_user
def execute_module(request):
    if request.method == 'GET':
        return HttpResponse(json.dumps({'error': 'Metodo equivocado'}), content_type='application/javascript')
    if request.method in ['POST', 'GET']:
        # print 'asdfasdfasdfasdf'
        module_name = request.POST.get('module_name')
        class_name = request.POST.get('class_name')
        method_name = request.POST.get('method_name')
        jsonp = request.POST.get('jsonp')
        SbLModule = importlib.import_module(module_name)
        SbLClass = getattr(SbLModule, class_name)()
        SbLMethod = getattr(SbLClass, method_name)
        response = SbLMethod(request.user,query_dict=request.POST, files=request.FILES, request=request)
        if jsonp:
            jsondata = jsonp+'('+json.dumps(response, cls=utilitarios.NetipaJSONEncoder)+');'
            return HttpResponse(jsondata, content_type='application/javascript')
        rspjs = json.dumps(response, cls=utilitarios.NetipaJSONEncoder)
        return HttpResponse(rspjs, content_type='application/javascript')

#Funcion generica que incluye las formas de realizar agregar, modificacion y anulacion, mediante pqgrid
##Los metodos lookups seguiran existiendo puesto que son una manera mas versatil de realizar trabajos por batchs
## pero esto es util para la generalidad de los casos
## esta generalidad tiene la de llamar metodos especificos por aplicacion, por ejemplo en la seccion de orders
class OperationRecord(View):
    #@mgrab_error_post
    #@mgrab_error_anonymous
    #@mtrack_user
    def post(self, request):
        ahora = datetime.datetime.now()
        userobj = request.user
        usergecos = userobj.username
        csuper = request.POST.get('csuper')
        app_name = request.POST.get('app_name')
        model_name = request.POST.get('model_name')
        module_name = request.POST.get('module_name')
        class_name = request.POST.get('class_name')
        method_name = request.POST.get('method_name')
        deletelist = json.loads(request.POST.get('deleteList', '[]'))
        updatelist = json.loads(request.POST.get('updateList', '[]'))
        oldlist = json.loads(request.POST.get('oldList', '[]'))
        addlist = json.loads(request.POST.get('addList', '[]'))
        saudit = request.POST.get('saudit', None)
        addlistold = json.loads(request.POST.get('addlist', '[]'))
        #una cuestion de legacy compatibilidad
        update_module_name = request.POST.get('update_module_name')        
        ndevice = False
        for data in addlistold:
            response = []
            if data.get('model_name') == 'NDevice':
                ndevice = True
            try:
                response.append(add_record(userobj, query_dict=data))
            except Exception as e:
                ravenclient.captureException()
                response.append({'error': e.message})
        cparams = {'cargado_010_fecha': ahora, 'cargado_010': True, 'cargado_010_por_gecos': request.user.username,
                   'verificado_045': False, 'aprobado_050': False
        }
        vparams = {'verificado_045_fecha': ahora, 'verificado_045': True, 'verificado_045_por_gecos': request.user.username,
                   'aprobado_050': False
        }
        wvparams = {'verificadofecha': ahora, 'verificadooperador': request.user.username}
        nparams = {'anulado_040_fecha': ahora, 'anulado_040': True, 'anulado_040_por_gecos': request.user.username,'aprobado_050': False, 'verificado_045': False}
        aparams = {'aprobado_050_fecha': ahora, 'aprobado_050': True,'aprobado_050_por_gecos': request.user.username,
                   'verificado_045': True}
        waparams = {'aprobadofecha': ahora, 'aprobadooperador': request.user.username}
        response = {
	    'deleteList': deletelist,
	    'updateList': updatelist,
	    'oldList': oldlist,
	    'addList': addlist,
            'rsp': []
        }
        if method_name:
            SbLModule = importlib.import_module(module_name)
            SbLClass = getattr(SbLModule, class_name)()
            SbLMethod = getattr(SbLClass, method_name)
            keys = request.POST.keys()
            qtmp = dict(map(lambda x: (x, request.POST.get(x)), request.POST.keys()))
            if csuper:
                if not request.user.is_superuser:
                    return HttpResponse(json.dumps({'error': 'Necesita ser superusuario'}), content_type='application/javascript')
            for krm in ['updateList', 'oldList', 'deleteList', 'addList']:
                qtmp.pop(krm, None)
            for olist, ulist in zip(oldlist, updatelist):
                ulist.update(qtmp)
                qdict = QueryDict(mutable=True)
                for k, d in ulist.items():
                    if isinstance(d, list):
                        for a in d:
                            qdict.update({k: a})
                        continue
                    qdict.update({k: d})
                qdict.update({'oldList': olist})
                response.get('rsp').append(SbLMethod(request.user,query_dict=qdict, files=request.FILES, request=request))
            #if you want a custom add method
            for alist in addlist:
                alist.update(qtmp)
                qdict = QueryDict(mutable=True)
                for k, d in alist.items():
                    if isinstance(d, list):
                        for a in d:
                            qdict.update({k: a})
                        continue
                    qdict.update({k: d})
                response.get('rsp').append(SbLMethod(request.user,query_dict=qdict, files=request.FILES, request=request))
        else:
            model_class = get_model(app_name, model_name)
            if csuper:
                if not request.user.is_superuser:
                    return HttpResponse(json.dumps({'error': 'Necesita ser superusuario'}), content_type='application/javascript')
            for alist in addlist:
                alist.pop('0', None)
                alist.update(cparams)
                model_class.objects.create(**alist)
                response.get('rsp').append({'exitos': 'Registro Creado'})
            for olist, ulist in zip(oldlist, updatelist):
                pk = ulist.get('_id')
                uolist = dict(map(lambda x: (x, ulist.get(x)), olist.keys()))
                uolist.pop('_id', None)
                if 'verificado_045' in olist.keys():
                    if int(olist.get('verificado_045')):
                        if model_class.objects.filter(pk=pk,verificado_045=True):
                            response.get('rsp').append({'error': 'Ya esta verificado'})
                            continue
                        uolist = dict(uolist, **vparams)

                if 'verificadofecha' in olist.keys():
                    if olist.get('verificadofecha'):
                        if not userobj.is_superuser:
                            response.get('rsp').append({'error': 'Sin autorizacion'})
                            continue
                        if model_class.objects.filter(pk=pk,verificadofecha__isnull=False):
                            response.get('rsp').append({'error': 'Ya esta aprobado'})
                            continue
                        uolist = dict(uolist, **wvparams)
                        
                if 'aprobado_050' in olist.keys():
                    if int(olist.get('aprobado_050')):
                        if not userobj.is_superuser:
                            response.get('rsp').append({'error': 'Sin autorizacion'})
                            continue
                        if model_class.objects.filter(pk=pk,aprobado_050=True):
                            response.get('rsp').append({'error': 'Ya esta aprobado'})
                            continue
                        uolist = dict(uolist, **aparams)

                if 'aprobadofecha' in olist.keys():
                    if olist.get('aprobadofecha'):
                        if not userobj.is_superuser:
                            response.get('rsp').append({'error': 'Sin autorizacion'})
                            continue
                        if model_class.objects.filter(pk=pk,aprobadofecha__isnull=False):
                            response.get('rsp').append({'error': 'Ya esta aprobado'})
                            continue
                        uolist = dict(uolist, **waparams)
                model_class.objects.filter(pk=pk).update(**uolist)
                modelobj = model_class.objects.get(pk=pk)
                if saudit:
                    if hasattr(model_class, 'cargado_010_fecha'):
                        modelobj.cargado_010 = True
                        modelobj.cargado_010_fecha = ahora
                        modelobj.cargado_010_por_gecos = usergecos
                    if hasattr(model_class, 'cargadofecha'):
                        modelobj.cargadofecha = ahora
                        modelobj.cargadooperador = usergecos
                modelobj.save()
                response.get('rsp').append({'exitos': 'Modificado {}'.format(pk)})
        for dlist in deletelist:
            if not dlist:
                continue
            pk = dlist.get('_id')
            if hasattr(model_class, 'aprobadofecha'):
                if model_class.objects.filter(pk=pk,aprobadofecha__isnull=False) and not userobj.is_superuser:
                    response.get('rsp').append({'error': 'Sin autorizacion'})
                    continue
            if hasattr(model_class, 'anulado_040'):                
                if model_class.objects.filter(pk=pk,anulado_040=True):
                    response.get('rsp').append({'error': 'Ya esta anulado'})
                    continue
                model_class.objects.filter(pk=pk).update(**nparams)                
            if hasattr(model_class, 'anuladofecha'):                
                if model_class.objects.filter(pk=pk,anuladofecha__isnull=False):
                    response.get('rsp').append({'error': 'Ya esta anulado'})
                    continue
                model_class.objects.filter(pk=pk).update(anuladofecha=ahora.strftime('%Y-%m-%d'), anuladooperador=usergecos)
            modelobj = model_class.objects.get(pk=pk)
            modelobj.save()
            response.get('rsp').append({'exitos': 'Anulado {}'.format(pk)})
        return HttpResponse(json.dumps(response, cls=utilitarios.NetipaJSONEncoder), content_type='application/javascript')

def add_record(*args, **kwargs):
    ahora = datetime.datetime.now()
    userobj = args[0]
    query_dict = kwargs.get('query_dict')
    # print query_dict
    app_name = query_dict.get('app_name')
    model_name = query_dict.get('model_name')
    modelobj = get_model(app_name, model_name)
    fields = set([ c.name for c in modelobj._meta.fields ])
    foreigns = set(query_dict).difference(fields)
    [query_dict.pop(c, None) for c in foreigns]
    [query_dict.pop(c, None) for c in ['app_name','model_name','module_name','class_name','method_name', 'pq_datatype']]
    usergecos = userobj.username
    params = dict(query_dict, **{'cargado_010': True,'cargado_010_por_gecos': usergecos,'cargado_010_fecha': ahora})
    modelobj.objects.create(**params)
    return {'exitos': 'Hecho'}

def pqueryfilter(pqfilter, q_search):
   params = {}
   cond_search = {
       "begin": '__istartswith',"contain": '__icontains',
       "notcontain": '__icontains',"equal": '',
       "notequal": '',"empty": '__isnull',
       "notempty": '__isnull',"end": '__iendswith',
       "less":'__lte',"great": '__gte',
       "between": '__range',"range": '__in',
       "regexp": '__regex',"notbegin": '__istartswith',
       "notend": '__iendswith',"lte": '__lte',"gte": '__gte'
   }
   for pq in pqfilter.get('data'):
       condition = pq.get('condition')
       csearch = cond_search.get(condition)
       field = pq.get('dataIndx').replace('__foreign', '')
       sfield = '{}{}'.format(field, csearch)
       if condition in ['notequal', 'equal']: sfield = field
       value = pq.get('value')
       value2 = pq.get('value2')
       if condition in ['contain'] and len(value.split(',')) > 1:
           sfield = '{}__in'.format(field)
           params[sfield] = []
           for v in value.split(','):
               params[sfield].append(v)
           continue
       if condition in ['notcontain', 'notend', 'notbegin', 'notequal']:
           q_search |= ~Q(**{sfield: value})
           continue
       if condition != 'between':
           params[sfield] = value
       else:
           params[sfield] = (value, value2)
   return params, q_search

def json_model(request):
    fm = format_cache.FormatCache()
    qdict = request.GET
    if request.method == 'POST': qdict = request.POST
    app_name = qdict.get('app_name').strip()
    model_name = qdict.get('model_name').strip()
    model_key = qdict.get('model_key').strip()
    method_call = qdict.get('method_call')
    querylookup = qdict.get('querylookup')
    if querylookup:
        querylookup = json.loads(qdict.get('querylookup'))
    distinct_value = qdict.getlist('distinct_value')
    init = qdict.get('init')
    last = qdict.get('last')
    order_field = qdict.getlist('order_field')
    type_datatable = qdict.get('type_datatable')
    dparamquery = qdict.get('dparamquery')
    jsonp = qdict.get('jsonp')
    model_class = get_model(app_name, model_name)
    getlist = qdict.lists()
    dbcon = qdict.get('dbcon', 'default')
    if dparamquery:
        pq_curpage = int(qdict.get('pq_curpage', 1))
        pq_rpp = int(qdict.get('pq_rpp', 100))
        params = utilitarios.querydict_params(qdict.lists(), ['type_datatable', 'init', 'last', 'pq_datatype',
                                                               'pq_rpp', 'dparamquery', 'pq_curpage', 'pq_filter',
                                                               'pq_sort',
                                                               'callback', 'jsonp', 'explicit_key', 'order_field'
                                                               ])
        q_search = utilitarios.querydict_args(getlist)
        if qdict.get('pq_filter'):
            pqfilter = json.loads(qdict.get('pq_filter'))
            auxparams, q_search = pqueryfilter(pqfilter, q_search)
            params.update(auxparams)
        order_by = []
        if qdict.get('pq_sort'):
            for order in json.loads(qdict.get('pq_sort')):
                okey = order.get('dataIndx')
                direc = order.get('dir')
                if direc == 'down':
                    okey = '-%s' % okey
                order_by.append(okey.replace('__foreign', ''))

        records = model_class.objects.using(dbcon).filter(*(q_search,), **params).count()
        if pq_curpage == 0:
            pq_curpage = 1
        skip_records = abs((pq_rpp * (pq_curpage - 1)))
        if skip_records >= records:
            pq_curpage = math.ceil(records / pq_rpp)
            skip_records = abs((pq_rpp * (pq_curpage - 1)))
        bdict = {
            'totalRecords': records,
            'curPage': pq_curpage,
            'data': []
        }
        if method_call == 'distinct':
            qs = model_class.objects.using(dbcon).filter(*(q_search,), **params).distinct(*distinct_value)
            bdict['totalRecords'] = qs.count()
        else:
            qs = model_class.objects.using(dbcon).filter(*(q_search,), **params).order_by(*order_by)
        for idx, aobj in enumerate(qs[skip_records:pq_rpp + skip_records]):
            md = fm.serial_model(aobj, model_key, explicit_key=True)
            md['nidx'] = idx+1
            bdict['data'].append(md)
        jsondata = json.dumps(bdict, cls=utilitarios.NetipaJSONEncoder)
        if jsonp:
            jsondata = jsonp + '(' + jsondata + ');'
        return HttpResponse(jsondata, content_type='application/javascript')
    modeldict = []
    params = utilitarios.querydict_params(qdict.lists(),
                                          ['type_datatable', 'init', 'last', 'pq_datatype', 'callback', 'jsonp',
                                           'explicit_key', 'order_field'])
    q_search = utilitarios.querydict_args(qdict.lists())
    if method_call:
        if method_call == 'querylookup':
            # clean empty values
            lookup = {}
            for kk, d in querylookup.items():
                if not d:
                    continue
                if isinstance(d, str):
                    if d.strip() == '':
                        continue
                lookup[kk] = d
            qs = model_class.objects.using(dbcon).filter(**lookup)
            for idx, aobj in enumerate(qs):
                md = fm.serial_model(aobj, model_key, explicit_key=True)
                md['nidx'] = idx+1
                modeldict.append(md)
            jsondata = json.dumps(modeldict, cls=utilitarios.NetipaJSONEncoder)
            if jsonp:
                jsondata = jsonp + '(' + jsondata + ');'
            return HttpResponse(jsondata, content_type='application/javascript')

        if method_call == 'distinct':
            resultiter = model_class.objects.using(dbcon).filter(*(q_search,), **params).distinct(*distinct_value)
            for idx, aobj in enumerate(resultiter):
                md = fm.serial_model(aobj, model_key, explicit_key=True)
                md['nidx'] = idx+1
                modeldict.append(md)
            if type_datatable:
                mdictl = len(modeldict)
                modeldict = {
                    "draw": 1,
                    "recordsTotal": mdictl,
                    "recordsFiltered": mdictl,
                    "data": modeldict
                }

            jsondata = json.dumps(modeldict, cls=utilitarios.NetipaJSONEncoder)
            if jsonp:
                jsondata = jsonp + '(' + jsondata + ');'
            return HttpResponse(jsondata, content_type='application/javascript')

        if method_call == 'mlimit':
            resultiter = model_class.objects.using(dbcon).filter(*(q_search,), **params)[int(init):int(last)]
            for idx, aobj in enumerate(resultiter):
                md = fm.serial_model(aobj, model_key, explicit_key=True)
                md['nidx'] = idx+1
                modeldict.append(md)
            if type_datatable:
                mdictl = len(modeldict)
                modeldict = {
                    "draw": 1,
                    "recordsTotal": mdictl,
                    "recordsFiltered": mdictl,
                    "data": modeldict
                }
            jsondata = json.dumps(modeldict, cls=utilitarios.NetipaJSONEncoder)
            if jsonp:
                jsondata = jsonp + '(' + jsondata + ');'
            return HttpResponse(jsondata, content_type='application/javascript')

        if method_call == 'order_by':
            resultiter = model_class.objects.using(dbcon).filter(*(q_search,), **params).order_by(*order_field)
            for idx, aobj in enumerate(resultiter):
                md = fm.serial_model(aobj, model_key, explicit_key=True)
                md['nidx'] = idx+1
                modeldict.append(md)
            if type_datatable:
                mdictl = len(modeldict)
                modeldict = {
                    "draw": 1,
                    "recordsTotal": mdictl,
                    "recordsFiltered": mdictl,
                    "data": modeldict
                }
            jsondata = json.dumps(modeldict, cls=utilitarios.NetipaJSONEncoder)
            if jsonp:
                jsondata = jsonp + '(' + jsondata + ');'
            return HttpResponse(jsondata, content_type='application/javascript')

        if method_call == 'limit_order_by':
            resultiter = model_class.objects.using(dbcon).filter(*(q_search,),
                                                                 **params).order_by('-%s' % order_field[0])[
                         int(init):int(last)]
            for idx, aobj in enumerate(resultiter):
                md = fm.serial_model(aobj, model_key, explicit_key=True)
                md['nidx'] = idx+1
                modeldict.append(md)
            if type_datatable:
                mdictl = len(modeldict)
                modeldict = {
                    "draw": 1,
                    "recordsTotal": mdictl,
                    "recordsFiltered": mdictl,
                    "data": modeldict
                }
            jsondata = json.dumps(modeldict, cls=utilitarios.NetipaJSONEncoder)
            if jsonp:
                jsondata = jsonp + '(' + jsondata + ');'
            return HttpResponse(jsondata, content_type='application/javascript')

        if method_call == 'getlast':
            resultiter = model_class.objects.using(dbcon).filter(*(q_search,), **params).order_by(
                '-%s' % order_field[0])
            if resultiter:
                fs = fm.serial_model(resultiter[0], model_key, explicit_key=True)
                jsondata = json.dumps(fs, cls=utilitarios.NetipaJSONEncoder)
                if jsonp:
                    jsondata = jsonp + '(' + jsondata + ');'
                return HttpResponse(jsondata, content_type='application/javascript')
            for idx, aobj in enumerate(resultiter):
                md = fm.serial_model(aobj, model_key, explicit_key=True)
                md['nidx'] = idx+1
                modeldict.append(md)
            if type_datatable:
                mdictl = len(modeldict)
                modeldict = {
                    "draw": 1,
                    "recordsTotal": mdictl,
                    "recordsFiltered": mdictl,
                    "data": modeldict
                }
            jsondata = json.dumps(modeldict, cls=utilitarios.NetipaJSONEncoder)
            if jsonp:
                jsondata = jsonp + '(' + jsondata + ');'
            return HttpResponse(jsondata, content_type='application/javascript')

        if method_call == 'getpks':
            qset = list(
                model_class.objects.using(dbcon).filter(*(q_search,), **params).values_list('pk', flat=True).order_by(
                    'pk'))
            jsondata = json.dumps({method_call: qset}, cls=utilitarios.NetipaJSONEncoder)
            if jsonp:
                jsondata = jsonp + '(' + jsondata + ');'
            return HttpResponse(jsondata, content_type='application/javascript')

        qset = model_class.objects.using(dbcon).filter(*(q_search,), **params)
        mreps = getattr(qset, method_call)()
        jsondata = json.dumps({method_call: mreps}, cls=utilitarios.NetipaJSONEncoder)
        if jsonp:
            jsondata = jsonp + '(' + jsondata + ');'
        return HttpResponse(jsondata, content_type='application/javascript')
    for idx, aobj in enumerate(model_class.objects.using(dbcon).filter(*(q_search,), **params)):
        md = fm.serial_model(aobj, model_key, explicit_key=True)
        md['nidx'] = idx+1
        modeldict.append(md)
    if type_datatable:
        mdictl = len(modeldict)
        modeldict = {
            "draw": 1,
            "recordsTotal": mdictl,
            "recordsFiltered": mdictl,
            "data": modeldict
        }
    jsondata = json.dumps(modeldict, cls=utilitarios.NetipaJSONEncoder)
    if jsonp:
        jsondata = jsonp + '(' + jsondata + ');'
    return HttpResponse(jsondata, content_type='application/javascript')

class JsonModel(View):
    #@mgrab_error_get
    #@mtrack_user
    def get(self, request):
        return json_model(request)

    #@mgrab_error_post
    #@mtrack_user
    def post(self, request):
        return json_model(request)

def dyn_template(tr, request):
    qdict = getattr(request, tr)
    template_name = qdict.get('template')
    query_dict = qdict.dict()
    app_name = qdict.get('app_name')
    model_name = qdict.get('model_name')
    explicit_key = qdict.get('explicit_key')
    multipleobjs = qdict.get('multipleobjs')
    dinamic_attrs = qdict.get('dinamic_attrs')
    dinamic_attrsb64 = qdict.get('dinamic_attrsb64')
    serial_model = qdict.get('serial_model')
    check_login = qdict.get('check_login')
    free_login = qdict.get('free_login')
    dbcon = qdict.get('dbcon', 'default')
    standalone = qdict.get('standalone')
    pk = qdict.get('pk')
    uid = int(uuid.uuid4())
    query_dict.update({'uuid': uid})
    if qdict.get('template_name'):
        template_name = qdict.get('template_name')
    #if not free_login:
    #    if check_login or standalone:
    #        if request.user.is_anonymous():
    #            return render(request, 'dashboard/LoginUi.html', {})
    #        if not request.user.userprofile.espersonalactivo:
    #            return render(request, 'dashboard/AccessDenied.html', {})
    fm = format_cache.FormatCache()
    if dinamic_attrs:
        query_dict.update(json.loads(unquote(dinamic_attrs)))
    if dinamic_attrsb64:
        datab64 = base64.b64decode(unquote(dinamic_attrsb64))
        query_dict.update(json.loads(datab64))
    if app_name and model_name:
        model_class = get_model(app_name, model_name)
        if multipleobjs:
            params = utilitarios.querydict_params(qdict.lists(),
                                                  ['multipleobjs', 'template', 'dinamic_attrs', 'standalone'])
            modelobjs = model_class.objects.using(dbcon).filter(**params)
            query_dict.update({'modelobjs': modelobjs})
            if serial_model:
                serial_model = [fm.serial_model(m, serial_model) for m in modelobjs]
                query_dict.update({'mdicts': json.dumps(serial_model, cls=utilitarios.NetipaJSONEncoder)})
        else:
            msearch = {'pk': pk}
            if query_dict.get('cuget'):
                msearch = {query_dict.get('identificador'): pk}
            modelobj = model_class.objects.using(dbcon).get(**msearch)
            mdict = model_to_dict(modelobj)
            for field in modelobj._meta.fields:
                if field.get_internal_type() == 'FileField':
                    fieldobj = getattr(modelobj, field.name)
                    if fieldobj:
                        mdict[field.name] = getattr(fieldobj, 'url')
                    else:
                        mdict[field.name] = '/static/img/null'
            modeldict = json.dumps(mdict, cls=utilitarios.NetipaJSONEncoder)
            query_dict.update({'modelobj': modelobj, 'modeldict': modeldict})
            if serial_model:
                if explicit_key:
                    serial_model = fm.serial_model(modelobj, serial_model, explicit_key=True)
                else:
                    serial_model = fm.serial_model(modelobj, serial_model)
                query_dict.update({'mdict': json.dumps(serial_model, cls=utilitarios.NetipaJSONEncoder)})
    if standalone:
        ftemplate_name = '{}/templates/{}'.format(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            template_name
        )
        tmptemplate = ftemplate_name.replace('.html', 'TMP.html')
        tstr = codecs.open(ftemplate_name, 'r', encoding='utf-8')
        rout = "{% extends 'BaseStandAlone.html' %}{% block scontent %}" + tstr.read() + "{% endblock %}"
        tstr = codecs.open(tmptemplate, 'w', encoding='utf-8')
        tstr.write(rout)
        tstr.close()
        template_name = template_name.replace('.html', 'TMP.html')
        query_dict.update({'standalone': True})
    return render(request, template_name, query_dict)

class DinamicTemplate(View):
    #@mgrab_error_get
    #@mtrack_user
    def get(self, request):
        return dyn_template('GET',request)

    def post(self, request):
        return dyn_template('POST',request)

class HistoryModel(View):
    def get(self, request):
        app_name = request.GET.get('app_name').strip()
        model_name = request.GET.get('model_name').strip()
        model_class = get_model(app_name, model_name)
        params = utilitarios.querydict_params(request.GET.lists(), [])
        modelobj = model_class.objects.get(**params)
        historyobj = modelobj.field_history.all().order_by('-pk')
        return render(request, 'imp_man/HistoryModel.html', {'historyobj': historyobj, 'pk': modelobj.pk })

@csrf_exempt
#@grab_error
#@track_user
def sbupload_file(request):
    if request.method == 'GET':
       image_pk = request.GET.get('image_pk')
       resize = request.GET.get('resize')
       fupload = request.FILES['upload']
       fupload_s = request.FILES['file']
       updir_s = request.FILES['updir']
    if request.method == 'POST':
        image_pk = request.POST.get('image_pk')
        resize = request.POST.get('resize')
        fupload = request.FILES['upload']
        fupload_s = request.FILES['file']
        updir_s = request.FILES['updir']
    if not image_pk:
        image_pk = fupload.name
    if not fupload:
        fupload = fupload_s
    fname = re.sub('[^\.a-zA-Z0-9_]','', image_pk)
    updir = '/var/www/html/webapps/media/imp_man/sbupload'
    if updir_s:
        updir = updir_s
    fpath = '{}/{}'.format(updir, fname)
    frpath = '{}/r{}'.format(updir, fname)
    file_url =  utilitarios.url_viewfull('show_pdf_file', filename=frpath)
    data = {"fileName":fname, "uploaded":1,"url":file_url}    
    with open(fpath, 'wb+') as destination:
        for chunk in fupload.chunks():
            destination.write(chunk)
    imgobj = Image.open(fpath)
    size =  os.path.getsize(fpath)
    mbsize = size*0.000001
    try:os.remove(frpath)
    except:pass
    if mbsize <= 2 and not resize:
        try:shutil.copy2(fpath, frpath)
        except: pass
        return HttpResponse(json.dumps(data), content_type='application/javascript')
    SIZE = (250, 250)
    imgobj.thumbnail(SIZE)
    imgobj.save(frpath, 'png', quality=20, optimize=True)
    return HttpResponse(json.dumps(data), content_type='application/javascript')
