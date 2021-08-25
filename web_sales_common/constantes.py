from sales_man.models import ProdConstantes

def metricas_articulos():
    data = {
            'unidad_venta_tipo': [],'unidad_compra_tipo': [],'unidad_analisis_tipo': [],'prod_categoria': [],'prod_linea': [],'prod_grupo': [],'prod_marca': [],
            'prod_submarca': [],'prod_segmento': [],'prod_medida': [],'prod_contenido': [],'prod_empaque': [],'prod_empaquegrupo': [],
            'prod_estructura': [],'prod_performance': [],'prod_talla': [],'prod_salud': [], 'prod_varios_01': [], 'prod_coleccion': [], 'prod_presentacion': []
        }
    try:
        prod_unidadventatipo = [('', '')]
        prod_unidadcompratipo = [('', '')]
        prod_unidadanalisistipo = [('', '')]
        prod_categoria = [('', '')]
        prod_linea = [('', '')]
        prod_grupo = [('', '')]
        prod_marca = [('', '')]
        prod_submarca = [('', '')]
        prod_segmento = [('', '')]
        prod_medida = [('', '')]
        prod_contenido = [('', '')]
        prod_empaque = [('', '')]
        prod_empaquegrupo = [('', '')]
        prod_estructura = [('', '')]
        prod_performance = [('', '')]
        prod_talla = [('', '')]
        prod_salud = [('', '')]
        prod_varios_01 = [('', '')]
        prod_coleccion = [('', '')]
        prod_presentacion = [('', '')]
        prod_linea.extend([ (a.descripcion, '%s[%s]' % (a.descripcion, a.prod_constante_cod) ) for a in ProdConstantes.objects.filter(tipo='LINEA', prod_constante_cod__isnull=False).exclude(prod_constante_cod=0) ],)
        prod_grupo.extend([ (a.descripcion, '%s[%s]|%s' % (a.descripcion, a.prod_constante_cod, a.abreviacion) ) for a in ProdConstantes.objects.filter(tipo='GRUPO', prod_constante_cod__isnull=False).exclude(prod_constante_cod=0) ],)
        prod_unidadventatipo.extend([ (a.descripcion, '%s[%s]' % (a.descripcion, a.prod_constante_cod) ) for a in ProdConstantes.objects.filter(tipo='UNIDAD-VENTA') ],)
        prod_unidadcompratipo.extend([ (a.descripcion, '%s[%s]' % (a.descripcion, a.prod_constante_cod) ) for a in ProdConstantes.objects.filter(tipo='UNIDAD-COMPRA') ],)
        prod_unidadanalisistipo.extend([ (a.abreviacion, '%s (%s)' % (a.abreviacion, a.descripcion) ) for a in ProdConstantes.objects.filter(tipo='UNIDAD_ANALISIS') ],)
        prod_categoria.extend([ (a.descripcion, '%s[%s]' % (a.descripcion, a.prod_constante_cod) ) for a in ProdConstantes.objects.filter(tipo='CATEGORIA') ],)

        prod_marca.extend([ (a.descripcion, '%s[%s]' % (a.descripcion, a.prod_constante_cod) ) for a in ProdConstantes.objects.filter(tipo='MARCA') ],)
        prod_submarca.extend([ (a.descripcion, '%s[%s]' % (a.descripcion, a.prod_constante_cod)) for a in ProdConstantes.objects.filter(tipo='SUB-MARCA') ],)
        prod_segmento.extend([ (a.descripcion, '%s[%s]' % (a.descripcion, a.prod_constante_cod)) for a in ProdConstantes.objects.filter(tipo='SEGMENTO') ],)
        prod_medida.extend([ (a.descripcion, '%s[%s]' % (a.descripcion, a.prod_constante_cod)) for a in ProdConstantes.objects.filter(tipo='UNIDAD-MEDIDA') ],)
        prod_contenido.extend([ (a.descripcion, '%s[%s]' % (a.descripcion, a.prod_constante_cod)) for a in ProdConstantes.objects.filter(tipo='CONTENIDO') ],)
        prod_empaque.extend([ (a.descripcion, '%s[%s]' % (a.descripcion, a.prod_constante_cod)) for a in ProdConstantes.objects.filter(tipo='EMPAQUE') ],)
        prod_empaquegrupo.extend([ (a.descripcion, '%s[%s]' % (a.descripcion, a.prod_constante_cod)) for a in ProdConstantes.objects.filter(tipo='GRUPO-EMPAQUE') ],)
        prod_estructura.extend([ (a.descripcion, '%s[%s]' % (a.descripcion, a.prod_constante_cod)) for a in ProdConstantes.objects.filter(tipo='ESTRUCTURA') ],)
        prod_performance.extend([ (a.descripcion, '%s[%s]' % (a.descripcion, a.prod_constante_cod)) for a in ProdConstantes.objects.filter(tipo='PERFORMANCE') ],)
        prod_talla.extend([ (a.descripcion, '%s[%s]' % (a.descripcion, a.prod_constante_cod)) for a in ProdConstantes.objects.filter(tipo='TALLA') ],)
        prod_salud.extend([ (a.descripcion, '%s[%s]' % (a.descripcion, a.prod_constante_cod)) for a in ProdConstantes.objects.filter(tipo='SALUD') ])
        prod_varios_01.extend([ (a.descripcion, '%s[%s]' % (a.descripcion, a.prod_constante_cod)) for a in ProdConstantes.objects.filter(tipo='VARIOS1') ])
        prod_coleccion.extend([ (a.descripcion, '%s[%s]' % (a.descripcion, a.prod_constante_cod)) for a in ProdConstantes.objects.filter(tipo='COLECCION') ])
        prod_presentacion.extend([ (a.descripcion, '%s[%s]' % (a.descripcion, a.prod_constante_cod)) for a in ProdConstantes.objects.filter(tipo='PRESENTACION') ])
        data = {
            'prod_unidadventatipo': prod_unidadventatipo,
            'prod_unidadcompratipo': prod_unidadcompratipo,
            'prod_unidadanalisistipo': prod_unidadanalisistipo,
            'prod_categoria': prod_categoria,
            'prod_linea': prod_linea,
            'prod_grupo': prod_grupo,
            'prod_marca': prod_marca,
            'prod_submarca': prod_submarca,
            'prod_segmento': prod_segmento,
            'prod_medida': prod_medida,
            'prod_contenido': prod_contenido,
            'prod_empaque': prod_empaque,
            'prod_empaquegrupo': prod_empaquegrupo,
            'prod_estructura': prod_estructura,
            'prod_performance': prod_performance,
            'prod_talla': prod_talla,
            'prod_salud': prod_salud,
            'prod_coleccion': prod_coleccion,
            'prod_presentacion': prod_presentacion
        }
    except:
        pass
    return data
