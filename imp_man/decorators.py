from django.contrib.auth import login
from django.contrib.auth.models import User
from django.conf import settings
import traceback
from django.shortcuts import HttpResponse,get_object_or_404
import datetime
import json
from web_sales_common.utilitarios import NetipaJSONEncoder as ntpjson
from imp_man.models import UserTrack
from raven.contrib.django.raven_compat.models import client as ravenclient

def save_trackobj(userobj, request):
    trackobj = {}
    if request.method == 'POST':
        data = request.POST.dict()
    if request.method == 'GET':
        data = request.GET.dict()
    trackobj.update({
        'fecha':datetime.datetime.now(),
        'username': userobj.username,
        'scheme': data.get('scheme'),
        'path': request.path,
        'path_info': request.path_info,
        'method': request.method,
        'encoding': request.encoding,
        'content_type': request.content_type,
        'content_params': request.content_params,
        'cookies': request.COOKIES,
        'content_length': request.META.get('CONTENT_LENGTH'),
        'content_type': request.META.get('CONTENT_TYPE'),
        'http_accept': request.META.get('HTTP_ACCEPT'),
        'http_accept_encoding': request.META.get('HTTP_ACCEPT_ENCODING'),
        'http_accept_language': request.META.get('HTTP_ACCEPT_LANGUAGE'),
        'http_host': request.META.get('HTTP_HOST'),
        'http_referer': request.META.get('HTTP_REFERER'),
        'http_user_agent': request.META.get('HTTP_USER_AGENT'),
        'query_string': request.META.get('QUERY_STRING'),
        'remote_addr': request.META.get('REMOTE_ADDR'),
        'remote_host': request.META.get('REMOTE_HOST'),
        'remote_user': request.META.get('REMOTE_USER'),
        'request_method': request.META.get('REQUEST_METHOD'),
        'server_name': request.META.get('SERVER_NAME'),
        'server_port': request.META.get('SERVER_PORT'),
        'params': data
    })
    UserTrack.objects.create(**trackobj)

def track_user(func):
    def wrapped_view(*args, **kwargs):
        request = args[0]
        try:
            userobj = request.user
        except:
            userobj = None
        if not userobj:
            return func(*args, **kwargs)
        try:
            save_trackobj(userobj, request)
        except: pass
        return func(*args, **kwargs)
    return wrapped_view

def mtrack_user(func):
    def wrapped_view(*args, **kwargs):
        request = args[1]
        try:
            userobj = request.user
        except:
            userobj = None
        if not userobj:
            return func(*args, **kwargs)
        try:
            save_trackobj(userobj, request)
        except:
            pass
        return func(*args, **kwargs)
    return wrapped_view

def mgrab_error_anonymous(func):
    def wrapped_view(*args, **kwargs):
        request = args[1]
        userobj = request.user
        response = HttpResponse(json.dumps({'error': 'Acceso Denegado'}, cls=ntpjson),
                                content_type='application/javascript')
        if request.POST.get('method_name') == 'set_auth':
            return func(*args, **kwargs)
        if request.POST.get('api_key'):
            api_keyobj = 'my_api'
            if not api_keyobj:
                return response
            if request.POST.get('username'):
                try:
                    uobj = User.objects.get(username=request.POST.get('username'))
                except:
                    return response
                login(request, uobj)
        else:
            if userobj.is_anonymous():
                return HttpResponse(json.dumps({'error': 'No puede ser anonimo'}, cls=ntpjson),content_type='application/javascript')
        return func(*args, **kwargs)
    return wrapped_view

def method_only_superuser(func):
    def wrapped_method(*args, **kwargs):
        request = args[1]
        if not request.is_superuser:
            return {'error': 'Sin privilegios'}
        return func(*args, **kwargs)
    return wrapped_method

def method_grab_error(func):
    def wrapped_method(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception:
            ravenclient.captureException()
            return {'error': 'No se pudo ejecutar el metodo'}
    return wrapped_method

def grab_error(func):
    def wrapped_view(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception:
            request = args[0]
            jsonp = request.POST.get('jsonp')
            ravenclient.captureException()
            response = {'error': 'Error {}'.format(traceback.format_exc(limit=9).splitlines()[-1])}
            if jsonp:
                jsondata = jsonp+'('+json.dumps(response, cls=ntpjson)+');'
                return HttpResponse(jsondata, content_type='application/javascript')
            return HttpResponse(json.dumps(response, cls=ntpjson), content_type='application/javascript')
    return wrapped_view

def mgrab_error_get(func):
    def wrapped_view(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception:
            request = args[1]
            jsonp = request.GET.get('jsonp')
            ravenclient.captureException()
            response = {'error': 'Error {}'.format(traceback.format_exc(limit=9).splitlines()[-1])}
            if jsonp:
                jsondata = jsonp+'('+json.dumps(response, cls=ntpjson)+');'
                return HttpResponse(jsondata, content_type='application/javascript')
            return HttpResponse(json.dumps(response, cls=ntpjson), content_type='application/javascript')
    return wrapped_view

def mgrab_error_post(func):
    def wrapped_view(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception:
            request = args[1]
            jsonp = request.POST.get('jsonp')
            ravenclient.captureException()
            response = {'error': 'Error {}'.format(traceback.format_exc(limit=9).splitlines()[-1])}
            if jsonp:
                jsondata = jsonp+'('+json.dumps(response, cls=ntpjson)+');'
                return HttpResponse(jsondata, content_type='application/javascript')
            return HttpResponse(json.dumps(response, cls=ntpjson), content_type='application/javascript')
    return wrapped_view

