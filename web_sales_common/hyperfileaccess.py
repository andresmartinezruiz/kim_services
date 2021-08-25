#coding: utf-8
__doc___ = """
Class to retrieve data from HFSQL.
There is a limit in the length of the SQL to transfer over the network to the server
"""
import logging
import subprocess
from django.conf import settings
import unicodecsv as csv
import StringIO
logger = logging.getLogger('netipa_main')

class HFSAccess(object):
    def conver_list_unicode(self, ilist):
        nlist = []
        for i in ilist:
            if isinstance(i, str):
                nlist.append(unicode(i, 'utf-8', errors='replace').replace('\n', '').replace('\r', ''))
            if isinstance(i, unicode):
                nlist.append(unicode(i, 'utf-8', errors='replace').replace('\n', '').replace('\r', ''))
            else:
                nlist.append(i.replace('\n', '').replace('\r', ''))
        return nlist

    def hyperfile_query(self, *args):
        """
        Connect to a hyperfile database and make a query
        """
        command_line = '%s/ConsultasSQL_Linux32/consultasSQL_Linux32' % settings.COMMANDS_DIRS
        ini_file = '"%s"' % args[0]
        sql = '"%s"' % args[1]
        fcmd = """%s %s %s""" % (command_line, ini_file, sql)
        # logger.info('')
        # logger.info('EJECUTANDO WINDEV QUERY %s' % fcmd)
        # logger.info('')
        # print fcmd
        out = subprocess.Popen(fcmd,
                               shell=True,
                               stdout=subprocess.PIPE,
                               stderr=subprocess.PIPE)
        data = out.stdout.readlines()
        out.kill()
        tmpf = StringIO.StringIO()
        map(tmpf.write, data)
        tmpf.seek(0)
        return tmpf
        # data = self.conver_list_unicode(data)
        # return data

    def parse_hyperfie_query(self, hfsqueryfile):
        hfsdata = list(csv.DictReader(hfsqueryfile, quotechar='"', delimiter=';', encoding='latin-1'))
        return hfsdata

    def get_last_egreso_nro(self, **kwargs):
      ini_file = kwargs.get('ini_file')
      ini_file = settings.HSINIS.get(ini_file)
      query_egr_last = """select * from egr_solicitudegreso order by SolicitudEgresoID desc limit 1"""
      print(query_egr_last)
      data = self.parse_hyperfie_query(self.hyperfile_query(
                        "%s" % ini_file,
                        query_egr_last
          ))
      last_egr = int(data[0].get('SolicitudEgresoID')) + 1
      return last_egr            

    def execute_windevquery(self, **kwargs):
      query_dict = kwargs.get('query_dict')
      query = query_dict.get('query')
      print(query)
      ini_file = query_dict.get('ini_file', 'aco')
      ini_file = settings.HSINIS.get(ini_file)
      data = self.parse_hyperfie_query(self.hyperfile_query(
                          "%s" % ini_file,
                          query
            ))
      return data        

