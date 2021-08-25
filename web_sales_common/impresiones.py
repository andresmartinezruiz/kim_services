import qrcode

__author__ = 'pedroleguizamon'
from raven.contrib.django.raven_compat.models import client as ravenclient
import datetime
import time
from imp_man.models import Impresoras
from sales_man.models import ProdMaestro
import cups
from django.conf import settings
import os
from decimal import Decimal
from lxml import etree, objectify
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, legal
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch, mm
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, Table, TableStyle
from web_sales_common import utilitarios
import uuid
from subprocess import Popen, PIPE, STDOUT, call
from hubarcode.code128 import Code128Encoder
from fpdf import FPDF
from wand.image import Image
import copy
from web_sales_common.monedas import to_word
import logging

logger = logging.getLogger('netipa_main')

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Feed control sequences
CTL_LF     = '\x0a'              # Print and line feed
CTL_FF     = '\x0c'              # Form feed
CTL_CR     = '\x0d'              # Carriage return
CTL_HT     = '\x09'              # Horizontal tab
CTL_SET_HT = '\x1b\x44'          # Set horizontal tab positions
CTL_VT     = '\x1b\x64\x04'      # Vertical tab
# Printer hardware
HW_INIT    = '\x1b\x40'          # Clear data in buffer and reset modes
HW_SELECT  = '\x1b\x3d\x01'      # Printer select
HW_RESET   = '\x1b\x3f\x0a\x00'  # Reset printer hardware
# Cash Drawer
CD_KICK_2  = '\x1b\x70\x00'      # Sends a pulse to pin 2 []
CD_KICK_5  = '\x1b\x70\x01'      # Sends a pulse to pin 5 []
# Paper
PAPER_FULL_CUT  = '\x1d\x56\x00' # Full cut paper
PAPER_PART_CUT  = '\x1d\x56\x01' # Partial cut paper
# Text format
TXT_NORMAL      = '\x1b\x21\x00' # Normal text
TXT_2HEIGHT     = '\x1b\x21\x10' # Double height text
TXT_2WIDTH      = '\x1b\x21\x20' # Double width text
TXT_4SQUARE     = '\x1b\x21\x30' # Quad area text
TXT_UNDERL_OFF  = '\x1b\x2d\x00' # Underline font OFF
TXT_UNDERL_ON   = '\x1b\x2d\x01' # Underline font 1-dot ON
TXT_UNDERL2_ON  = '\x1b\x2d\x02' # Underline font 2-dot ON
TXT_BOLD_OFF    = '\x1b\x45\x00' # Bold font OFF
TXT_BOLD_ON     = '\x1b\x45\x01' # Bold font ON
TXT_FONT_A      = '\x1b\x4d\x00' # Font type A
TXT_FONT_B      = '\x1b\x4d\x01' # Font type B
TXT_ALIGN_LT    = '\x1b\x61\x00' # Left justification
TXT_ALIGN_CT    = '\x1b\x61\x01' # Centering
TXT_ALIGN_RT    = '\x1b\x61\x02' # Right justification
# Char code table
CHARCODE_PC437  = '\x1b\x74\x00' # USA: Standard Europe
CHARCODE_JIS    = '\x1b\x74\x01' # Japanese Katakana
CHARCODE_PC850  = '\x1b\x74\x02' # Multilingual
CHARCODE_PC860  = '\x1b\x74\x03' # Portuguese
CHARCODE_PC863  = '\x1b\x74\x04' # Canadian-French
CHARCODE_PC865  = '\x1b\x74\x05' # Nordic
CHARCODE_WEU    = '\x1b\x74\x06' # Simplified Kanji, Hirakana
CHARCODE_GREEK  = '\x1b\x74\x07' # Simplified Kanji
CHARCODE_HEBREW = '\x1b\x74\x08' # Simplified Kanji
CHARCODE_PC1252 = '\x1b\x74\x11' # Western European Windows Code Set
CHARCODE_PC866  = '\x1b\x74\x12' # Cirillic #2
CHARCODE_PC852  = '\x1b\x74\x13' # Latin 2
CHARCODE_PC858  = '\x1b\x74\x14' # Euro
CHARCODE_THAI42 = '\x1b\x74\x15' # Thai character code 42
CHARCODE_THAI11 = '\x1b\x74\x16' # Thai character code 11
CHARCODE_THAI13 = '\x1b\x74\x17' # Thai character code 13
CHARCODE_THAI14 = '\x1b\x74\x18' # Thai character code 14
CHARCODE_THAI16 = '\x1b\x74\x19' # Thai character code 16
CHARCODE_THAI17 = '\x1b\x74\x1a' # Thai character code 17
CHARCODE_THAI18 = '\x1b\x74\x1b' # Thai character code 18
# Barcode format
BARCODE_TXT_OFF = '\x1d\x48\x00' # HRI barcode chars OFF
BARCODE_TXT_ABV = '\x1d\x48\x01' # HRI barcode chars above
BARCODE_TXT_BLW = '\x1d\x48\x02' # HRI barcode chars below
BARCODE_TXT_BTH = '\x1d\x48\x03' # HRI barcode chars both above and below
BARCODE_FONT_A  = '\x1d\x66\x00' # Font type A for HRI barcode chars
BARCODE_FONT_B  = '\x1d\x66\x01' # Font type B for HRI barcode chars
BARCODE_HEIGHT  = '\x1d\x68\x64' # Barcode Height [1-255]
BARCODE_WIDTH   = '\x1d\x77\x03' # Barcode Width  [2-6]
BARCODE_UPC_A   = '\x1d\x6b\x00' # Barcode type UPC-A
BARCODE_UPC_E   = '\x1d\x6b\x01' # Barcode type UPC-E
BARCODE_EAN13   = '\x1d\x6b\x02' # Barcode type EAN13
BARCODE_EAN8    = '\x1d\x6b\x03' # Barcode type EAN8
BARCODE_CODE39  = '\x1d\x6b\x04' # Barcode type CODE39
BARCODE_ITF     = '\x1d\x6b\x05' # Barcode type ITF
BARCODE_NW7     = '\x1d\x6b\x06' # Barcode type NW7
# Image format
S_RASTER_N      = '\x1d\x76\x30\x00' # Set raster image normal size
S_RASTER_2W     = '\x1d\x76\x30\x01' # Set raster image double width
S_RASTER_2H     = '\x1d\x76\x30\x02' # Set raster image double height
S_RASTER_Q      = '\x1d\x76\x30\x03' # Set raster image quadruple
# Printing Density
PD_N50          = '\x1d\x7c\x00' # Printing Density -50%
PD_N37          = '\x1d\x7c\x01' # Printing Density -37.5%
PD_N25          = '\x1d\x7c\x02' # Printing Density -25%
PD_N12          = '\x1d\x7c\x03' # Printing Density -12.5%
PD_0            = '\x1d\x7c\x04' # Printing Density  0%
PD_P50          = '\x1d\x7c\x08' # Printing Density +50%
PD_P37          = '\x1d\x7c\x07' # Printing Density +37.5%
PD_P25          = '\x1d\x7c\x06' # Printing Density +25%
PD_P12          = '\x1d\x7c\x05' # Printing Density +12.5%


def callback_admin(prompt):
      return settings.CUPS_ADMIN[-1]


class CupsPrinter(object):
    """
    Una clase mas dinamica, que solo busca una impresora en la base de datos y ahi estara definido
    los accesos al servidor cups
    """
    def imprimir_trabajo(self, **kwargs):
        impresora = kwargs.get('impresora')
        impresorapk = kwargs.get('impresorapk')
        modulo = kwargs.get('modulo')
        ruta = kwargs.get('ruta')

        opciones = kwargs.get('opciones')
        if impresorapk:
              impresoraobj = Impresoras.objects.get(pk=impresorapk)
              impresora = impresoraobj.nombre
        else:impresoraobj = Impresoras.objects.get(nombre=impresora, modulo=modulo)
        cups.setServer(impresoraobj.cup_server)
        cups.setUser(impresoraobj.cup_user)
        cups.setPasswordCB(lambda prompt: impresoraobj.cup_pass)
        cups_con = cups.Connection()
        base = os.path.basename(ruta)
        try:
              cups_con.printFile(impresora, ruta, base, opciones)
        except:
              ravenclient.captureException()
              return {'error': 'Error de HW/Conexion'}
        return {'exitos': 'Enviado para impresion a %s' % impresora}

class CupsServer(object):
    def __init__(self, usuario, clave):
        self.gpp = clave
        cups.setServer(settings.CUPS_SERVER.get('maestro'))
        cups.setUser(usuario)

    def modo_usuario(self):
        cups.setPasswordCB(self.callback)
        self.cups_con = cups.Connection()

    def callback_admin(self, x):
        return settings.CUPS_ADMIN[-1]

    def modo_admin(self):
        cups.setServer(settings.CUPS_SERVER.get('maestro'))
        cups.setUser(settings.CUPS_ADMIN[0])
        self.cups_con = cups.Connection()

    def modo_anonimo(self):
        cups.setServer(settings.CUPS_SERVER.get('maestro'))
        # cups.setUser(settings.CUPS_ADMIN[0])
        self.cups_con = cups.Connection()

    def listar_impresoras(self):
        return self.cups_con.getPrinters()

    def callback(self):
        return self.gpp

    def imprimir_trabajo(self, impresora, ruta, opciones):
        base = os.path.basename(ruta)
        self.cups_con.printFile(impresora, ruta, base, opciones)
        return {'exitos': 'Enviado para impresion a %s' % impresora}

def get_user_default_control(userobj):
  try:
      gecos = '%s, %s' % (userobj.last_name, userobj.first_name)
      return userobj.username, \
               userobj.pk, \
               gecos
  except:
      return 'supervisor', \
               1, \
               'supervisor'

def imprimir_facturas_pdf(userobj, pedobj):
    """
    Convierte las facturas en formato pdf y luego las imprime,
    la razon por la cual se deja un archivo digital de la factura, para luego usarla como
    visualizacion en algun lugar
    """
    fecha_emision = datetime.datetime.now()
    # pedido, factura= args
    ahora = datetime.datetime.now()
    total_venta = int(pedobj.get_total_venta())
    total_iva = int(pedobj.get_total_iva())
    total_venta_exenta = pedobj.get_total_exenta()
    total_venta_gravada_5 = pedobj.get_total_gravada_5()
    total_venta_gravada_10 = pedobj.get_total_gravada_10()
    # total_descuento = pedobj.get_total_descuento()
    descuento_exenta, descuento_gravada_5, descuento_gravada_10 = pedobj.get_total_descuento()
    bloque_cod = '%s_%s' % (pedobj.bloqueobj.pk, pedobj.bloqueobj.bloque_cod.strftime('%d%m%Y'))
    pdf=FPDF('P','cm','legal')
    pdf.add_page()
    # pdf.set_font('Arial','B',16)
    pdf.set_font('Arial',style='',size=6.5)
    #X1, Y1, X2, Y2
    #marco1
    #arriba
    pdf.set_line_width(0);
    pdf.set_draw_color(44, 46, 45)
    # pdf.set_fill_color(189, 189, 189)
    logger.info('FORMATEANDO FACTURA %s - PEDIDO %s -  CLIENTE %s' % (pedobj.factura_numero, pedobj.pedido_numero, pedobj.puntoventaobj))
    for coorde in [0, 11, 22]:
        pdf.line(0.9, coorde+0.4, 20.5, coorde+0.4) #primera linea
        pdf.line(0.9, coorde+2.4, 20.5, coorde+2.4) # contiene que separa el timbrado
        pdf.line(0.9, coorde+3.8, 20.5, coorde+3.8) # contiene la linea que separa las observacion, fecha, etc
        pdf.line(0.9, coorde+4.3, 20.5, coorde+4.3) # titulos de la table, arti, cantidad, precio, exenta, etc
        #separadores dettales - inicio
        pdf.line(2, coorde+3.8, 2, coorde+9.5) # separador de columna articulo
        pdf.line(3.2, coorde+3.8, 3.2, coorde+9.5) # separador de columna cantidad
        pdf.line(13.5, coorde+3.8, 13.5, coorde+9.5) # separador de columna descripcion
        pdf.line(14.8, coorde+3.8, 14.8, coorde+10.8) # separador de columna precio unitario
        pdf.line(16.6, coorde+3.8, 16.6, coorde+10.8) # separador de columna exentas
        pdf.line(18.5, coorde+3.8, 18.5, coorde+10.8) # separador de columna iva 5
        # pdf.line(20.5, 4, 20.5, 9) # separador de columna articulo
        #separadores dettales - fin
        pdf.line(0.9, coorde+9.5, 20.5, coorde+9.5) # linea de fin de detalle - comienzo subtotales
        pdf.line(0.9, coorde+9.8, 20.5,coorde+9.8) # linea de fin de subtotales
        ###############
        #izquierda
        pdf.line(0.9, coorde+0.4, 0.9, coorde+10.8)
        #derecha
        pdf.line(20.5, coorde+0.4, 20.5, coorde+10.8)
        #abajo
        pdf.line(0.9, coorde+10.8, 20.5, coorde+10.8)
        ###  INTORUDCIMOS EL CONTENIDO DEL MARCO
        ###
        pdf.set_x(1)
        pdf.set_y(coorde+2.6)
        pdf.cell(0, 0, 'Fecha Emision')
        pdf.set_x(3.5)
        pdf.cell(0,0, ':')
        pdf.set_x(3.6)
        pdf.set_font('Arial',style='B',size=6.5)
        pdf.cell(0,0, 'ASUNCION, %s DE %s DE %s.' % (fecha_emision.strftime('%d'),
                                                     utilitarios.mes_palabra(int(fecha_emision.strftime('%m'))),
                                                     fecha_emision.strftime('%Y')
                                                    ))
        pdf.set_x(16.5)
        pdf.set_font('Arial',style='',size=6.5)
        pdf.cell(0,0, 'Vencimiento')
        pdf.set_x(18.6)
        pdf.cell(0,0, ':')
        pdf.set_font('Arial',style='B',size=6.5)
        pdf.set_x(18.7)
        pdf.cell(0,0, '00/00/0000')

        pdf.set_x(1)
        pdf.set_y(coorde+2.9)
        pdf.set_font('Arial',style='',size=6.5)
        pdf.cell(0,0, 'Nombre o Razon Social')
        pdf.set_x(3.5)
        pdf.cell(0,0, ':')
        pdf.set_x(3.6)
        pdf.set_font('Arial',style='B',size=6.5)
        pdf.cell(0,0, pedobj.puntoventaobj.nombrefactura.upper())
        pdf.set_font('Arial',style='',size=6.5)
        pdf.set_x(10.1)
        pdf.cell(0,0, 'Codigo:')
        pdf.set_font('Arial',style='B',size=6.5)
        pdf.set_x(11)
        pdf.cell(0,0, pedobj.puntoventaobj.clientecod)
        pdf.set_x(16.5)
        pdf.set_font('Arial',style='',size=6.5)
        pdf.cell(0,0, 'R.U.C.')
        pdf.set_x(18.6)
        pdf.cell(0,0, ':')
        pdf.set_font('Arial',style='B',size=6.5)
        pdf.set_x(18.7)
        pdf.cell(0,0, str(pedobj.puntoventaobj.clienteruc.clienteruc))

        pdf.set_font('Arial',style='',size=6.5)
        pdf.set_x(1)
        pdf.set_y(coorde+3.2)
        pdf.cell(0,0, 'Direccion')
        pdf.set_x(3.5)
        pdf.cell(0,0, ':')
        pdf.set_font('Arial',style='B',size=6.5)
        pdf.set_x(3.6)
        pdf.cell(0,0, pedobj.puntoventaobj.get_direccion_entrega().nombredireccion.upper().encode('ascii', errors='replace'))
        pdf.set_font('Arial',style='',size=6.5)
        pdf.set_x(10.1)
        pdf.cell(0,0, 'Bloque: ')
        pdf.set_font('Arial',style='B',size=6.5)
        pdf.set_x(11)
        pdf.cell(0,0, bloque_cod)
        pdf.set_font('Arial',style='',size=6.5)
        pdf.set_x(16.5)
        pdf.cell(0,0, 'Condicion de Venta')
        pdf.set_x(18.6)
        pdf.cell(0,0, ':')
        pdf.set_font('Arial',style='B',size=6.5)
        pdf.set_x(18.7)
        pdf.cell(0,0, pedobj.puntoventaobj.cuentacorriente.documento.documento )

        pdf.set_font('Arial',style='',size=6.5)
        pdf.set_x(1)
        pdf.set_y(coorde+3.5)
        pdf.cell(0,0, 'Observacion: ')
        pdf.set_x(3.5)
        pdf.cell(0,0, ':')
        pdf.set_x(3.6)
        pdf.cell(0,0, pedobj.observacion.upper()[0:60])
        pdf.set_x(16.5)
        pdf.cell(0,0, 'Condicion de Pago')
        pdf.set_x(18.6)
        pdf.cell(0,0, ':')
        pdf.set_font('Arial',style='B',size=6.5)
        pdf.set_x(18.7)
        pdf.cell(0,0, pedobj.puntoventaobj.cuentacorriente.forma_pago.forma_pago)
        #cabecera table de detalles
        pdf.set_font('Arial',style='B',size=6.5)
        pdf.set_x(1)
        pdf.set_y(coorde+4.1)
        pdf.cell(0,0, 'Art.')
        pdf.set_x(2)
        pdf.cell(0,0, 'Cantidad')
        pdf.set_x(4.5)
        pdf.cell(0,0, 'Clase de Mercaderias y/o Servicios')
        pdf.set_x(13.5)
        pdf.cell(0,0, 'P. Unitario')
        pdf.set_x(15.5)
        pdf.cell(0,0, 'Exentas')
        pdf.set_x(17.9)
        pdf.cell(0,0, '%5')
        pdf.set_x(19.8)
        pdf.cell(0,0, '%10')
        #dibujamos el pedido
        pdf.set_font('Arial',style='',size=6.5)
        punto_inicial_detalle = 4.5
        if descuento_exenta != 0 or descuento_gravada_5 != 0 or descuento_gravada_10:
            peddetail = list(pedobj.pedidos_set.filter(anulado_040=False).order_by('pk'))
            #we create a dinamyc class
            descuento = type(
                   'Descuento',
                   (object,),
                   dict(
                        total_descuento = True,
                        cantidad = 1,
                        precio_unitario = 0,
                        exenta = descuento_exenta,
                        gravada_5 = descuento_gravada_5,
                        gravada_10 = descuento_gravada_10,
                        articuloobj = ProdMaestro.objects.get(prod_codigoviejo=90000)
                       )
                   )
            peddetail.append(descuento)
        else:
            peddetail = pedobj.pedidos_set.filter(anulado_040=False).order_by('pk')

        for peds in peddetail:
            pdf.set_font('Arial',style='',size=6.5)
            ### Para dibujar el detalle hay que hacer a partir del punto 4.7
            ### luego por cada nueva linea hay que incrementar 0.3 puntos
            multiplicar = 1
            articulo_cod = str(peds.articuloobj.prod_codigoviejo)
            articulo_descripcion = str(peds.articuloobj.prod_descripcionnuevo)
            if hasattr(peds, 'total_descuento'):
                pdf.set_font('Arial',style='B',size=6.5)
                # articulo_cod = 90000
                # articulo_descripcion = 'DESCUENTOS OTORGADOS'
                multiplicar = -1
            cantidad = str(peds.cantidad)
            codigo_barra = str(peds.articuloobj.prod_codigobarraunidad)
            precio_unitario = peds.precio_unitario*multiplicar
            exenta = peds.exenta*multiplicar
            gravada_5 = peds.gravada_5*multiplicar
            gravada_10 = peds.gravada_10*multiplicar
            # if peds.valor_lista_si == 0:
            #     valor_venta =  peds.valor_lista_ci
            # else:
            #     valor_venta = peds.valor_lista_si
            pdf.set_y(coorde+punto_inicial_detalle)
            pdf.set_x(1)
            pdf.cell(1,0, articulo_cod, align='R')
            pdf.set_x(2.1)
            pdf.cell(1,0, cantidad, align='R')
            pdf.set_x(3.3)
            pdf.cell(1,0, articulo_descripcion, align='L')
            pdf.set_x(11.6)
            pdf.cell(1,0, codigo_barra, align='L')
            pdf.set_x(13.8)
            pdf.cell(1,0, format_decimal(precio_unitario, locale='es_PY'), align='R')
            if exenta != 0:
                pdf.set_x(15.6)
                pdf.cell(1,0, format_decimal(exenta, locale='es_PY'), align='R')
            #iva 5% no hay
            if gravada_10 != 0:
                pdf.set_x(19.5)
                pdf.cell(1,0, format_decimal(gravada_10, locale='es_PY'), align='R')
            punto_inicial_detalle += 0.3
        #subtotales
        pdf.set_font('Arial',style='',size=6.5)
        pdf.set_y(coorde+9.7)
        pdf.set_x(13.1)
        pdf.cell(1,0, 'SUBTOTALES', align='L')
        pdf.set_font('Arial',style='B',size=6.5)
        pdf.set_x(15.6)
        #exenta
        pdf.cell(1,0,  format_decimal(total_venta_exenta, locale='es_PY'), align='R')
        pdf.set_x(17.5)
        #iva 5
        pdf.cell(1,0,format_decimal(total_venta_gravada_5, locale='es_PY'), align='R')
        pdf.set_x(19.5)
        #iva 10
        pdf.cell(1,0, format_decimal(total_venta_gravada_10, locale='es_PY'), align='R')
        #total a pagar
        pdf.set_font('Arial',style='',size=6.5)
        pdf.set_y(coorde+10)
        pdf.set_x(1)
        pdf.cell(1,0, 'TOTAL A PAGAR Guaranies %s.-' % to_word(total_venta).upper())
        #
        pdf.set_font('Arial',style='B',size=6.5)
        pdf.set_y(coorde+10)
        pdf.set_x(19.5)
        pdf.cell(1,0, format_decimal(total_venta, locale='es_PY'), align='R')
        #liquidacion iba
        pdf.set_font('Arial',style='',size=6.5)
        pdf.set_y(coorde+10.3)
        pdf.set_x(1)
        pdf.cell(1,0, 'LIQUIDACION DEL IVA')
        pdf.set_font('Arial',style='B',size=6.5)
        pdf.set_y(coorde+10.3)
        pdf.set_x(8)
        pdf.cell(1,0, '%5: 0        %10: ' +  format_decimal(total_iva, locale='es_PY'), align='C')
    FACTUR_DIR = '%s/invoicing_files' % PROJECT_ROOT
    try:
        os.mkdir('%s/%s' % (FACTUR_DIR, bloque_cod ))
    except:
        pass
    pdf_path = '%s/%s/%s_%s' % (FACTUR_DIR, bloque_cod, pedobj.factura_numero, pedobj.pedido_numero)
    logger.info('GENERANDO Y GUARDANDO FACTUA PDF %s - PEDIDO %s - CLIENTE %s' % (pedobj.factura_numero, pedobj.pedido_numero, pedobj.puntoventaobj))
    pdf.output(pdf_path,'F')
    #una vez generada el pdf de la factura, cambiamos los estados correspondietnes
    username, \
    usernumber, \
    usergecos = get_user_default_control(userobj)
    serialobj = pedobj.serialobj
    # print serialobj
    logger.info('MARCANDO EL DOCUMENTO %s COMO UTILIZADO E IMPRIMIDO' % pedobj.factura_numero)
    serialobj.impreso_012 = True
    serialobj.impreso_012_por = username
    serialobj.impreso_012_por_id = usernumber
    serialobj.impreso_012_por_gecos = usergecos
    serialobj.impreso_012_fecha = ahora
    serialobj.impreso_012_hora = ahora
    serialobj.save()
    cups_server = CupsServer(settings.CUPS_ADMIN[0],
                             settings.CUPS_ADMIN[1]
                             )
    cups_server.modo_admin()
    cups_server.imprimir_trabajo('hp_tesoreria', pdf_path, {
        'media': 'Legal',
        'PageSize': 'Legal',
        'HPBookletPageSize': 'Legal',
        'HPwmTextStyle': '',
        'HPManualDuplexOrientation': ''
        })

def print_web_page(request, url, printer, wait):
    """Valiendonos de phantomjs realizamos una impresion, de nuestro contenido web"""
    tmp_file = open('/tmp/phan.txt', 'w+')
    # Get the current user cookie
    cookies = request.COOKIES
    # Write csrftoken and sessionid to a local file
    tmp_file.write(cookies['csrftoken'] + ' ' + cookies['sessionid'])
    # Write all the information was passed from the url to the same local file
    tmp_file.close()
    dst_file = '/tmp/printer_web_%s.png' % str(uuid.uuid4().fields[-1])

    # print url
    external_process = Popen(['%s/phantomjs' % settings.PHANTOM_JS_PATH,
                              # '--debug=true',
                              '--disk-cache=true',
                              '--max-disk-cache-size=25600',
                             '%s/printing_web_page.js' % settings.PHANTOM_JS_PATH,
                             # 'http://localhost:8000/sman/administrador_ventas?listar_pedidos=true&verificar=true&fecha_i=25/04/2014&fecha_f=25/04/2014',
                             url,
                             dst_file,
                             settings.PHANTOM_DOMAIN,
                             settings.PHANTOM_PORT,
                             wait
                             ],
                            stdout=PIPE, stderr=STDOUT)
    out = external_process.stdout.read()
    # print out
    # Open the file created by PhantomJS
    # return_file = File(open(file_name, 'r'))
    # response = HttpResponse(return_file, mimetype='application/force-download')
    # response['Content-Disposition'] = 'attachment; filename=current_page.pdf'
    # Return the file to the browser and force it as download item
    return dst_file


def imprimir_etiquetas_tf(palletsobjs, userobj, reimpresion, **kwargs):
    ETIQUETA_DIR = '%s/label_files' % PROJECT_ROOT
    ahora = datetime.datetime.now()
    celery_func = kwargs.get('celery_func')
    impresora = kwargs.get('impresora')
    #por defecto
    ini_point = 2
    ini_xpoint = 0.5
    ini_point_img = 3
    #nuevo
    ini_point = 0.1
    ini_xpoint = 0.5
    ini_point_img = 1.1
    for pallobj in palletsobjs:
        if celery_func:
            celery_func.update_state(state='STARTED',meta={'msg': 'Imprimiendo Pallet %s' % pallobj.pall_numero, 'porcentaje':  100})
        proforma = '0'
        lote = '0'
        fecha_vencimiento = 'ND'
        fecha_vencimientoscore = '0000000'
        if pallobj.articulo_fecha_vencimiento:
            fecha_vencimiento = pallobj.articulo_fecha_vencimiento.strftime('%d/%m/%Y')
            fecha_vencimiento_raw = pallobj.articulo_fecha_vencimiento.strftime('%Y%m%d')
            fecha_vencimientoscore = pallobj.articulo_fecha_vencimiento.strftime('%d%m%Y')
        if pallobj.articulo_lote:
            lote = pallobj.articulo_lote
        if pallobj.compraobj:
            proforma = '{}({})'.format(pallobj.compraobj.proforma, pallobj.compraobj.pk)
        pdf=FPDF('P','cm',(10, 12.5))
        pdf.add_page()
        pdf.set_font('Arial',style='',size=25)
        pdf.set_y(1+ini_point)
        pdf.set_x(0.6)
        if pallobj.completo:
            pdf.cell(1, 0, '{}-C {}'.format(pallobj.pall_numero, 'A' if pallobj.averiado else ''), align='L')
        else:
            pdf.cell(1, 0, '{}-I {}'.format(pallobj.pall_numero, 'A' if pallobj.averiado else ''), align='L')
        pdf.set_font('Arial', style='', size=8)
        pdf.set_y(0.8 + ini_point)
        pdf.set_x(4.6)
        pdf.cell(1, 0, 'PF: {}'.format(proforma.upper().replace('PF', '').replace('PRINGLES', 'PRG')), align='L')
        #### Lote
        pdf.set_y(1.1 + ini_point)
        pdf.set_x(4.6)
        pdf.cell(1, 0, 'Lote: {}'.format(lote), align='L')
        # vencimiento
        pdf.set_y(1.1 + ini_point)
        pdf.set_x(7.3)
        pdf.cell(1, 0, 'Vto: {}'.format(fecha_vencimiento), align='L')
        #articulo
        pdf.set_y(1.5 + ini_point)
        pdf.set_x(0.6)
        articulo = '{}[{}]'.format(pallobj.articuloobj.prod_descripcionnuevo, pallobj.articuloobj.prod_codigoviejo)
        pdf.cell(1, 0, articulo, align='L')
        #cajas
        pdf.set_y(1.5+ini_point)
        pdf.set_x(5.6)
        pdf.cell(1,0, '-Cjs: {}'.format(pallobj.pall_articulo_cajas), align='L')
        # unidades
        pdf.set_x(6.8)
        pdf.cell(1,0, '-Uni:{}'.format(pallobj.pall_articulo_unidades), align='L')
        #totales
        pdf.set_x(7.9)
        pdf.cell(1,0, '-T:{}'.format(pallobj.pall_articulo_cantidad), align='L')
        ######### CB Articulo
        #articuloimg = '%s/%s.png' % (ETIQUETA_DIR, pallobj.articuloobj.prod_codigoviejo)
        #if not os.path.isfile(articuloimg):
        #    barra_articulo = Code128Encoder(str(pallobj.articuloobj.prod_codigoviejo),
        #                                    options={'height': 60, 'label_border': 1, 'bottom_border': 5})
        #    barra_articulo.save(articuloimg, bar_width=1)
        #pdf.image(articuloimg, x=0.5, y=0.9 + ini_point_img, w=2.5, h=2)
        ####### vencimiento
        #fnameimg_venc = '%s/%s.png' % (ETIQUETA_DIR, fecha_vencimientoscore)
        #if not os.path.isfile(fnameimg_venc):
        #    # print fecha_vencimiento, 'laalalal'
        #    barra_vencimiento = Code128Encoder(fecha_vencimiento_raw,
        #                                       options={'height': 40, 'label_border': 1, 'bottom_border': 5})
        #    barra_vencimiento.save(fnameimg_venc, bar_width=1)
        #pdf.image(fnameimg_venc, x=2.8, y=0.9 + ini_point_img, type='png', w=2.5, h=2)
        ########### Pallet
        pallimg = '%s/%s.png' % (ETIQUETA_DIR, pallobj.pall_numero)
        if not os.path.isfile(pallimg):
            barra_pallet = Code128Encoder(str(pallobj.pall_numero),
                                          options={'height': 50,
                                                   'label_border': 0, 'bottom_border': 0, 'ttf_fontsize:': 1})
            barra_pallet.save(pallimg, bar_width=1)
        pdf.image(pallimg, x=1.7, y=0.6 + ini_point_img, type='png', w=5, h=4)
        ########### qr code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=20,
            border=4,
        )
        acp = 'https://www.rkf.com.py/imp_man/dinamic_template/?app_name=warehouse_man&model_name=PalletsManag&template_name=warehouse_man/PalletItem.html&standalone=1&pk={}'.format(pallobj.pk)
        qr.add_data(acp)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        qrpfile = '/tmp/pqr_{}.png'.format(pallobj.pk)
        img.save(qrpfile)
        pdf.image(qrpfile, x=7.5, y=1+ini_point_img, type='png', w=1.8, h=1.8)
        #primera linea horizontal
        pdf.line(0.5, 1.8 + ini_point, 9.5, 1.8 + ini_point)
        # linea vertical, separa codigo barra articulo de la descripcion del articulo
        #pdf.line(2.8, 1.8 + ini_point, 2.8, 4 + ini_point)
        # linea vertical, separa articulo del numero de pallet
        #pdf.line(5.1, 1.8 + ini_point, 5.1, 4 + ini_point)
        # linea vertical, separa articulo del numero de pallet
        pdf.line(7.5, 1.8 + ini_point, 7.5, 4.7 + ini_point)
        # ultimoa linea horizontal
        pdf.line(0.5, 4.7 + ini_point, 9.5, 4.7 + ini_point)
        pdf.set_font('Arial',style='',size=6)
        pdf.set_y(5+ini_point)
        pdf.set_x(7.5)
        if reimpresion:
            labelinte = 'COPIA'
        else:
            labelinte = 'ORIGINAL'
        pdf.cell(1, 0, '{} {}'.format(labelinte, ahora.strftime('%d/%m/%Y %H:%M:%S')), align='R')
        pdf.set_y(5.2+ini_point)
        pdf.set_x(7)
        pdf.cell(1, 0, 'Usuario: {}'.format(userobj.username), align='R')
        cups_server = CupsPrinter()
        pdf.set_font('Arial',style='',size=7)
        pdf = copy.deepcopy(pdf)
        pdf.set_y(2.9+ini_point)
        pdf.set_x(8.5)
        # if not pallobj.completo:
        #     pdf.set_y(3.2+ini_point)
        #     pdf.set_x(8.5)
        #     pdf.cell(1,0, 'INCOMPLETO', align='R')
        fnamepdf = '%s/%s.pdf' % (ETIQUETA_DIR, pallobj.pall_numero)
        fnameimg = "%s/%s.jpg" % (ETIQUETA_DIR, pallobj.pall_numero)
        pdf.output(fnamepdf)
        params_impresion = {
            'impresora': impresora,
            'modulo': 'INGRESO',
            'ruta': fnamepdf,
            'opciones': {}
        }
        if settings.DEBUG:
            pass
            # params_impresion['modulo'] = 'ALL'
            # params_impresion['impresora'] = 'zebraribbon'
            # cups_server.imprimir_trabajo(**params_impresion)
        logging.info(params_impresion)
        if not settings.DEBUG:
           cups_server.imprimir_trabajo(**params_impresion)
           cups_server.imprimir_trabajo(**params_impresion)
        pdf.close()
        pallobj.save()
        print(fnamepdf)

def imprimir_etiquetas(palletsobjs, userobj, reimpresion, **kwargs):
    ETIQUETA_DIR = '%s/label_files' % PROJECT_ROOT
    ahora = datetime.datetime.now()
    celery_func = kwargs.get('celery_func')
    ini_point = 2
    ini_xpoint = 0.5    
    ini_point_img = 3
    for pallobj in palletsobjs:
        if celery_func:
            celery_func.update_state(state='STARTED',meta={'msg': 'Imprimiendo Pallet %s' % pallobj.pall_numero, 'porcentaje':  100})
        proforma = '0'
        lote = '0'
        fecha_vencimiento = 'ND'
        fecha_vencimientoscore = '0000000'
        if pallobj.articulo_fecha_vencimiento:
            fecha_vencimiento = pallobj.articulo_fecha_vencimiento.strftime('%d/%m/%Y')
            fecha_vencimientoscore = pallobj.articulo_fecha_vencimiento.strftime('%d%m%Y')
        if pallobj.articulo_lote:
            lote = pallobj.articulo_lote
        if pallobj.compraobj:
            proforma = '{} id: {}'.format(pallobj.compraobj.proforma, pallobj.compraobj.pk)
        pdf=FPDF('P','cm',(10, 12.5))
        pdf.add_page()
        pdf.set_font('Arial',style='',size=45)
        pdf.set_y(1+ini_point)
        pdf.set_x(0.6)
        if  pallobj.completo:
            pdf.cell(1, 0, '{}-C {}'.format(pallobj.pall_numero, 'A' if pallobj.averiado else ''), align='L')
        else:
            pdf.cell(1, 0, '{}-I {}'.format(pallobj.pall_numero, 'A' if pallobj.averiado else ''), align='L')
        # pdf.cell(1, 0, '%s'  % '23423554', align='L')
        pdf.set_font('Arial',style='',size=5)
        pdf.set_y(2.2+ini_point)
        pdf.set_x(8.5)
        pdf.cell(1, 0, '%s' % ahora.strftime('%d/%m/%Y'), align='R')
        pdf.set_y(2.4+ini_point)
        pdf.set_x(8.5)
        pdf.cell(1,0, '%s' % ahora.strftime('%H:%M:%S'), align='R')
        pdf.set_y(2.6+ini_point)
        pdf.set_x(8.5)
        pdf.cell(1,0, userobj.username, align='R')
        pdf.set_font('Arial',style='',size=8)
        pdf.set_y(2.2+ini_point)
        pdf.set_x(0.6)
        pdf.cell(1,0, 'PROFORMA: ', align='L')
        pdf.set_x(2.8)
        pdf.cell(1,0, proforma, align='L')
        pdf.set_y(2.6+ini_point)
        pdf.set_x(0.6)
        pdf.cell(1,0, 'LOTE: ', align='L')
        pdf.set_x(2.8)
        pdf.cell(1,0, lote, align='L')
        #vencimiento
        pdf.set_y(3+ini_point)
        pdf.set_x(0.6)
        pdf.cell(1,0, 'VENCIMIENTO: ', align='L')
        pdf.set_x(2.8)
        pdf.cell(1,0, fecha_vencimiento, align='L')
        #cajas
        pdf.set_y(3.4+ini_point)
        pdf.set_x(0.6)
        pdf.cell(1,0, 'CAJAS: ', align='L')
        pdf.set_x(2.8)
        pdf.cell(1,0, str(pallobj.pall_articulo_cajas), align='L')
        #unidades
        pdf.set_x(3.5)
        pdf.cell(1,0, 'UNIDADES:', align='L')
        pdf.set_x(5.2)
        pdf.cell(1,0, str(pallobj.pall_articulo_unidades), align='L')
        #totales
        pdf.set_x(5.6)
        pdf.cell(1,0, 'TOTAL:', align='L')
        pdf.set_x(6.7)
        pdf.cell(1,0, str(pallobj.pall_articulo_cantidad), align='L')
        #averiados
        # pdf.set_y(3.8+ini_point)
        # pdf.set_x(0.6)
        # pdf.cell(1,0, 'AVERIADOS: ', align='L')
        # pdf.set_x(2.8)
        # averiados = pallobj.cajas_averiado
        # pdf.cell(1,0, str(averiados), align='L')
        # #averiados unidades
        # pdf.set_x(3.5)
        # pdf.cell(1,0, 'UNIDADES:', align='L')
        # pdf.set_x(5.2)
        # averiados = pallobj.unidades_averiado
        # pdf.cell(1,0, str(averiados), align='L')
        # #totales averiados
        # pdf.set_x(5.6)
        # pdf.cell(1,0, 'TOTAL:', align='L')
        # pdf.set_x(6.7)
        # pdf.cell(1,0, str(pallobj.get_cantidadaveriados()), align='L')
        #linea
        pdf.line(0.5, 4+ini_point, 9.5, 4+ini_point)
        #seccion producto
        articuloimg = '%s/%s.png' % (ETIQUETA_DIR, pallobj.articuloobj.prod_codigoviejo)
        if not os.path.isfile(articuloimg):
            barra_articulo = Code128Encoder(str(pallobj.articuloobj.prod_codigoviejo),options={'height':60, 'label_border': 1, 'bottom_border': 5})
            barra_articulo.save(articuloimg, bar_width=1)
        pdf.image(articuloimg, x=0.5, y=3.1+ini_point_img)
        #linea vertical, separa codigo barra articulo de la descripcion del articulo
        pdf.line(3.1, 4+ini_point, 3.1, 6.5+ini_point)
        #descripcion del articulo
        pdf.set_y(4.3+ini_point)
        pdf.set_x(3.2)
        pdf.cell(1,0, 'ARTICULO:', align='L')
        pdf.set_x(4.8)
        pdf.cell(1,0, str(pallobj.articuloobj.prod_codigoviejo), align='L')
        pdf.set_font('Arial',style='',size=10)
        pdf.set_y(4.5+ini_point)
        pdf.set_x(3.2)
        pdf.multi_cell(6.5,0.5, pallobj.articuloobj.prod_descripcionnuevo, align='L')
        pdf.set_font('Arial',style='',size=8)
        #vencimiento
        fnameimg_venc = '%s/%s.png' % (ETIQUETA_DIR, fecha_vencimientoscore)
        if not os.path.isfile(fnameimg_venc):
            # print fecha_vencimiento, 'laalalal'
            barra_vencimiento = Code128Encoder(fecha_vencimiento, options={'height':40, 'label_border': 1, 'bottom_border': 5})
            barra_vencimiento.save(fnameimg_venc, bar_width=1)
        pdf.image(fnameimg_venc, x=4.5, y=4.0+ini_point_img, type='png', w=3, h=2)
        pallimg = '%s/%s.png' % (ETIQUETA_DIR, pallobj.pall_numero)
        if not os.path.isfile(pallimg):
            barra_pallet = Code128Encoder(str(pallobj.pall_numero),options={'height':50, 'label_border': 1, 'bottom_border': 5, 'show_label': False})
            barra_pallet.save(pallimg, bar_width=1)
        pdf.image(pallimg, x=3.0, y=5.9+ini_point_img, type='png', w=4, h=2)
        cups_server = CupsPrinter()

        pdf.set_font('Arial',style='',size=7)

        pdf = copy.deepcopy(pdf)
        pdf.set_y(2.9+ini_point)
        pdf.set_x(8.5)

        if reimpresion:
            labelinte = 'COPIA'
            pdf.cell(1,0, labelinte, align='R')
        else:
            labelinte = 'ORIGINAL'
            pdf.cell(1,0, labelinte, align='R')
        # if not pallobj.completo:
        #     pdf.set_y(3.2+ini_point)
        #     pdf.set_x(8.5)
        #     pdf.cell(1,0, 'INCOMPLETO', align='R')
        fnamepdf = '%s/%s.pdf' % (ETIQUETA_DIR, pallobj.pall_numero)
        fnameimg = "%s/%s.jpg" % (ETIQUETA_DIR, pallobj.pall_numero)
        pdf.output(fnamepdf)
        params_impresion = {
           'impresora': 'ZEBRA02',
           'modulo': 'INGRESO',
           'ruta': fnamepdf,
           'opciones': {}
        }
        # params_impresion = {
        #     'impresora': 'zebradyt',
        #     'modulo': 'ALL',
        #     'ruta': fnamepdf,
        #     'opciones': {}
        # }

        if settings.DEBUG:
            pass
            # params_impresion['modulo'] = 'ALL'
            # params_impresion['impresora'] = 'zebraribbon'
            # cups_server.imprimir_trabajo(**params_impresion)
        logging.info(params_impresion)
        if not settings.DEBUG:
           cups_server.imprimir_trabajo(**params_impresion)
           cups_server.imprimir_trabajo(**params_impresion)
        pdf.close()
        pallobj.save()

def imprimir_etiquetas_cajas(pallobj, articuloobj, usuario):
    ETIQUETA_DIR = '%s/label_files_cajas' % PROJECT_ROOT
    ahora = datetime.datetime.now()
    pdf=FPDF('L','cm',(10, 12.5))
    pdf.add_page()
    pdf.set_font('Arial',style='',size=6)
    pdf.set_y(1)
    pdf.set_x(0.6)
    pdf.cell(1, 0, 'ARTICULO: %s - %s'  % (articuloobj.articulocod, articuloobj.articulo_descripcion), align='L')
    pdf.set_y(1.5)
    pdf.set_x(0.6)
    pdf.cell(1, 0, 'LOTE: %s  UNIDADES: %s'  % (pallobj.articulo_lote, pallobj.articulo_unidades_x_pall), align='L')
    pdf.set_y(1.8)
    pdf.set_x(0.6)
    #linea
    pdf.line(0.5, 2, 11.5, 2)
    #seccion producto
    barra_articulo = Code128Encoder('%s|%s' % (articuloobj.codigo_barra_caja, pallobj.articulo_fecha_vencimiento.strftime('%Y%m%d')), options={'height':60, 'label_border': 1, 'bottom_border': 5})
    barra_articulo.save('%s/%s.png' % (ETIQUETA_DIR, pallobj.articulo_cod), bar_width=1)
    pdf.image('%s/%s.png' % (ETIQUETA_DIR, pallobj.articulo_cod), x=0.8, y=2.1)
    pdf.line(0.5, 4.5, 11.5, 4.5)
    pdf.set_y(4.7)
    pdf.set_x(0.5)
    pdf.cell(1, 0, 'BODEGA: %s  HORA: %s FECHA: %s IMPRESO POR: %s'  % (pallobj.bodega, ahora.strftime('%H:%M:%S'), ahora.strftime('%d/%m/%Y'), usuario), align='L')

    pdf.output('%s/%s_%s.pdf' % (ETIQUETA_DIR, articuloobj.articulocod, pallobj.articulo_fecha_vencimiento.strftime('%Y%m%d')))
    pdf.close()

    cups_server = CupsServer(settings.CUPS_ADMIN[0],
                         settings.CUPS_ADMIN[1]
                         )

    cups_server.modo_admin()
    for a in range(4):
        cups_server.imprimir_trabajo('Zebra_TLP2844', "%s/%s_%s.jpg" % (ETIQUETA_DIR, articuloobj.articulocod, pallobj.articulo_fecha_vencimiento.strftime('%Y%m%d')), {})

def imprimir_ruta_movimientos(bodega_movs):
    pdf=FPDF('L','cm','legal')
    pdf.add_page()
    pdf.set_font('Arial',style='',size=8)
    pdf.set_y(1)
    pdf.set_x(1)
    pdf.cell(1, 0, 'MOVIMIENTO' , align='L')
    pdf.set_x(3)
    pdf.cell(1, 0, 'TIPO' , align='L')
    pdf.set_x(5)
    pdf.cell(1, 0, 'PALLET' , align='L')
    pdf.set_x(7)
    pdf.cell(1, 0, 'CAJAS' , align='L')
    pdf.set_x(9)
    pdf.cell(1, 0, 'UNIDADES' , align='L')
    pdf.set_x(11)
    pdf.cell(1, 0, 'TOTAL' , align='L')
    pdf.set_x(13)
    pdf.cell(1, 0, 'OC' , align='L')
    pdf.set_x(15)
    pdf.cell(1, 0, 'PROFORMA' , align='L')
    pdf.set_x(20)
    pdf.cell(1, 0, 'ORIGEN' , align='L')
    pdf.set_x(25)
    pdf.cell(1, 0, 'DESTINO' , align='L')
    start_y = 1.3


    for index, bodega_mov in enumerate(bodega_movs, start=1):
        pdf.set_y(start_y)
        start_y += 0.5
        pdf.set_x(1)
        pdf.cell(1, 0, '%s' % bodega_mov.numero_movimiento, align='L')
        pdf.set_x(3)
        pdf.cell(1, 0, bodega_mov.tipo_movimiento , align='L')
        pdf.set_x(5)
        pdf.cell(1, 0, '%s' % bodega_mov.pall_numero , align='L')
        pdf.set_x(7)
        pdf.cell(1, 0, '%s' % bodega_mov.pall_cajas , align='L')
        pdf.set_x(9)
        pdf.cell(1, 0, '%s' % bodega_mov.pall_unidades , align='L')
        pdf.set_x(11)
        pdf.cell(1, 0, '%s' % bodega_mov.pall_cantidad_total , align='L')
        pdf.set_x(13)
        pdf.cell(1, 0, '%s' % bodega_mov.compra_numero , align='L')
        pdf.set_x(15)
        pdf.cell(1, 0, '%s' % bodega_mov.proforma , align='L')
        pdf.set_x(20)
        pdf.cell(1, 0,
                 '%s (%s:%s:%s)' % (bodega_mov.bodega_origen_area_cod,
                                    bodega_mov.bodega_origen_celda_posicion_alto,
                                    bodega_mov.bodega_origen_celda_posicion_ancho,
                                    bodega_mov.bodega_origen_celda_posicion_profundidad
                                    ),
                 align='L')
        pdf.set_x(25)
        pdf.cell(1, 0, '%s (%s:%s:%s)' % (
                                 bodega_mov.bodega_destino_area_cod,
                                 bodega_mov.bodega_destino_celda_posicion_alto,
                                 bodega_mov.bodega_destino_celda_posicion_ancho,
                                 bodega_mov.bodega_destino_celda_posicion_profundidad
                                 ) , align='L')

        if index != 0:
            if (index % 37) == 0:
                pdf.add_page(orientation='L')
                pdf.set_font('Arial',style='',size=8)
                pdf.set_y(1)
                pdf.set_x(1)
                pdf.cell(1, 0, 'MOVIMIENTO' , align='L')
                pdf.set_x(3)
                pdf.cell(1, 0, 'TIPO' , align='L')
                pdf.set_x(5)
                pdf.cell(1, 0, 'PALLET' , align='L')
                pdf.set_x(7)
                pdf.cell(1, 0, 'CAJAS' , align='L')
                pdf.set_x(9)
                pdf.cell(1, 0, 'UNIDADES' , align='L')
                pdf.set_x(11)
                pdf.cell(1, 0, 'TOTAL' , align='L')
                pdf.set_x(13)
                pdf.cell(1, 0, 'OC' , align='L')
                pdf.set_x(15)
                pdf.cell(1, 0, 'PROFORMA' , align='L')
                pdf.set_x(20)
                pdf.cell(1, 0, 'ORIGEN' , align='L')
                pdf.set_x(25)
                pdf.cell(1, 0, 'DESTINO' , align='L')

                start_y = 1.3
    pdf.output('/tmp/movimiento_%s' % int(uuid.uuid4()) )

def suppress_score(m):
    spaces = ' ' * (len(m.group()) -1)
    return '%s+' % spaces
