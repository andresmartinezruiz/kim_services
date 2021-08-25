var gusuo = null;
var lintg = null;
var Uix = {
    stand_modal: function (dhtml, mattrs) {
        gid = '_' + Math.random().toString(36).substr(2, 9)
        mats = {
            width: '100%', height: '100%',
            html: '<div id="automodal'+gid+'"></div>',
            showCancelButton: false,
            showConfirmButton: false,
            showLoaderOnConfirm: false,
        }
        if (mattrs) {
            for (oidx in mattrs){mats[oidx] = mattrs[oidx]}
        }
        Swal.fire(mats);
        $('#automodal'+gid).html(dhtml);
    },
    get_dinamic_modal(url,app_name, model_name, template, pk, dattrs, mattrs){
        esperar.cubrir('body');
        pps = {'app_name': app_name, 'template': template}
        if (pk) {
            pps['pk'] = pk;
            pps['model_name'] = model_name;
        }
        if (dattrs) {
            pps['dinamic_attrs'] = dattrs
        }
        axios.get(url, {params:pps,responseType: 'text'})
            .then(function (response) {
                var data = response.data;
                Uix.stand_modal(data, mattrs)
            })
            .catch(function (error) {
                mensajes.error(error);
            }).then(rsp=> { esperar.descubrir() })
    },
}
var UEvent = {
    trigger_event: function(el, tipo){
        e = document.createEvent('HTMLEvents');
        e.initEvent(tipo, false, true);
        el.dispatchEvent(e)
    }
}

var utils = {
    valid_data: function (data) {
        if (data === '0') {
            return false
        }
        if (data === 0) {
            return false
        }
        if (utils.is_objempty(data)) {
            return false
        }
        return true;
    },
    b64EncodeUnicode: function(str) {
        // first we use encodeURIComponent to get percent-encoded UTF-8,
        // then we convert the percent encodings into raw bytes which
        // can be fed into btoa.
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
						    function toSolidBytes(match, p1) {
							return String.fromCharCode('0x' + p1);
						    }));
    },
    is_objempty:  function(obj) {
	for(var key in obj) {
            if(obj.hasOwnProperty(key))
		return false;
	}
	return true;
    },
    download_files: function(files) {
          function download_next(i) {
            if (i >= files.length) {
              return;
            }
            var a = document.createElement('a');
            a.href = files[i].location_file;
            a.target = '_parent';
            // Use a.download if available, it prevents plugins from opening.
            if ('download' in a) {
              a.download = files[i].filename;
            }
            // Add a to the doc for click to work.
            (document.body || document.documentElement).appendChild(a);
            if (a.click) {
              a.click(); // The click method is supported by most browsers.
            } else {
              $(a).click(); // Backup using jquery
            }
            // Delete the temporary link.
            a.parentNode.removeChild(a);
            // Download the next file with a small timeout. The timeout is necessary
            // for IE, which will otherwise only download the first file.
            setTimeout(function() {
              download_next(i + 1);
            }, 500);
          }
          // Initiate the first download.
          download_next(0);
        },
    isArray: function(value) {
            return value && typeof value === 'object' && value.constructor === Array;
    },
    makeFullScrenn: function(selector, flex) {
        $(selector).toggleClass('Mfullscreen');
        if ($(selector).hasClass('Mfullscreen')) {
            $(selector).pqGrid( "option", "flexWidth", false);
            $(selector).pqGrid( "option", "flexHeight", false);
        } else {
            if (flex) {
                    $(selector).pqGrid( "option", "flexWidth", true);
                    $(selector).pqGrid( "option", "flexHeight", true);
            }
        }
    },
    populate_form: function(form_selector, data){
        $.each(data, function(name, val){
            var $el = $(form_selector+' [name="'+name+'"]');
            if ($el.length <= 0) {
                return true;
            }
            type = $el.attr('type');
            switch(type){
                case 'checkbox':
                    if (val) {
                        $el.attr('checked', 'checked');
                        break;
                    }
                case 'radio':
                    if (val) {
                        $el.filter('[value="'+val+'"]').attr('checked', 'checked');
                        break;
                    }
                case 'file':
                    break;
                default:
                    if (val){
                        $el.val(val);
                        $el.trigger('change');
                    }
            }
        });
    },
    dt_number_format_float:  function(data, type, drow, meta) {data = parseFloat(data); return $.number( data, 2, ',', '.' ); },
    dt_nb_fmt_float_int:  function(data, type, drow, meta) {data = parseFloat(data); return $.number( data, 0, ',', '.' ); },
    dt_nb_fmt_float_one:  function(data, type, drow, meta) {data = parseFloat(data); return $.number( data, 1, ',', '.' ); },
    dt_true_false:  function(data, type, drow, meta) {
         if (data) {
            return '<i class="fa fa-check"></i>';
         }
         return  '<i class="fa fa-times"></i>';
    },
    int_val: function(val) {
        return parseInt(val);
    },
    diff_day: function(date2, date1) {
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return diffDays;
    },
    s4generate: function(){
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
    },
    getuuid: function() {
          return utils.s4generate() + utils.s4generate() + '-' + utils.s4generate() + '-' + utils.s4generate() + '-' +
            utils.s4generate() + '-' + utils.s4generate() + utils.s4generate() + utils.s4generate();
    },
    zipArrays: function(arrays) {
        //convert two arrays in onw multiple arrays
        //example a = [0,1,2,3] b = [4,5,6] c = [[0,4], [1,5], [3, 6]]
        return Array.apply(null,Array(arrays[0].length)).map(function(_,i){
            return arrays.map(function(array){return array[i]});
        });
    },
    addCommas: function (nStr)  {
          nStr += '';
          x = nStr.split('.');
          x1 = x[0];
          x2 = x.length > 1 ? ',' + x[1] : '';
          var rgx = /(\d+)(\d{3})/;
          while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + '.' + '$2');
          }
          return x1 + x2;
    },

    getfulltime: function(){
        var m = new Date();
        return m.getUTCFullYear() +""+ (m.getUTCMonth()+1) +""+ m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds();
    },

    form_json: function(arr, dfiles){
        newo = {};
        for (idx in arr) {
            item = arr[idx];
            if (newo.hasOwnProperty(item.name)) {
                tmpvalue = newo[item.name];
                if (typeof(tmpvalue) === 'string') {
                    tmpvalue = [ tmpvalue, item.value ];
                    newo[item.name] = tmpvalue;
                } else {
                    newo[item.name].push(item.value);
                }
                continue
            }
            newo[item.name] = item.value;
        }
        // $.each(arr, function(i, item){
        //     if (newo.hasOwnProperty(item.name)) {
        //         tmpvalue = newo[item.name];
        //         if (typeof(tmpvalue) === 'string') {
        //             tmpvalue = [ tmpvalue, item.value ];
        //             newo[item.name] = tmpvalue;
        //         } else {
        //             newo[item.name].push(item.value);
        //         }
        //         return true;
        //     }
        //     newo[item.name] = item.value;
        // });
        //in new version you need to do this outside this form_json
        //using this sintax https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Uploading_a_file
        if (dfiles) {
            form_data = new FormData();
            $.each(dfiles, function (idx, val) {
                $ele = $(val);
                fileo = val.files[0];
                if (fileo) {
                    form_data.append($ele.attr('name'), fileo, fileo.name);
                }
            });
            $.each(newo, function (key, val) {
                form_data.append(key, val);
            });
            return form_data;
        }
        return newo;
    },
    form_json_list: function(arr) {
        newo = [];
        $.each(arr, function(i, item){
            newo.push({name: item.name, value: item.value });
        });
        return newo;
    },

    diac: function (){
        dateo = new Date();
        var curr_date = dateo.getDate();
        var curr_month = dateo.getMonth() + 1; //Months are zero based
        var curr_year = dateo.getFullYear();
        return curr_date + "/" + curr_month + "/" + curr_year
    },

    diaformat: function (dateo){
        var curr_date = dateo.getDate();
        var curr_month = dateo.getMonth() + 1; //Months are zero based
        var curr_year = dateo.getFullYear();
        return curr_date + "/" + curr_month + "/" + curr_year
    },

    datetimeformat: function (dateo){
        var curr_date = dateo.getDate();
        var curr_month = dateo.getMonth() + 1; //Months are zero based
        var curr_year = dateo.getFullYear();
        var hour = dateo.getHours();
        var minute = dateo.getMinutes();
        var second = dateo.getSeconds();
        return curr_date + "/" + curr_month + "/" + curr_year +' ' + hour + ":" + minute + ":" + second;
    },

    diai: function (plus_day){
        dateo = new Date();
        var curr_date = dateo.getDate();
        if (plus_day != undefined){
            curr_date += plus_day
        }

//        console.log(curr_date);
        if (curr_date.toString().length != 2 ) {
            curr_date = '0'+curr_date;
        }
        var curr_month = dateo.getMonth() + 1; //Months are zero based
        var curr_year = dateo.getFullYear();
        return curr_year + "-" + curr_month + "-" + curr_date;
    },

    horac: function (){
        dateo = new Date();
        var hora = dateo.getHours();
        var minutos = dateo.getMinutes();
        var segundos = dateo.getSeconds();
        return hora + ":" + minutos + ":" + segundos
    },
    parse_to_object: function(str){
        // nobject = JSON.parse('{"' + decodeURI(str).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
        // return nobject
        params = [];
        data = str.split('&');
        $.each(data, function(i, val) {
            para = val.split('=')
            params.push({'name': para[0], 'value':  para[1]});
        });
        return params;
    },
    parse_to_object_key: function(str){
        nobject = JSON.parse('{"' + decodeURI(str).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
        return nobject
    },
    update_object: function() {
        var ret = {};
        var len = arguments.length;
        for (var i=0; i<len; i++) {
            for (p in arguments[i]) {
                if (arguments[i].hasOwnProperty(p)) {
                    ret[p] = arguments[i][p];
                }
            }
        }
        return ret;
    },
    object_toarray: function(tobj) {
        ndata = [];
        for (idx in tobj) {
            ndata.push({'key': idx, 'value': data_utils.json2table(tobj[idx], 'table-responsive') })
        }
        return ndata;
    },
}
var data_utils = {
    json2table: function (json, classes) {
        if (!json) { return '' }
        if (json.constructor === String) {
            return json
        }
        if (json.length === 0) {
            return json
        }
        if (json.constructor === Object) {
            json = utils.object_toarray(json)
        }
        if (!json.constructor === Array) {
            return json
        }
        if (!json[0] === Object) {
            return json
        }
        if (!utils.valid_data(json)) {
            return json
        }
        var cols = Object.keys(json[0]);
        var headerRow = '';
        var bodyRows = '';

        classes = classes || '';

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        cols.map(function (col) {
            headerRow += '<th>' + capitalizeFirstLetter(col) + '</th>';
        });

        json.map(function (row) {
            bodyRows += '<tr>';

            cols.map(function (colName) {
                rdata = row[colName];
                if (rdata) {
                    if (rdata.constructor === Array) {
                        rdata = data_utils.json2table(rdata, 'table-responsive');
                    } else {
                        if (rdata.constructor === Object) {
                            rdata = data_utils.json2table(utils.object_toarray(rdata));
                        }
                    }
                }
                bodyRows += '<td style="word-wrap: break-word;min-width: 160px;max-width: 160px;">' + rdata + '</td>';
            });
            bodyRows += '</tr>';
        });

        return '<table class="' +
            classes +
            '"><thead><tr>' +
            headerRow +
            '</tr></thead><tbody>' +
            bodyRows +
            '</tbody></table>';
    },
    audit_diff_table: function(result) {
        diahtml = ['<div class="row">'];
        $.each(result, function(idx, val){
             if (val.length ==  2) {
                if ((!val[0]) || (!val[1])) {return; }
                diahtml.push('<div class="col col-md-5">');
                diahtml.push('<table class="table table-responsive table-bordered table-resumen">');
                diahtml.push('<thead>');
                diahtml.push('<tr>');
                diahtml.push('   <th>Campo</th>');
                diahtml.push('   <th>Valor</th>');
                diahtml.push('</tr>');
                diahtml.push('</thead>');
                diahtml.push('<tbody>');
                $.each(val[0], function(idxa, vala) {
                    if ((idxa === 'cargado_010_fecha') ||  (idxa === 'history_type') || (idxa === 'history_id') || (idxa === 'cargado_010_por_id') || (idxa === 'cargado_010_hora' )){
                      return;
                    }
                    diahtml.push('<tr>');
                    diahtml.push('<td>');
                    diahtml.push(idxa);
                    diahtml.push('</td>');
                    diahtml.push('<td>');
                    diahtml.push(data_utils.json2table(vala, 'table-responsive'));
                    diahtml.push('</td>');
                    diahtml.push('</tr>');
                });
                diahtml.push('</tbody>');
                diahtml.push('</table>');
                diahtml.push('</div>');
                diahtml.push('<div class="col col-md-5">');
                diahtml.push('<table class="table table-responsive table-bordered table-resumen">');
                diahtml.push('<thead>');
                diahtml.push('<tr>');
                diahtml.push('   <th>Campo</th>');
                diahtml.push('   <th>Valor</th>');
                diahtml.push('</tr>');
                diahtml.push('</thead>');
                diahtml.push('<tbody>');
                $.each(val[1], function(idxa, vala) {
                    if ((idxa === 'cargado_010_fecha') ||  (idxa === 'history_type') || (idxa === 'history_id') || (idxa === 'cargado_010_por_id') || (idxa === 'cargado_010_hora' )){
                      return;
                    }
                    diahtml.push('<tr>');
                    diahtml.push('<td>');
                    diahtml.push(idxa);
                    diahtml.push('</td>');
                    diahtml.push('<td>');
                    diahtml.push(data_utils.json2table(vala, 'table-responsive'));
                    diahtml.push('</td>');
                    diahtml.push('</tr>');
                });
                diahtml.push('</tbody>');
                diahtml.push('</table>');
                diahtml.push('</div>');
             }
        });
        diahtml.push('</div>');
        return diahtml;
    },
    diff_aobjects: function(dataj){
        result = dataj.map(function(v, index, array){
          if (index === 0 ){
             return [];
          }
          bindex = index - 1;
          bobject = array[bindex];
          databack = {};
          datav = {};
          databack['cargado_010_por_gecos'] = bobject.cargado_010_por_gecos;
          datav['cargado_010_por_gecos'] = v['cargado_010_por_gecos'];
          $.each(bobject, function(idkey, val){
               jval = JSON.stringify(val);
               jval2 = JSON.stringify(v[idkey]);
               if (jval !== jval2) {
                   databack[idkey] = val;
                   datav[idkey] = v[idkey];
               }
          });
          return [datav, databack];
        });
        return result;
    }
}
var control_submit = {
    no_enter: function(classname) {
        $(classname).keypress(function(e){
            if ( e.which == 13 ) return false;
            if ( e.which == 13 ) e.preventDefault();
        });
    }
}
var esperar = {
    animated: function(bar){
        var progress = setInterval(function() {
            if (bar.width()==400) {
                clearInterval(progress);
                $('.progress').removeClass('active');
            } else {
                bar.width(bar.width()+40);
            }
            bar.text(bar.width()/4 + "%");
        }, 800);
        return progress;
    },
    definir: function(){
        bar ='<br><br><br><br><br><br><div class="container" style="text-align: center";>'
            +'<div class="progress progress-striped active">'
            +'<div class="bar" style="width: 100%;">GENERANDO...</div>'
            +'</div>'
            +'</div>'
        return bar;
    },

    procesando: function(){
        bar = $('<div class="modal hide pro_dia" data-backdrop="static" data-keyboard="false">'
        +'<div class="modal-header">'
        +'    <h1>PROCESANDO...</h1>'
        +'</div>'
        +'<div class="modal-body">'
        +    '<div class="progress progress-striped active">'
        +        '<div class="bar" style="width: 100%;"></div>'
        +    '</div>'
        +'</div>'
        +'</div>');

        return bar;
    },
    mostrar_dialogo: function(){
        bar = this.procesando();
        bar.modal();
    },
    cerrar_dialogo: function(){
        $('.pro_dia').modal('hide');
    },
    cubrir: function(ele, texto) {
          if(!ele) {
              ele = $('body');
          }
          if (!texto) {
              texto = 'PROCESANDO';
          }
          left = 0
          params_style = {
                position:"fixed", // ze trick
                background:"#000 url('/static/dist/img/aco_loading.gif') no-repeat center",
                opacity:.5,
                top:0,
                bottom: 0,
                left:left,
                right: 0,
                'text-align': 'center',
                'text-size': 60,
                'text-color': 'RED',
                zIndex: 4999 // everything you want on top, gets higher z-index
            }
         dhtml_wait = '<div id=cubrir_ov><pre style="padding-top: 60px;"><h1>'+texto+'</h1></pre></div>';
          if (window.location.pathname === '/ds/smt/') {
              params_style = {
                  position: "fixed",
                  opacity: 0.5,
                  'text-align': "center",
                  'z-index': 4999,
                  background:"#000 url('/static/dist/img/aco_loading.gif') no-repeat center",
                  width: "100%",
                  height: "250px;",
                  // padding: "114px",
                  top: "9%",
                  // left: "50%"
              }
            dhtml_wait = '<div id=cubrir_ov><p style="padding-top: 146px;"><h1 class="text text-info">'+texto+'</h1></p></div>';
         };
        if (texto === undefined) { texto = 'PROCESANDO' };
        $(dhtml_wait).css(params_style).appendTo(ele);
            //55000
            setTimeout(function(){
                esperar.descubrir();
            }, 55000);
    },

    descubrir: function(){
        $('#cubrir_ov').remove();
    },

    descubrir_especifico: function(){
        $('.cubrir_ov').remove();
    },

    cubrir_especifico: function (ele) {
        $(ele).html('<div class=cubrir_ov><pre style="padding-top: 60px;"><h1>POR FAVOR ESPERE</h1></pre></div>');
        $('.cubrir_ov').css({
                background:"#000 url('/static/dist/img/gears.gif') no-repeat fixed center",
                opacity:.5,
                height: 'auto',
                width: 'auto',
                'text-align': 'center',
                'text-size': 60,
                'text-color': 'RED',
                zIndex: 4999 // everything you want on top, gets higher z-index
        })
            //55000
            setTimeout(function(){
                esperar.descubrir();
            }, 55000);
    }
}
var mensajes = {
    error: function(mensaje) {
            $.notify(mensaje, {globalPosition: "top left", autoHide: false, className: 'error' });
    },
    exitos: function(mensaje) {
            $.notify(mensaje, {globalPosition: "top left", autoHide: true, className: 'success' });
    },

    global_notification_pqgrid: function(rsp, grid, dial) {
	if (rsp.hasOwnProperty('rsp')) {
	    rsp = rsp.rsp;
	}
           $('.msg_operations_body').html('');
           redraw = false;
           t_error = "<strong>Oh no!!!</strong>"
           i_error = ""
           c_error = '#C46A69'
           time_error = 9000
           t_success = "Operacion Realizada"
           i_success = "fa fa-bell swing animated"
           c_success = "#739E73"
           time_success = 6000
           if (rsp.error) {
              titulo = t_error
              content = rsp.error
              icon = i_error
              timeout = 9000
              number = 1
              color = '#C46A69'
              // setTimeout(function(){
              //          $('.smallBox').css('height', '400px');
              //    }, 900);
            }
            if (rsp.exitos) {
              titulo = t_success
              content = '<strong>'+rsp.exitos+'</strong>'
              icon = i_success
              timeout = 6000
              number = 2
              color = c_success
              redraw = true;

           }
           if (redraw) {
              setTimeout(function(){
                       if (dial) {$(dial).dialog('close'); }
                       if (grid) { $(grid).pqGrid("refreshDataAndView");}
                 }, 600);
           }


           if (utils.isArray(rsp)) {
                error_t = [];
                error_content = ['<ul class="list-group">'];
                success_t = [];
                success_content = ['<ul class="list-group">'];
                $.each(rsp, function(idx, val){
                     if (val.error){
                         error_t = [t_error];
                         error_content.push('<li class="list-group-item list-group-item-danger">'+val.error+'</li>');
                     }
                     if (val.exitos){
                         success_t = [t_success];
                         success_content.push('<li class="list-group-item list-group-item-primary">'+val.exitos+'</li>');
                         redraw = true;
                     }
                });
                if (error_t.length > 0) {
                       error_content.push('</ul>')
                       mensajes.error(error_content.slice(1,4).join(''))
                }
                if (success_t.length > 0) {
                       success_content.push('</ul>')
                       mensajes.exitos(error_content.slice(1,4).join(''))
                      setTimeout(function(){
                              if (dial) {$(dial).dialog('close'); }
                              if (grid) { $(grid).pqGrid("refreshDataAndView");}
                        }, 600);
                }
               return
           }
           mensajes.exitos(content)
	esperar.descubrir();
    }

}
ui_control = {
    show_hide_component: function(selector, selector2) {
        element = $(selector).next();
        if (element.is(':hidden')) {
            element.show();
            return true;
        }
        if (element.is(':visible')) {
            element.hide();
            return true;
        }
    },
}
