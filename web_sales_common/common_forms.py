import datetime
from crispy_forms.bootstrap import FieldWithButtons, StrictButton
from django import forms
from django.forms.extras.widgets import SelectDateWidget
from django.forms.models import modelformset_factory
import re
from imp_man.models import  IcoTerms, Conceptos, Puertos
from django.db.models import Q
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Fieldset, ButtonHolder, Submit, MultiField, Div, Field
from dashboard.dashboardmanag import populate_form_load
from django.shortcuts import render, redirect, resolve_url

class CommonFilters(forms.Form):
    choices = (
        ('TODAS', 'TODAS'),
        ('verificado_045', 'PARA RESOLUCION'),
        ('aprobado_050', 'APROBADOS'),
        ('procesado_060', 'PROCESADOS'),
        ('anulado_040', 'ANULADOS')
    )

    filters = forms.ChoiceField(required=True,
                                widget=forms.RadioSelect(attrs={'class': ''}),
                                choices=choices)


    def __init__(self, *args, **kwargs):
        class_model = kwargs.pop('class_model', None)
        multiple_class = kwargs.pop('multiple_class', None)
        self.extra_filter = kwargs.pop('extra_filter', None)
        choice_filters = kwargs.pop('choice_filters', None)
        exclude = kwargs.pop('exclude', None)
        url = kwargs.pop('url', None)
        asociate_bool = kwargs.pop('asociate_bool', None)
        form_id = kwargs.pop('form_id', None)
        field_name = kwargs.pop('field_name', None)
        super(CommonFilters, self).__init__(*args, **kwargs)
        if class_model:
            #we rebuild the filters with the booleanfield of the model
            choices = []
            for field in class_model._meta.fields:
                if field.name not in exclude:
                    if field.get_internal_type() == 'BooleanField':
                        fancy_choice = re.sub('[0-9]+', '', field.name).upper().replace('_', ' ')
                        choices.append((field.name, fancy_choice))

            self.asociate_bool = asociate_bool
            self.fields['filters'].choices = choices

        if multiple_class:
            choices = []
            for class_model in multiple_class:
                for field in class_model._meta.fields:
                    if field.name not in exclude:
                        if field.get_internal_type() == 'BooleanField':
                            fancy_choice = re.sub('[0-9]+', '', field.verbose_name).upper().replace('_', ' ')
                            choices.append((field.verbose_name.lower(), fancy_choice))

        if self.extra_filter:
            for a in self.extra_filter:
                fancy_choice = re.sub('[0-9]+', '', a.upper().replace('_', ' '))
                choices.append((a, fancy_choice))
            self.asociate_bool = asociate_bool
            self.fields['filters'].choices = choices

        if choice_filters:
            choices = []
            for a in choice_filters:
                    fancy_choice = re.sub('[0-9]+', '', a.upper().replace('_', ' '))
                    choices.append((a, fancy_choice))

            self.asociate_bool = asociate_bool
            self.fields['filters'].choices = choices


        self.helper = FormHelper()
        self.helper.form_class = 'form-horizontal'
        self.helper.form_method = 'GET'
        self.helper.form_action = url
        self.helper.form_id = form_id
        self.helper.form_show_labels = False
        self.helper.layout = Layout(
            Div(
                field_name,
                'filters',
                css_class='col-md-12 radio-inline',
            )
        )
