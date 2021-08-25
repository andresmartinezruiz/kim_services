__author__ = 'peter'


def cargar_pedidos(request):
    #se cambio la forma de guardar los pedidos, se guarda los mismos
    #en una big table llamda pedidos, para que su gestion sea mas facil
    #la llave unica de un detalle es el cliente, el vendedor, la hora, la fecha, y el producto, la cantidad
    if request.POST.get('pedidos'):
        pedidos = literal_eval(request.POST.get('pedidos'))
        obs = re.sub('[^ a-zA-Z0-9_]',' ', request.POST.get('obs').replace(';', ''))
        if len(obs) > 40:
            obs = obs[:40].replace(';', '')

        try:
            fent = datetime.datetime.strptime(request.POST.get('fent'), '%Y-%m-%d')
        except:
            fent = datetime.date.today()
        for k, v in pedidos.items():
            if v:
                #el codigo comentado tiene la forma tradicional de guardar los pedidos, lo cual no es muy flexible
                #TODO: 2013/10/01 NUEVA ESTRUCTURA DE PEDIDOS
                #incializamos un numero de pedidos por cada pedido registrado

                cliente = CarteraCliente.objects.get(clientecod=k)
                sucuobj = Sucursales.objects.get(codigo_sucursal=cliente.clientecod[:2])
                try:
                    cta_cte = Permisos.objects.get(cliente_cod_suc=cliente.clientecod)
                except ObjectDoesNotExist:
                    estado = 51
                    estado_descripcion = 'LIBRE'
                    motivocta = '12'
                    motivo_descripcion = 'LIBRE'
                    lc_fact = 0
                    lc_docu = 0
                    lc_fact_e = 0
                    lc_docu_e = 0
                    proc_fact = 0
                    proc_docu = 0
                    fecha_hasta = None
                    tipodoc = 'C'
                    formapago = 1
                    formapago_descripcion = 'CONTADO'
                    documento = 'E'
                    documento_descripcion = 'EFECTIVO'
                    diasvto = 0
                    fecha_actualizacion =  datetime.datetime.today()
                    hora_actualizacion =   datetime.datetime.now()
                else:
                    estado = cta_cte.estado
                    estado_descripcion = cta_cte.estado_descripcion
                    motivocta = cta_cte.motivo
                    motivo_descripcion = cta_cte.motivo_descripcion
                    lc_fact = cta_cte.lc_fact
                    lc_docu = cta_cte.lc_docu
                    lc_fact_e = cta_cte.lc_fact_e
                    lc_docu_e = cta_cte.lc_docu_e
                    proc_fact = cta_cte.proc_fact
                    proc_docu = cta_cte.proc_docu
                    fecha_hasta = cta_cte.fecha_hasta
                    tipodoc = cta_cte.tipodoc
                    formapago = cta_cte.formapago
                    formapago_descripcion = cta_cte.formapago_descripcion
                    documento = cta_cte.documento
                    documento_descripcion = cta_cte.documento_descripcion
                    diasvto = cta_cte.diasvto
                    fecha_actualizacion = cta_cte.fecha_actualizacion
                    hora_actualizacion = cta_cte.hora_actualizacion

                circuito = CarteraCircuito.objects.get(cartera_circuitoid=cliente.circuito)
                motivo  = CarteraMotivos.objects.get(pk=91)
                fortmp = 0
                #formulados con el mismo codigo concecutivo
                forconce = 0
                forconcel = []
                linea_c = 0
                linea_f = 0

                ulped = Pedidos.objects.all().order_by('-pedido_numero')
                pedido_numero = ulped[0].pedido_numero
                # pedido_numero = 1000000
                pedido_numero += 1
                #se realiza el look de este pedido, guardando en la base de datos
                #de forma monentanea. De esta forma se reserva el numero del pedido
                #y se elimina el problema de la mezcla de clientes, en los pedidos sepsa

                #No obstante hay un proceso en el servidor, corriendo cada 5 minutos, el cual
                #me envia un mail, a comercial y al jefe, para chequear los pedidos cruzados
                ped_fake = salespopo.fake_pedido(pedido_numero)

                for i, ped in enumerate(v):
                    vendedor = CarteraVendedor.objects.get(cartera_vendedorid=ped.get('cartera_vendedorid'))
                    try:
                        articulo = CarteraArticulo.objects.get(articulocod=ped.get('articulocod'))
                    except:
                        articulo = CarteraArticulon.objects.get(codigonuevo=ped.get('articulocod'))
                    if ped.get('bonifica') == 'SI':
                        bonifica = True
                    else:
                        bonifica = False

                    if ped.get('for_opcional') == 'false':
                        for_opcional = False
                    else:
                        for_opcional = True

                    if int(ped.get('porcentaje_iva').replace('.00','')) == 0:
                        valor_lista_si = int(ped.get('valor_lista'))
                        valor_venta_si = int(ped.get('valor_venta'))
                        valor_venta_ci = 0
                        valor_lista_ci = 0
                    else:
                        valor_lista_si = 0
                        valor_venta_si = 0
                        valor_venta_ci = int(ped.get('valor_venta'))
                        valor_lista_ci = int(ped.get('valor_lista'))

                    if ped.get('formulacion') == 'false':
                        formulacion = False
                        linea_c = linea_c + 1
                        if i != 0:
                            if i % 16 == 0:
                                #necesitamos un numero numero de pedido
                                #se excedio el margen de 17 items
                                ulped = Pedidos.objects.all().order_by('-pedido_numero')
                                pedido_numero = ulped[0].pedido_numero
                                pedido_numero += 1
                                linea_c = 1
                                ped_fake = salespopo.fake_pedido(pedido_numero)
                        try:
                            #el pedido ya esta
                            Pedidos.objects.get(
                                cliente_cod_suc = cliente.clientecod,
                                # cargado_010_por_id =vendedor.cartera_vendedorid,
                                cargado_010_fecha = datetime.datetime.strptime(ped.get('fecha'), '%d/%m/%Y'),
                                cargado_010_hora = datetime.datetime.strptime(ped.get('hora'), '%H:%M:%S'),
                                articulocod = ped.get('articulocod'),
                                cantidad_original = ped.get('cantidad')
                            )
                        except:
                            Pedidos.objects.get_or_create(
                                    cliente_suc = cliente.clientecod[:2],
                                    cliente_suc_label = sucuobj.label,
                                    cliente_cod = cliente.clientecod[2:],
                                    cliente_cod_suc = cliente.clientecod,
                                    cliente_ruc = cliente.clienteruc,
                                    cliente_nombre = cliente.clientenombre,
                                    cliente_direccion = cliente.direccion,
                                    observacion = obs,
                                    circuito = circuito.cartera_circuitonombre,
                                    circuito_cod = circuito.cartera_circuitoid,
                                    pedido_numero = ped_fake.pedido_numero,
                                    pedido_numero_linea = linea_c,
                                    motivo_no_venta = motivo.motivo,
                                    motivo_no_venta_cod = motivo.pk,
                                    vend_codigo_operador = vendedor.codigo_operador,
                                    cargado_010 = True,
                                    cargado_010_por = vendedor.vendedornombre,
                                    cargado_010_por_id =vendedor.cartera_vendedorid,
                                    cargado_010_tipo = 'VENDEDOR',
                                    cargado_010_fecha = datetime.datetime.strptime(ped.get('fecha'), '%d/%m/%Y'),
                                    cargado_010_hora = datetime.datetime.strptime(ped.get('hora'), '%H:%M:%S'),
                                    arribo_020 = True,
                                    familia = CarteraFamilias.objects.get(familiacod=ped.get('familiacod')).familia,
                                    familiacod = ped.get('familiacod'),
                                    articulo = articulo.articulo_descripcion,
                                    articulocod = ped.get('articulocod'),
                                    codigo_barra = articulo.articulo_barracod,
                                    multiplo_venta = articulo.multiplo_venta,
                                    cantidad = ped.get('cantidad'),
                                    cantidad_original = ped.get('cantidad'),
                                    precio_base_si = articulo.precio_base,
                                    valor_lista1_si = ped.get('valor_lista1'),
                                    lista_nro = str(ped.get('lista_nro')).replace('L',''),
                                    valor_lista_ci = valor_lista_ci,
                                    valor_lista_si = valor_lista_si,
                                    porcentaje_iva = int(ped.get('porcentaje_iva').replace('.00','')),
                                    valor_venta_ci = valor_venta_ci,
                                    valor_venta_si = valor_venta_si,
                                    bonifica =bonifica,
                                    formulacion=formulacion,
                                    for_componente=ped.get('for_componente'),
                                    for_tipo=ped.get('for_tipo'),
                                    for_opcional=for_opcional,
                                    fecha_entrega=fent,
                                    estado = estado,
                                    estado_descripcion = estado_descripcion,
                                    motivo = motivocta,
                                    motivo_descripcion = motivo_descripcion,
                                    lc_fact = lc_fact,
                                    lc_docu = lc_docu,
                                    lc_fact_e = lc_fact_e,
                                    lc_docu_e = lc_docu_e,
                                    proc_fact = proc_fact,
                                    proc_docu = proc_docu,
                                    fecha_hasta = fecha_hasta,
                                    tipodoc = tipodoc,
                                    formapago = formapago,
                                    formapago_descripcion = formapago_descripcion,
                                    documento = documento,
                                    documento_descripcion = documento_descripcion,
                                    diasvto = diasvto,
                                    fecha_actualizacion = fecha_actualizacion,
                                    hora_actualizacion = hora_actualizacion
                            )
                        # else:
                        #     print 'YA EXISTE MAN'

                ulped = Pedidos.objects.all().order_by('-pedido_numero')
                pedido_numero = ulped[0].pedido_numero
                # pedido_numero = 1000000
                pedido_numero += 1
                ped_fake = salespopo.fake_pedido(pedido_numero)

                for i, ped in enumerate(v):
                    vendedor = CarteraVendedor.objects.get(cartera_vendedorid=ped.get('cartera_vendedorid'))
                    try:
                        articulo = CarteraArticulo.objects.get(articulocod=ped.get('articulocod'))
                    except:
                        articulo = CarteraArticulon.objects.get(codigonuevo=ped.get('articulocod'))
                    if ped.get('bonifica') == 'SI':
                        bonifica = True
                    else:
                        bonifica = False

                    if ped.get('for_opcional') == 'false':
                        for_opcional = False
                    else:
                        for_opcional = True

                    if int(ped.get('porcentaje_iva').replace('.00','')) == 0:
                        valor_lista_si = int(ped.get('valor_lista'))
                        valor_venta_si = int(ped.get('valor_venta'))
                        valor_venta_ci = 0
                        valor_lista_ci = 0
                    else:
                        valor_lista_si = 0
                        valor_venta_si = 0
                        valor_venta_ci = int(ped.get('valor_venta'))
                        valor_lista_ci = int(ped.get('valor_lista'))

                    if ped.get('formulacion') == 'true':
                        if forconce >= 1:
                            forconcel.append(pedido_numero)
                            forconce = 0

                        linea_f = linea_f + 1
                        #las formulaciones se tratan como un pedido diferente
                        try:
                            articulo_comp = CarteraArticulon.objects.get(codigoviejo=ped.get('for_componente'))
                            articulo_fcomp = Formulaciones.objects.filter(componente=CarteraArticulon.objects.get(codigoviejo=ped.get('for_componente')))
                            articulo_viejo = CarteraArticulo.objects.get(articulocod=ped.get('for_componente'))
                        except:
                            articulo_comp = CarteraArticulon.objects.get(codigonuevo=ped.get('for_componente'))
                            articulo_fcomp = Formulaciones.objects.filter(componente=CarteraArticulon.objects.get(codigonuevo=ped.get('for_componente')))
                            articulo_viejo = CarteraArticulo.objects.get(articulocod=ped.get('for_componente'))
                        if articulo_fcomp:
                            articulo_fcomp = articulo_fcomp[0]

                        formulacion = True
                        if ped.get('articulocod') != fortmp:
                            fortmp = ped.get('articulocod')
                            ulped = Pedidos.objects.all().order_by('-pedido_numero')
                            pedido_numero = ulped[0].pedido_numero
                            pedido_numero += 1
                            linea_f = 1
                            ped_fake = salespopo.fake_pedido(pedido_numero)
                            try:
                                #el pedido ya esta
                                Pedidos.objects.get(
                                    cliente_cod_suc = cliente.clientecod,
                                    cargado_010_por_id =vendedor.cartera_vendedorid,
                                    cargado_010_fecha = datetime.datetime.strptime(ped.get('fecha'), '%d/%m/%Y'),
                                    cargado_010_hora = datetime.datetime.strptime(ped.get('hora'), '%H:%M:%S'),
                                    for_componente = ped.get('for_componente'),
                                    for_cantidad=ped.get('cantidad_formulado')
                                )
                            except:
                                Pedidos.objects.get_or_create(
                                    cliente_suc = cliente.clientecod[:2],
                                    cliente_suc_label = sucuobj.label,
                                    cliente_cod = cliente.clientecod[2:],
                                    cliente_cod_suc = cliente.clientecod,
                                    cliente_ruc = cliente.clienteruc,
                                    cliente_nombre = cliente.clientenombre,
                                    cliente_direccion = cliente.direccion,
                                    observacion = obs,
                                    circuito = circuito.cartera_circuitonombre,
                                    circuito_cod = circuito.cartera_circuitoid,
                                    pedido_numero = ped_fake.pedido_numero,
                                    pedido_numero_linea = linea_f,
                                    motivo_no_venta = motivo.motivo,
                                    motivo_no_venta_cod = motivo.pk,
                                    vend_codigo_operador = vendedor.codigo_operador,
                                    cargado_010 = True,
                                    cargado_010_por = vendedor.vendedornombre,
                                    cargado_010_por_id =vendedor.cartera_vendedorid,
                                    cargado_010_tipo = 'VENDEDOR',
                                    # cargado_010_fecha = datetime.datetime.strptime('%s %s' % (ped.get('fecha'),ped.get('hora') ), '%d/%m/%Y %H:%M:%S'),
                                    cargado_010_fecha = datetime.datetime.strptime(ped.get('fecha'), '%d/%m/%Y'),
                                    cargado_010_hora = datetime.datetime.strptime(ped.get('hora'), '%H:%M:%S'),
                                    arribo_020 = True,
                                    familia = CarteraFamilias.objects.get(familiacod=ped.get('familiacod')).familia,
                                    familiacod = ped.get('familiacod'),
                                    articulo = articulo.articulo_descripcion,
                                    articulocod = ped.get('articulocod'),
                                    codigo_barra = articulo.codigo_barra_unidad,
                                    multiplo_venta = articulo.multiplo_venta,
                                    cantidad = ped.get('cantidad'),
                                    cantidad_original = ped.get('cantidad'),
                                    precio_base_si = articulo_viejo.precio_base,
                                    valor_lista1_si = ped.get('valor_lista1'),
                                    lista_nro = str(ped.get('lista_nro')).replace('L',''),
                                    valor_lista_ci = valor_lista_ci,
                                    valor_lista_si = valor_lista_si,
                                    porcentaje_iva = int(ped.get('porcentaje_iva').replace('.00','')),
                                    valor_venta_ci = valor_venta_ci,
                                    valor_venta_si = valor_venta_si,
                                    bonifica =bonifica,
                                    formulacion=formulacion,
                                    for_componente=ped.get('for_componente'),
                                    for_tipo=ped.get('for_tipo'),
                                    for_opcional=for_opcional,
                                    for_cantidad=ped.get('cantidad_formulado'),
                                    for_compcant= articulo_fcomp.cantidad,
                                    for_compdesc=articulo_comp.articulo_descripcion,
                                    fecha_entrega=fent,
                                    estado = estado,
                                    estado_descripcion = estado_descripcion,
                                    motivo = motivocta,
                                    motivo_descripcion = motivo_descripcion,
                                    lc_fact = lc_fact,
                                    lc_docu = lc_docu,
                                    lc_fact_e = lc_fact_e,
                                    lc_docu_e = lc_docu_e,
                                    proc_fact = proc_fact,
                                    proc_docu = proc_docu,
                                    fecha_hasta = fecha_hasta,
                                    tipodoc = tipodoc,
                                    formapago = formapago,
                                    formapago_descripcion = formapago_descripcion,
                                    documento = documento,
                                    documento_descripcion = documento_descripcion,
                                    diasvto = diasvto,
                                    fecha_actualizacion = fecha_actualizacion,
                                    hora_actualizacion = hora_actualizacion

                                )
                            # else:
                            #     print 'YA EXISTE MAN'
                        else:
                            #las formulaciones son un pedido aparte
                            try:
                                #el pedido ya esta
                                Pedidos.objects.get(
                                    cliente_cod_suc = cliente.clientecod,
                                    cargado_010_por_id =vendedor.cartera_vendedorid,
                                    cargado_010_fecha = datetime.datetime.strptime(ped.get('fecha'), '%d/%m/%Y'),
                                    cargado_010_hora = datetime.datetime.strptime(ped.get('hora'), '%H:%M:%S'),
                                    for_componente = ped.get('for_componente'),
                                    for_cantidad=ped.get('cantidad_formulado')
                                )
                            except:
                                Pedidos.objects.get_or_create(
                                    cliente_suc = cliente.clientecod[:2],
                                    cliente_suc_label = sucuobj.label,
                                    cliente_cod = cliente.clientecod[2:],
                                    cliente_cod_suc = cliente.clientecod,
                                    cliente_ruc = cliente.clienteruc,
                                    cliente_nombre = cliente.clientenombre,
                                    cliente_direccion = cliente.direccion,
                                    observacion = obs,
                                    circuito = circuito.cartera_circuitonombre,
                                    circuito_cod = circuito.cartera_circuitoid,
                                    pedido_numero = ped_fake.pedido_numero,
                                    pedido_numero_linea = linea_f,
                                    motivo_no_venta = motivo.motivo,
                                    motivo_no_venta_cod = motivo.pk,
                                    vend_codigo_operador = vendedor.codigo_operador,
                                    cargado_010 = True,
                                    cargado_010_por = vendedor.vendedornombre,
                                    cargado_010_por_id =vendedor.cartera_vendedorid,
                                    cargado_010_tipo = 'VENDEDOR',
                                    # cargado_010_fecha = datetime.datetime.strptime('%s %s' % (ped.get('fecha'),ped.get('hora') ), '%d/%m/%Y %H:%M:%S'),
                                    cargado_010_fecha = datetime.datetime.strptime(ped.get('fecha'), '%d/%m/%Y'),
                                    cargado_010_hora = datetime.datetime.strptime(ped.get('hora'), '%H:%M:%S'),
                                    arribo_020 = True,
                                    familia = CarteraFamilias.objects.get(familiacod=ped.get('familiacod')).familia,
                                    familiacod = ped.get('familiacod'),
                                    articulo = articulo.articulo_descripcion,
                                    articulocod = ped.get('articulocod'),
                                    codigo_barra = articulo.codigo_barra_unidad,
                                    multiplo_venta = articulo.multiplo_venta,
                                    cantidad = ped.get('cantidad'),
                                    cantidad_original = ped.get('cantidad'),
                                    precio_base_si = articulo_viejo.precio_base,
                                    valor_lista1_si = ped.get('valor_lista1'),
                                    lista_nro = str(ped.get('lista_nro')).replace('L',''),
                                    valor_lista_ci = valor_lista_ci,
                                    valor_lista_si = valor_lista_si,
                                    porcentaje_iva = int(ped.get('porcentaje_iva').replace('.00','')),
                                    valor_venta_ci = valor_venta_ci,
                                    valor_venta_si = valor_venta_si,
                                    bonifica =bonifica,
                                    formulacion=formulacion,
                                    for_componente=ped.get('for_componente'),
                                    for_tipo=ped.get('for_tipo'),
                                    for_opcional=for_opcional,
                                    for_cantidad=ped.get('cantidad_formulado'),
                                    for_compcant= articulo_fcomp.cantidad,
                                    for_compdesc=articulo_comp.articulo_descripcion,
                                    fecha_entrega=fent,
                                    estado = estado,
                                    estado_descripcion = estado_descripcion,
                                    motivo = motivocta,
                                    motivo_descripcion = motivo_descripcion,
                                    lc_fact = lc_fact,
                                    lc_docu = lc_docu,
                                    lc_fact_e = lc_fact_e,
                                    lc_docu_e = lc_docu_e,
                                    proc_fact = proc_fact,
                                    proc_docu = proc_docu,
                                    fecha_hasta = fecha_hasta,
                                    tipodoc = tipodoc,
                                    formapago = formapago,
                                    formapago_descripcion = formapago_descripcion,
                                    documento = documento,
                                    documento_descripcion = documento_descripcion,
                                    diasvto = diasvto,
                                    fecha_actualizacion = fecha_actualizacion,
                                    hora_actualizacion = hora_actualizacion
                                    )
                                if bonifica:
                                    bl = Pedidos.objects.get_or_create(
                                                    cliente_suc = cliente.clientecod[:2],
                                                    cliente_suc_label = sucuobj.label,
                                                    cliente_cod = cliente.clientecod[2:],
                                                    cliente_cod_suc = cliente.clientecod,
                                                    cliente_ruc = cliente.clienteruc,
                                                    cliente_nombre = cliente.clientenombre,
                                                    cliente_direccion = cliente.direccion,
                                                    observacion = obs,
                                                    circuito = circuito.cartera_circuitonombre,
                                                    circuito_cod = circuito.cartera_circuitoid,
                                                    pedido_numero=ped_fake.pedido_numero,
                                                    motivo_no_venta = motivo.motivo,
                                                    motivo_no_venta_cod = motivo.pk,
                                                    vend_codigo_operador = vendedor.codigo_operador,
                                                    cargado_010 = True,
                                                    cargado_010_por = vendedor.vendedornombre,
                                                    cargado_010_por_id =vendedor.cartera_vendedorid,
                                                    cargado_010_tipo = 'VENDEDOR',
                                                    # cargado_010_fecha = datetime.datetime.strptime('%s %s' % (ped.get('fecha'),ped.get('hora') ), '%d/%m/%Y %H:%M:%S'),
                                                    cargado_010_fecha = datetime.datetime.strptime(ped.get('fecha'), '%d/%m/%Y'),
                                                    cargado_010_hora = datetime.datetime.strptime(ped.get('hora'), '%H:%M:%S'),
                                                    arribo_020 = True,
                                                    familia = '0',
                                                    familiacod = 0,
                                                    articulo = articulo.articulo_descripcion,
                                                    articulocod=90000,
                                                    codigo_barra = '0',
                                                    multiplo_venta = 0,
                                                    cantidad = 0,
                                                    cantidad_original = 0,
                                                    precio_base_si = 0,
                                                    valor_lista1_si = 0,
                                                    lista_nro = 0,
                                                    valor_lista_ci = 0,
                                                    valor_lista_si = 0,
                                                    porcentaje_iva = 0,
                                                    # valor_venta_ci= ped.get('valor_venta'),
                                                    bonifica =bonifica,
                                                    formulacion=formulacion,
                                                    for_componente=90000,
                                                    for_tipo='TDESCUENTO',
                                                    for_opcional=False,
                                                    for_cantidad=0,
                                                    for_compcant= 0,
                                                    for_compdesc='ND',
                                                    fecha_entrega=fent,
                                                    estado = estado,
                                                    estado_descripcion = estado_descripcion,
                                                    motivo = motivocta,
                                                    motivo_descripcion = motivo_descripcion,
                                                    lc_fact = lc_fact,
                                                    lc_docu = lc_docu,
                                                    lc_fact_e = lc_fact_e,
                                                    lc_docu_e = lc_docu_e,
                                                    proc_fact = proc_fact,
                                                    proc_docu = proc_docu,
                                                    fecha_hasta = fecha_hasta,
                                                    tipodoc = tipodoc,
                                                    formapago = formapago,
                                                    formapago_descripcion = formapago_descripcion,
                                                    documento = documento,
                                                    documento_descripcion = documento_descripcion,
                                                    diasvto = diasvto,
                                                    fecha_actualizacion = fecha_actualizacion,
                                                    hora_actualizacion = hora_actualizacion
                                    )
                                    if bl[1]:
                                        forconce += 1
                                    pobj = bl[0]
                                    if pobj.valor_venta_ci:
                                        pobj.valor_venta_ci += valor_venta_ci
                                        pobj.pedido_numero_linea = linea_f + 1
                                    else:
                                        pobj.valor_venta_ci = valor_venta_ci
                                        pobj.pedido_numero_linea = linea_f + 1
                                    if pobj.valor_venta_si:
                                        pobj.valor_venta_si += valor_venta_si
                                        pobj.pedido_numero_linea = linea_f + 1
                                    else:
                                        pobj.valor_venta_si = valor_venta_si
                                        pobj.pedido_numero_linea = linea_f + 1
                                    # print valor_lista_si
                                    pobj.save()
                            # else:
                            #     print 'YA EXISTE MAN'

                if len(forconcel) > 0:
                    forconcel = remover_duplicados(forconcel)
                    for ppack in forconcel:
                        ppackp = Pedidos.objects.filter(pedido_numero=ppack).order_by('id')
                        pks = []
                        for pedp in ppackp:
                            pks.append(pedp.pk)
                            if pedp.articulocod == 90000:
                                pks.append(pedp.pk)
                                ulped = Pedidos.objects.all().order_by('-pedido_numero')
                                pedido_numero = ulped[0].pedido_numero
                                pedido_numero += 1
                                ped_fake = salespopo.fake_pedido(pedido_numero)
                                Pedidos.objects.filter(pk__in=pks).update(pedido_numero=ped_fake.pedido_numero)
                                pks = []

                #BORRAMOS LAS RESERVAS DE NUMEROS
                Pedidos.objects.filter(anulado_040_por='RESERVA').delete()


            else:
                return HttpResponse(json.dumps({'exitos': 'NO HAY PEDIDOS QUE GUARDAR'}), mimetype='application/javascript')
        return HttpResponse(json.dumps({'exitos': 'PEDIDOS PROCESADOS'}), mimetype='application/javascript' )