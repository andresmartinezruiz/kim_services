__author__ = 'peter'
import django_tables2 as tables
from django.utils.formats import mark_safe
from web_sales_common import utilitarios

class CheckAllColumn(tables.Column):
    def __init__(self, *args, **kwargs):
        self.class_check = kwargs.pop('class_check', None)
        self.class_uncheck = kwargs.pop('class_uncheck', None)
        super(CheckAllColumn, self).__init__(*args, **kwargs)

    def header(self):
        return mark_safe("""<button class="btn btn-xs %s btn-primary"><span class="glyphicon glyphicon-check"></span></button>
               <button class="btn btn-xs %s btn-primary"><span class="glyphicon glyphicon-unchecked"></span></button>""" % (self.class_check, self.class_uncheck))

class MoneyColumn(tables.Column):
    def __init__(self, *args, **kwargs):
        ctype = kwargs.pop('type', None)
        self.ff = kwargs.pop('format', None)
        if ctype == 'D':
            self.func = utilitarios.format_float_babel_us
            self.color = ""
        else:
            self.func = utilitarios.format_float_babel
            self.color = ""
        super(MoneyColumn, self).__init__(*args, **kwargs)

    def render(self, value):
         return mark_safe("<span class='%s'>%s</span>" % (self.color, self.func(value, format=self.ff)) )
