# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import pgk_master

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
from imp_man.views import DinamicTemplate
from imp_man.views import dyn_template
from web_sales_common import utilitarios
import json
# from django.db.models.loading import get_model, get_app
from django.apps import apps
get_model = apps.get_model
from django.core.files import File
from django.views.decorators.csrf import csrf_exempt
import importlib

from pgk_master.models import Hogar

# Create your views here.

@csrf_exempt
def hogares_page(request):

    hogares = Hogar.objects.all().order_by()

    return render(request, 'pgk_master/HogaresUI.html', {'hogares': hogares})
    #if request.method == 'POST':    
     #   return HttpResponse('Esta es la pagina de hogares')
        #posts = pgk_master.objects.all().order_by('-created')
        #return render(request, 'pgk_master/HogaresUI.html', {'posts': posts})

    #if request.method == 'GET':    
     #   return HttpResponse('Esta es la pagina de hogares')  


