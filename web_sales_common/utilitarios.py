#coding: utf-8
import arrow
from django.db.models.fields.files import ImageFieldFile, FieldFile
from django.db.models import Q, F
from django.forms import model_to_dict
from django.utils.timezone import is_aware
import uuid
from base64 import urlsafe_b64encode as encode
import json
import base64
from django.utils.safestring import mark_safe
from django.conf import settings
import datetime
import re
from decimal import Decimal
import copy

def querydict_condi(qd):
    csearch = Q()
    for f, v in zip(qd.getlist('fields_and'), qd.getlist('values_and')):
        p = {f: v}
        csearch &= Q(**p)
    for f, v in zip(qd.getlist('fields_or'), qd.getlist('values_or')):
        p = {f: v}
        csearch |= Q(**p)
    return csearch

def querydict_condi_nega(qd):
    csearch = Q()
    for f, v in zip(qd.getlist('fields_or_nega'), qd.getlist('values_or_nega')):
        p = {f: v}
        csearch |= ~Q(**p)

    for f, v in zip(qd.getlist('fields_and_nega'), qd.getlist('values_and_nega')):
        p = {f: v}
        csearch &= ~Q(**p)
    return csearch

def querydict_args(q):
    q_search = Q()
    tmp_p = {}
    for l in q:
        or_q = l[0]
        if not l[1]:
            continue
        if or_q.startswith('or_'):
            if or_q.startswith('or__f__'):
                tmp_p.update(setf_querie(or_q.replace('or__', ''), l[1][0]))
                q_search |= Q(**tmp_p)
                continue
            key =  or_q.replace('or_', '')
            if len(l[1]) > 1 and re.search('icontains', or_q):
                # tmp_p.update({'%s__in' % key: l[1] })
                for item in l[1]:
                    q_search |= Q(**{key: item})
                continue
            elif len(l[1]) > 1 and not re.search('icontains', or_q):
                tmp_p.update({'%s__in' % key: l[1] })
            else:
                tmp_p = { key: l[1][0] }
            q_search |= Q(**tmp_p)
        if or_q.startswith('nor_'):
            if or_q.startswith('nor__f__'):
                tmp_p.update(setf_querie(or_q.replace('nor__', ''), l[1][0]))
                q_search |= ~Q(**tmp_p)
                continue
            key =  or_q.replace('nor_', '')
            if len(l[1]) > 1:
                tmp_p.update({'%s__in' % key: l[1] })
            else:
                tmp_p = { key: l[1][0] }
            q_search |= ~Q(**tmp_p)
    return q_search

def querydict_params(q, exclude):
    lexc = ['columns', 'start', 'draw', 'length', 'search','order',r'\b-\b', 'filtro', r'\b_\b',
            'from_palletl', 'interface', 'demo', 'key_name', 'app_name',
            'model_name', 'model_key', 'api_key', 'method_call', '^nor_', '^or_',
            'distinct_value', 'class_name', 'method_name', 'app_name', 'module_name', 'serial_model',
            'type_datatable', 'init', 'last', 'pq_datatype', 'pq_rpp', 'dparamquery', 'pq_curpage',
            'pq_filter', 'pq_sort', 'lookup','callback', 'jsonp', 'explicit_key', 'order_field',
            'mcache', 'sckey', 'clzs', 'qcache','type_datatable', 'init', 'last', 'pq_datatype',
            'pq_rpp', 'dparamquery', 'pq_curpage', 'pq_filter','pq_sort','callback', 'jsonp',
            'explicit_key', 'order_field',
            'type_datatable', 'init', 'last', 'pq_datatype',
            'pq_rpp', 'dparamquery', 'pq_curpage', 'pq_filter',
            'pq_sort', 'lookup',
            'app_name', 'model_name', 'module_name', 'class_name',
            'method_name', 'pq_datatype', 'model_app'
    ]
    lexc.extend(exclude)
    params = {}
    lexc = map(str, lexc)
    rsearch = '|'.join(lexc)
    for l in q:
        key = l[0]
        # print key, l[1]
        if re.search(rsearch, key):
            continue
        if isinstance(key, str):
            if key.strip() == '':
                continue
        key = key.replace('[]', '')
        if not l[1]:
            continue
        if len(l[1]) > 1:
            params.update({'%s__in' % key: l[1] })
        else:
            if isinstance(l[1][0], bool):
                params.update({key:  l[1][0] })
                continue
            if isinstance(l[1][0], list):
                params.update({key:  l[1][0] })
                continue            
            if isinstance(l[1][0], str):
                if len(l[1][0].split('|')) > 1:
                    params.update({'%s__in' % key: l[1][0].split('|') })
                    continue
                if l[1][0].strip() == '':
                    continue
                if l[1][0].strip() == 'on':
                    params.update({key: True })
                    continue
            # implements F queries
            if key.startswith('f__'):
                params.update(setf_querie(key, l[1][0]))
                continue
            try:
                params.update({key: int(l[1][0].strip())})
            except:
                params.update({key: l[1][0].strip()})
    return params

def setf_querie(key, field):
    t, con, kfield = key.split('__')
    comp_field = F(field)
    rdict = {}
    if con == 'equal':
        rdict[kfield] = comp_field
    if con == 'gt':
        rdict['{}__gt'.format(kfield)] = comp_field
    if con == 'lt':
        rdict['{}__lt'.format(kfield)] = comp_field
    if con == 'gte':
        rdict['{}__gte'.format(kfield)] = comp_field
    if con == 'lte':
        rdict['{}__lte'.format(kfield)] = comp_field
    # print rdict
    return rdict


def dict_change_none(data, **kwargs):
    t_data = copy.deepcopy(data)
    vnone = '0'
    if kwargs.get('fkey'):
        vnone = {}
    for k, v in t_data.items():
        if isinstance(v, str):
            if v.strip() == '':
                data[k] = 'ND'
                continue
        if v == None:
            data[k] = vnone
            continue
    return data


class NetipaJSONEncoder(json.JSONEncoder):
    """
    JSONEncoder subclass that knows how to encode date/time, decimal types and UUIDs.
    """
    def default(self, o):
        # See "Date Time String Format" in the ECMA-262 specification.
        if isinstance(o, datetime.datetime):
            r = o.strftime('%Y-%m-%d %H:%M:%S')
            # r = o.isoformat()
            # if o.microsecond:
            #     r = r[:23] + r[26:]
            # if r.endswith('+00:00'):
            #     r = r[:-6] + 'Z'
            return r
        elif isinstance(o, datetime.date):
            # return o.isoformat()
            try:
                return o.strftime('%Y-%m-%d')
            except:
                return datetime.date.today().strftime('%Y-%m-%d')
        elif isinstance(o, datetime.time):
            if is_aware(o):
                raise ValueError("JSON can't represent timezone-aware times.")
            r = o.isoformat()
            if o.microsecond:
                r = r[:12]
            return r
        elif isinstance(o, arrow.arrow.Arrow):
            try:
                return o.strftime('%Y-%m-%d')
            except:
                return datetime.date.today().strftime('%Y-%m-%d')
        elif isinstance(o, Decimal):
            return float(o)
        elif isinstance(o, uuid.UUID):
            return str(o)
        elif isinstance(o, ImageFieldFile):
            try:
                return base64.b64encode(o.read())
            except:
                return ''

        elif isinstance(o, FieldFile):
            try:
                return base64.b64encode(o.read())
            except:
                return ''

        else:
            return super(NetipaJSONEncoder, self).default(o)


def seconds_toh(value):
    minutes, seconds = divmod(value, 60)
    hours, minutes = divmod(minutes, 60)
    days, hours = divmod(hours, 24)
    return '{:,.0f}:{:,.0f}:{:,.0f}'.format(hours, minutes, seconds)


def set_cache_method(cfkey, method, modelobj):
    mresult = getattr(modelobj, method)()
    return mresult

def set_cache_fmethod(cfkey, ffields, modelobj):
    foreign, method = ffields.split('__')
    foreignmodel = getattr(modelobj, foreign)
    if not foreignmodel: return None
    foreignmethod = getattr(foreignmodel, method)()
    return foreignmethod

def set_cache_ffield(cfkey, ffields, modelobj):
    if len(ffields.split('__')) == 2:
        foreign, field = ffields.split('__')
        foreignmodel = getattr(modelobj, foreign, 'ND')
        foreignfield = getattr(foreignmodel, field, 'ND')
    elif len(ffields.split('__')) == 4:
        foreign, field, submodel, subfield = ffields.split('__')
        foreignmodel = getattr(modelobj, foreign, 'ND')
        foreignmodel2 = getattr(foreignmodel, field, 'ND')
        foreignmodel3 = getattr(foreignmodel2, submodel)
        # foreignmodel2 = getattr(foreignmodel, submodel, 'ND')
        foreignfield = getattr(foreignmodel3, subfield, 'ND')
    else:
        foreign, field, subfield = ffields.split('__')
        foreignmodel = getattr(modelobj, foreign, 'ND')
        lforeignfield = getattr(foreignmodel, field, 'ND')
        foreignfield = getattr(lforeignfield, subfield, 'ND')
    return foreignfield

def serial_model(modelobj, **kwargs):
    fkey = kwargs.pop('fkey', None)
    name = modelobj._meta.model_name
    params = kwargs.get(name, {})
    ukey = name
    if kwargs.get('explicit_key'):
        params = kwargs.get(kwargs.get('keyname'), {})
        kwargs.pop('explicit_key', None)
        ukey = kwargs.pop('keyname', None)
    if name in kwargs.get('field_ignore', []):
        return {}
    opts = modelobj._meta.fields
    fields = params.get('fields', [])
    modeldict = model_to_dict(modelobj, fields=fields)
    modeldict = dict_change_none(modeldict, fkey=fkey)
    cache_fields = params.get('cache_fields', {})
    for method in params.get('methods', []):
        ctmp = cache_fields.get(method, {})
        cfkey = ctmp.get('key')
        if not cfkey:
            cfkey = '{}{}{}'.format(modelobj.pk,ukey, method)
        # print cfkey
        modeldict[method] = set_cache_method(cfkey, method, modelobj)

    for ffields in params.get('foreign_methods', []):
        ctmp = cache_fields.get(ffields, {})
        cfkey = ctmp.get('key')
        if not cfkey:
            cfkey = '{}{}{}'.format(modelobj.pk,ukey, ffields)
        # print cfkey
        modeldict[ffields] = set_cache_fmethod(cfkey, ffields, modelobj)
        
    for ffields in params.get('foreign_fields', []):
        ctmp = cache_fields.get(ffields, {})
        cfkey = ctmp.get('key')
        if not cfkey:
            cfkey = '{}{}{}'.format(modelobj.pk,ukey, ffields)
        # print cfkey
        modeldict[ffields] = set_cache_ffield(cfkey, ffields, modelobj)
    #lo demas por recursion ya entra en el cache de los metodos y los foreigns_fields
    for m in opts:
        if m.is_relation:
            try:
                foreignkey = getattr(modelobj, m.name)
            except Exception as e:
                modeldict[m.name] = {}
                continue
            else:
                if foreignkey and (m.name in fields):
                    try:
                        modeldict[m.name] = serial_model(foreignkey, fkey=True, **kwargs)
                    except Exception as e:
                        modeldict[m.name] = {}
                        continue
                else:
                    modeldict[m.name] = {}
    for relate, rmodel  in params.get('relates', {}).items():
        rattr = getattr(modelobj, relate)
        for rfieldn, relate_opt in rmodel.items():
            rfield = getattr(rattr, rfieldn)
            method_call = relate_opt.get('method_call')
            rfield_params = relate_opt.get('params')
            if method_call:
               resultobj = getattr(rfield, method_call)()
               try:
                 kname = '%s_%s' % (rfieldn.replace('_set', ''), method_call)
               except Exception as e:
                 modeldict[kname] = {}
               else:
                modeldict[kname] = {}
                if resultobj:
                    modeldict[kname] = serial_model(resultobj, **kwargs)
            else:
               kname = '%s_%s' % (rfieldn.replace('_set', ''), 'filter')
               modeldict[kname] = [ serial_model(relateobj, **kwargs)  for relateobj in rfield.filter(**rfield_params) ]
    for accesor, accesor_opt  in params.get('accesor', {}).items():
        rfield = getattr(modelobj, accesor)
        method_call = accesor_opt.get('method_call')
        field_specific = accesor_opt.get('field_specific')
        field_explicit_key = accesor_opt.get('field_explicit_key')
        accesor_explicit_key = accesor_opt.get('accesor_explicit_key')
        rfield_params = accesor_opt.get('params')
        # print field_specific
        if field_specific and field_explicit_key:
            for f, fkey in zip(field_specific, field_explicit_key):
                modeldict[f] = [ serial_model(getattr(relateobj, f), keyname=fkey,
                                              explicit_key=True, **kwargs)
                                 for relateobj in rfield.filter(**rfield_params) ]
            continue
        if field_specific:
            for f in field_specific:
                modeldict[f] = [ serial_model(getattr(relateobj, f),**kwargs)
                                 for relateobj in rfield.filter(**rfield_params) ]
            continue
        if accesor_explicit_key:
           kname = '%s_%s' % (accesor.replace('_set', ''), 'filter')
           modeldict[kname] = [ serial_model(relateobj, keyname=accesor_explicit_key, explicit_key=True, **kwargs)
                                for relateobj in rfield.filter(**rfield_params) ]
           continue
        if method_call:
           resultobj = getattr(rfield, method_call)()
           # kname = '%s_%s' % (rfieldn.replace('_set', ''), method_call)
           kname = '%s_%s' % (accesor.replace('_set', ''), method_call)
           modeldict[kname] = {}
           if resultobj:
              modeldict[kname] = serial_model(resultobj, **kwargs)
           continue
        else:
           kname = '%s_%s' % (accesor.replace('_set', ''), 'filter')
           modeldict[kname] = [ serial_model(relateobj, **kwargs)  for relateobj in rfield.filter(**rfield_params) ]

    for oto in params.get('one_to_one', []):
        otoattr = getattr(modelobj, oto, None)
        if otoattr:
            modeldict[oto] = serial_model(otoattr, **kwargs)
    for oto in params.get('headers', []):
        otoattr = getattr(modelobj, oto.replace('_nac', ''), None)
        modeldict[oto] = serial_model(otoattr, explicit_key=True, keyname=oto, **kwargs)
    for oto in params.get('subexplicit_key', []):
        otoattr = getattr(modelobj, oto.get('field'), None)
        modeldict[oto['field']] = serial_model(otoattr, explicit_key=True, keyname=oto.get('key'), **kwargs)
    return modeldict
