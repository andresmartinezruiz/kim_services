from django.views.decorators.csrf import csrf_exempt
from django.conf.urls import url
from imp_man.views import show_restructure_file, static_page, show_pdf_file, execute_operations, execute_module, \
    JsonModel,  HistoryModel , DinamicTemplate, OperationRecord    
from django.views.decorators.gzip import gzip_page

urlpatterns = (
    url(r'^static_page/', static_page, name='static_page'),
    url(r'^show_pdf_file/(?P<filename>[\w|\/\.]+)/$', show_pdf_file, name='show_pdf_file'),
    url(r'^show_restructure_file/(?P<filename>[\w|\/\.\s]+)/$', show_restructure_file, name='show_restructure_file'),
    url(r'^operation_record/$', csrf_exempt(OperationRecord.as_view()), name='operation_record'),
    url(r'^execute_operations', execute_operations, name='execute_operations'),
    url(r'^execute_module', execute_module, name='execute_module'),
    url(r'^get_jsonmodel/$', gzip_page(csrf_exempt(JsonModel.as_view())), name='get_jsonmodel'),
    url(r'^dinamic_template/$', gzip_page(csrf_exempt(DinamicTemplate.as_view())), name='dinamic_template'),
    url(r'^history_model/$',HistoryModel.as_view(), name='history_model'),
)
