from django.contrib.auth import authenticate, login
from django.core import signing
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.template.response import TemplateResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View

# @csrf_exempt
# def login_ca(request):
#     if request.method == 'GET':
#         if request.GET.get('us_t'):
#             username = request.GET.get('us_t').split('|||')[0]
#             password = request.GET.get('us_t').split('|||')[-1]
#             username = signing.loads(username, key='GENOMA')
#             password = signing.loads(password, key='GENOMA')
#             usuario = authenticate(username=username, password=password)
#             if usuario is not None:
#                 login(request, usuario)
#                 return HttpResponseRedirect(reverse('administrador_ventas'))
#             else:
#                 return render(request, 'acceso_ldap/login_ldap.html', {'error': 'ACCESO DENEGADO'})
#         else:
#             return render(request, 'acceso_ldap/login_ldap.html', {'error': 'ACCESO DENEGADO'})

class LoginCaView(View):
    """Displays the details of a BlogPost"""
    app_dasboard = 'app_dasboard'
    get_params = None
    post_params = None

    def get(self, request):
        if request.GET.get('us_t'):
            username = request.GET.get('us_t').split('|||')[0]
            password = request.GET.get('us_t').split('|||')[-1]
            username = signing.loads(username, key='GENOMA')
            password = signing.loads(password, key='GENOMA')
            usuario = authenticate(username=username, password=password)

            if usuario is not None:
                login(request, usuario)
                # return HttpResponseRedirect(reverse('administrador_ventas'))
                if self.get_params:
                    nurl = '%s%s' % (reverse(self.app_dasboard), self.get_params)
                    return HttpResponseRedirect(nurl)
                else:
                    return HttpResponseRedirect(reverse(self.app_dasboard))
            else:
                return render(request, 'acceso_ldap/login_ldap.html', {'error': 'ACCESO DENEGADO'})
        else:
            return render(request, 'acceso_ldap/login_ldap.html', {'error': 'ACCESO DENEGADO'})


        # return TemplateResponse(request, self.get_template_name(),
        #                         self.get_context_data())

    # def get_template_name(self):
    #     """Returns the name of the template we should render"""
    #     return "acceso_ldap/login_ldap.html"

    # def get_context_data(self):
    #     """Returns the data passed to the template"""
    #     return {
    #         "blogpost": self.get_object(),
    #     }
    # def get_object(self):
    #     """Returns the BlogPost instance that the view displays"""
    #     return get_object_or_404(BlogPost, pk=self.kwargs.get("pk"))
