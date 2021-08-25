var hideobj = {};
var OneSignal;
var myip = '0'

var loading_ehtml = '<div class="loading_egif">' +
                '<div class="spinner">\n' +
                '  <div class="bounce1"></div>\n' +
                '  <div class="bounce2"></div>\n' +
                '  <div class="bounce3"></div>\n' +
                '</div>' +
                '</div>';
var loading_html = '<div class="loading_ggif">' +
                '<div class="spinner">\n' +
                '  <div class="bounce1"></div>\n' +
                '  <div class="bounce2"></div>\n' +
                '  <div class="bounce3"></div>\n' +
                '</div>' +
                '</div>';
var ui_dialog_interaction;
var sentry_setup =  function(sentry_host){
    Raven.config(sentry_host).install();
};

var set_gerror = function(){
    window.onerror = function() {
        $('.loading_ggif').remove();
        $('.loading_egif').remove();
    };
};

var set_ajaxevents = function(){
    $( document )
        .ajaxSend(function(event, request, settings){
            $('body').append(loading_html);
            if (settings.url.search(/get_jsonmodel/i) >= 0) {
                null;
            }
            if (settings.url.search(/get_jsoncache/i) >= 0) {
                null;
            }
            if (settings.url.search(/execute_module/i) >= 0) {
                null;
            }
            if (settings.url.search(/alter_record/i) >= 0) {
                null;
            }
            if (settings.url.search(/operation_record/i) >= 0) {
                null;
            }
            if (settings.url.search(/dinamic_template/i) >= 0) {
                null;
            }
        })
        .ajaxComplete(function( event, request, settings ) {
            $('.loading_ggif').remove();
            $('.loading_egif').remove();
        })
        .ajaxError(function(event, request, settings) {
            error_html = '<div class="loading_error">' +
                '<section class="error_msg">\n' +
                    '  <h1>500 Server Error</h1>\n' +
                    '  <div class="container">\n' +
                    '    <span class="error_msg_message" id="js-whoops"></span> <span class="error_msg_message" id="js-appears"></span> <span class="error_msg_message" id="js-error"></span> <span class="error_msg_message" id="js-apology"></span>\n' +
                    '    <div><span class="" id="js-hidden"><h3>😢 Oh Oh, parece que algo no esta correcto</h3></span></div>\n' +
                    '  </div>\n' +
                '</section>' +
                '</div>';
            error_html = '<div class="loading_error">' +
                '...' +
                '</div>'
            $('body').append(error_html);
            setTimeout(function(){
                $('.loading_error').remove();
            }, 1000)
        });
}
var hide_ui = function () {
    if (hideobj.hasOwnProperty('columns')) {
        $.each(hideobj.columns, function (idx, val) {
            if (!document.getElementById(idx)) {
                return true;
            }
            grid_tmp = $('#' + idx);
            vcolumns = grid_tmp.pqGrid('getColModel');
            origcols = {};
            $.each(vcolumns, function (cidx, cval) {
                if ((cidx === 0) || (cidx === 1)) {
                    return true;
                }
                origcols[cval.dataIndx] = cidx;
                if (vcolumns[cidx]) {
                    vcolumns[cidx].hidden = true;
                }
            });
            $.each(val, function (ctidx, ctval) {
                clidx = parseInt(origcols[ctval]);
                if (vcolumns[clidx]) {
                    vcolumns[clidx].hidden = false;
                }
            });
            grid_tmp.pqGrid("option", "colModel", vcolumns);
            grid_tmp.pqGrid('refresh');
        });
    }
    setTimeout(function () {
        if (hideobj.hasOwnProperty('hidecmp')) {
            $.each(hideobj.hidecmp, function (idx, val) {
                $(val).remove();
            });
        }
    }, 300);
}

set_pqgrid_conf = function () {
    $.fn.bootstrapBtn = $.fn.button.noConflict();
    $.fn.bootstrapTooltip = $.fn.tooltip.noConflict();
    if ($.paramquery && $.paramquery.pqGrid) {
        var options = $.paramquery.pqGrid.defaults,
            css = options.collapsible.css;
        //css.zIndex = 20000;
        css.marginTop = "51px";
        //css.marginLeft = "250px";
        (options.animModel || {}).on = true;
        options.toggle = function (evt, ui) {
            //debugger;
            if (ui.state == "max") {
                if (this.nodeName) {
                    $(this).pqGrid("option", "height", "100%-51");
                } else {
                    this.option("height", "100%-51");
                }
            }
        };
        $.extend($.paramquery.pqGrid.defaults,
            {
                width: 800,
                height: 600,
                showTitle: false,
                freezeRows: 0,
                flexHeight: false,
                flexWidth: true,
                menuIcon: true,
                collapsible: false,
                sortable: true,
                resizable: true,
                wrap: true,
                editable: true,
            }
        );
        $.extend(true, $.paramquery.pqGrid.defaults, {
            flex: {on: true},
            numberCell: {show: true},
            selectionModel: {type: 'cell'},
            sortModel: {type: 'local'},
            menuUI: {
                singleFilter: true,
                gridOptions: {
                    flexHeight: false,
                    flexWidth: false,
                    trackModel: {on: false},
                    historyModel: {on: false},
                    history: function(evt, ui){
                        null
                    },
                    autoRow: false,
                    copyModel: {render: true},
                    fillHandle: '',
                    filterModel: {header: true, on: true},
                    hoverMode: 'row',
                    hwrap: false,
                    rowBorders: false,
                    rowHt: 22,
                    rowHtHead: 23,
                    scrollModel: {autoFit: true},
                    showTop: false,
                    height: 300,
                    wrap: false,
                    columnTemplate: {filter: {crules: [{condition: 'contain'}]}, editable: true, width: 100, minWidth:10},
                    pageModel: {}
                }
            },
            filterModel: {on: true, model: 'AND', header: true, type: 'local', menuIcon: true},
            copyModel: {render: true},
            columnTemplate: {
                filter: {crules: [{condition: 'contain'}]},
                editable: false,
                width: 100,
                exportRender: true,
                minWidth:10
            },
            pageModel: {
                type: "local", rPP: 200, strRpp: "{0}", strDisplay: "{0} to {1} of {2}",
                rPPOptions: [20, 50, 100, 200, 300, 400, 500, 600, 700, 800]
            },
            trackModel: {on: true},
            rowInit: function (ui) {
                if (ui.rowData.anulado_040) {return {style: "background:#FFDBD6;"};}
                if (ui.rowData.aprobado_050) {return {style: "background:#ECFDC9;"};}
                if (ui.rowData.verificado_045) {return {style: "background:#CFE4FB;"};}
                if (ui.rowData.bonifica) {return {style: "background:#FFEBCA;"};}
            },
            create: function (evt, ui) {this.loadState({refresh: false});},
            load: function (event, ui) {hide_ui();},
            scrollModel: {autoFit: true},
            history: function (evt, ui) {
                var $tb = this.toolbar();
                if (ui.canRedo != null) {
                    $("button:contains('Rehacer')", $tb).button("option", "disabled", !ui.canRedo);
                }
                $("button:contains('Deshacer')", $tb).button("option", {label: 'Deshacer (' + ui.num_undo + ')'});
                $("button:contains('Rehacer')", $tb).button("option", {label: 'Rehacer (' + ui.num_redo + ')'});
            },
        });
        $.extend($.paramquery.pqGrid.defaults, $.paramquery.pqGrid.regional['es']);
        $.extend($.paramquery.pqPager.defaults, $.paramquery.pqPager.regional['es']);
    }
    // if ($.paramquery && $.paramquery.pqGrid) {
    //     var options = $.paramquery.pqGrid.defaults,
    //         css = options.collapsible.css;
    //     //css.zIndex = 20000;
    //     css.marginTop = "51px";
    //     //css.marginLeft = "250px";
    //     (options.animModel || {}).on = true;
    //
    //     options.toggle = function (evt, ui) {
    //         //debugger;
    //         if (ui.state == "max") {
    //             if (this.nodeName) {$(this).pqGrid("option", "height", "100%-51");}
    //             else {this.option("height", "100%-51");}
    //         }
    //     }
    // $.extend( true, $.paramquery.pqGrid.defaults,
    //    { rowInit: function (ui) {
    //        if (ui.rowData.anulado_040) {return {style: "background:#e43725;"};}
    //        if (ui.rowData.aprobado_050) {return {style: "background:#77b300;"};}
    //        if (ui.rowData.verificado_045) {return {style: "background:#375a7f;"};}
    //        if (ui.rowData.bonifica) {return {style: "background:#e08e0b;"};}
    //    }});
    // }
}
set_jdialog_conf = function () {
    if ($.ui && $.ui.dialog && $.ui.dialog.prototype._allowInteraction) {
        ui_dialog_interaction = $.ui.dialog.prototype._allowInteraction;
        $.ui.dialog.prototype._allowInteraction = function (e) {
            if ($(e.target).closest('.select2-dropdown').length) return true;
            return ui_dialog_interaction.apply(this, arguments);
        };
    }
}
set_select2_conf = function () {
    $.fn.select2.defaults.set("theme", "bootstrap");
}
set_agrid_conf = function () {
    agGrid.LicenseManager.setLicenseKey('ag-Grid_Evaluation_License_Key_Not_for_Production_1Devs10_January_2018__MTUxNTU0MjQwMDAwMA==8830dbe7d628f87ebb04ff34328f72eb');
}

set_task_conf = function () {
    task_noti = function (selector) {
        element = $(selector);
        if (element.is(':hidden')) {
            element.show();
        } else {
            element.hide();
        }
    }
}

set_moment_conf = function () {
    moment.locale('es');
}
reload_profile = function (url) {
    $.getJSON(url, function (response) {
        hideobj = JSON.parse(response.hideobj);
    });
}
moment_render_calendar = function (data) {
    mobj = moment(data);
    return mobj.calendar();
}

set_onesignal_conf = function (apiid) {
    OneSignal = OneSignal || [];
    OneSignal.push(
        ["init", {
            appId: apiid,
        }]
    );
}

check_onesignal_conf = function() {
    return OneSignal.getSubscription().then(
        function(rsp) {
            if (rsp === false) {
                alert('No estas suscripto al sistema de notificaciones del RKF SYSTEM. ' +
                    'Favor hazlo mediante la campanita de tu izquierda')
            }
            return rsp
        }
    );
}

set_firebase_conf = function () {
    var config = {
        apiKey: "AIzaSyCz3zm0F7BOXRdJ8pxC3AHTypSOTAd5DpE",
        authDomain: "netipamobile.firebaseapp.com",
        databaseURL: "https://netipamobile.firebaseio.com",
        projectId: "netipamobile",
        storageBucket: "netipamobile.appspot.com",
        messagingSenderId: "1066618937564"
    };
    firebase.initializeApp(config);
    messaging = firebase.messaging();
    messaging.usePublicVapidKey("BK8MmOme_DA_jamMyrxE2VCGMn3hw5yK38Hs51SiRfZFoiBj5KISSmevzZYOoGhTJy0d_E01Gna1vCufVxWhiN8");
    messaging.requestPermission().then(function () {
        mensajes.exitos('Permiso de mensajeria establecido');
        messaging.getToken().then(function (token) {
            params = {'addlist': [], 'usuario': '{{ request.user.username }}'}
            addlist = [];
            addlist.push({
                app_name: 'imp_man', model_name: 'NDevice', token: token,
                telefono: '{{ request.user.userprofile.celular }}',
                usuario: '{{ request.user.username }}',
                tipo: 'WEB'
            });
            params['addlist'] = JSON.stringify(addlist);
            $.post('{% url "operation_record" %}', params, function (response, textStatus, xhr) {
                mensajes.global_notification_pqgrid(response, undefined, undefined);
            }, 'json');
        });
    }).catch(function (err) {
        mensajes.error('Si no concedes permisos de notificaciones no recibiras los updates');
    });
    messaging.onMessage(function (payload) {
        data = payload.data;
        dhtml = [
            '<h3>', data.body, '</h3><hr>',
            'Favor visite <a class="btn btn-link" href="https://www.rkf.com.py/ds/smt_netipa/">RKFWeb</a>'
        ]
        $.smallBox({
            title: data.titulo,
            content: dhtml.join(''),
            color: "#739E73",
            iconSmall: "fa fa-bell swing animated",
            /* timeout : 15000 */
        });
    });
}

var only_icons = function() {
    ele = $('.label-title');
    if (ele.css('display') === 'none') {
        ele.show();
        localStorage.setItem('only_icons', false);
    } else { ele.hide();
       localStorage.setItem('only_icons', true);
    }
}

var state_icons_menu = function(){
    ele = $('.label-title');
    oicons = localStorage.getItem('only_icons');
    if (oicons) {
        ele.hide();
    } else {
       ele.show();
    }
}

get_localip = function(url) {
     window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;//compatibility for Firefox and chrome
     var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};
     pc.createDataChannel('');//create a bogus data channel
     pc.createOffer(pc.setLocalDescription.bind(pc), noop);// create offer and set local description
     pc.onicecandidate = function(ice)
     {
         if (ice && ice.candidate && ice.candidate.candidate)
         {
             myip = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
             pc.onicecandidate = noop;
             set_ipnetwork(url, myip);
         }
     };
     console.log('Configure local ip address');
}

set_ipnetwork = function(url, mip){
    params = [
        {'name': 'app_name', 'value': 'dashboard'},
        {'name': 'module_name', 'value': 'dashboard.dashboardmanag'},
        {'name': 'class_name', 'value': 'SbUser'},
        {'name': 'method_name', 'value': 'set_ipnetwork'},
        {'name': 'mip', 'value': mip},
    ];
    $.post(url, params, function(rsp){
        console.log(rsp)
    }, 'json');
}

set_osplayerid = function(url){
    OneSignal.getUserId(function(id){
        if (id === null) {
            alert('No estas suscripto al sistema de notificaciones del RKF SYSTEM. ' +
                  'Favor hazlo mediante la campanita de tu izquierda')
        }
        furl = new URL(url);
        vdata = JSON.stringify([{'token': id}]);
        params = [
            {name:'key_name', value:'salamanca'},
            {name:'app_name', value: 'dashboard'},
            {name:'module_name',value: 'dashboard.dashboardmanag'},
            {name:'class_name',value:'SbUser'},
            {name:'method_name',value:'set_osplayerid'},
            {name:'updateList',value:vdata},
            {name:'oldList',value:vdata},

        ];
        fdata = new FormData();
        Object.keys(params).forEach(key => fdata.append(params[key].name, params[key].value));
        fdata = {
            method: 'POST',
            mode: 'same-origin',
            cache: 'no-cache',
            header: {'Content-Type': 'application/json'},
            body: fdata
        };
        fetch(furl, fdata)
        .then(rsp => rsp.json())
        .then(function(jdata){
            mensajes.global_notification_pqgrid(jdata, undefined, undefined);
        })
        .catch(err => console.log(err));
    });
};

l1numbers = {
    fnumber: function() {
        String.prototype.fnumber = function (sep) {
            return Math.floor(this).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1"+sep);
       };
    }
};