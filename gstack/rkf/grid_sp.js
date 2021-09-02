let icon_print = '<i class="fas fa-print"></i>';
let icon_export = "<i class='fas fa-file-export'></i>";
let icon_user = '<i class="fa fa-user"></i>';
let icon_calendar = '<i class="fa fa-calendar"></i>'
pqgrid = {
    initialize: () => {
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
    },
    execution: {
        opts_model: (pps, grid_selector, edata, justone)=>{
            esperar.cubrir('body');
            let grid_element = $(grid_selector).pqGrid('getInstance').grid;
            let oldList = [];
            let updateList = [];
            let eles = grid_element.SelectRow().getSelection();
            if (eles.length <= 0) {
                esperar.descubrir();
                mensajes.error('Elija un item');
                return false;
            }
            if (justone) {
                if (eles.length > 1) {
                    esperar.descubrir();
                    mensajes.error('Solo puede elegir un item a la vez para este proceso');
                    return false;                    
                }
            }
            for (let idx in eles) {
                rd = eles[idx].rowData;
                tmpobj = {'_id': rd._id, 'pk': rd._id, 'id': rd._id};
                if (edata) {
                    edata.forEach((itobj)=>{
                        tmpobj[itobj.name] = itobj.value;
                    })
                }
                updateList.push(tmpobj);
                oldList.push(tmpobj);
            }
            pps.push({name: 'updateList', value: JSON.stringify(updateList)});
            pps.push({name: 'oldList', value: JSON.stringify(oldList)});
            let furl = api_urls.operation_record;
            let formd = new FormData();
            Object.keys(pps).forEach(key => formd.append(pps[key].name, pps[key].value));
            axios.post(furl, formd).then(function (rsp) {
                response = rsp.data;
                mensajes.global_notification_pqgrid(response, grid_selector, undefined);
                esperar.descubrir();
            }).catch(err => console.log(err))
                .then(function () {
                    esperar.descubrir();
                })
        }
    },
    formatters: {
        currency: '#.###',
        floats: '#,###.0'
    },
    renders: {
        jsoarray: (ui) => {
            rd = ui.cellData;
            tr = ['<table class="table table-bordered"><tbody>'];
            if (!Array.isArray(rd)) {
                try {
                    tmprd = rd;
                    rd = JSON.parse(rd);
                    if (!Array.isArray(rd)) {
                        rd = tmprd.split(',');
                        ui.rowData[ui.dataIndx] = rd;
                    } else {
                        ui.rowData[ui.dataIndx] = rd;
                    }

                } catch {
                    rd = rd.split(',');
                    ui.rowData[ui.dataIndx] = rd;
                }

            }
            rd.forEach((itobj) => {
                tr.push('<tr>');
                tr.push('<td>');
                tr.push(itobj);
                tr.push('</td>');
                tr.push('</tr>');
            })
            tr.push('</tbody></table>');
            return tr.join('');
        },
        boolean: (ui) => {
            if (ui.cellData) { return '<i class="fa fa-thumbs-up"></i>'; }
            return '<i class="fa fa-thumbs-down"></i>';
        },
        date: (ui) => {
            data = ui.cellData;
            return { 'text': moment(data).format('DD/MM/YY') };
        }
    },
    toolbar: {
        set_pqselect_toolbar: function(toolbar) {
            $.each(toolbar.items, function(idx, val) {
                if (val.type === 'select') {
                    if (!val.hasOwnProperty('cls')) {
                        val.cls = 'none';
                    }
                if (!val.cls.startsWith('columnSelector')) {
                    width  = 120;
                    if (val.width) {width = val.width;}
                    psel = {width: width};
                    if (val.placeholder){psel.singlePlaceholder = val.placeholder;}
                    if (val.multipleplaceholder){psel.multiplePlaceholder = val.multipleplaceholder;}
                    $('.'+val.cls).pqSelect(psel);
                }
                }
            });
        },        
        edittool: (model_name, app_name) => {
            return {
                type: 'button',
                cls: 'btn btn-secondary btn-xs',
                label: '<span class="label label-info"><i class="fa fa-edit"></i></span>',
                listener: function () {
                    let selector = '#' + this.element.attr('id');
                    Swal.fire({
                        title: 'Confirmacion',
                        text: 'Esta seguro ?',
                        showCancelButton: true,
                        preConfirm: () => {
                            edata = pqgrid.helpers.editdata(model_name, app_name, selector)
                            api_models.update_bulk(edata).then((rsp) => {
                                data = rsp.data;
                                mensajes.global_notification_pqgrid(data, selector, undefined);
                            }).catch((err) => {
                                mensajes.error(err)
                            })
                        }
                    })
                },
            }
        },
        verify_model: (model_name, app_name, title, grid_selector) => {
            return {
                type: 'button',
                cls: 'btn btn-secondary btn-xs changes',
                label: `<span class="label label-primary">${title}</span>`,
                listener: function () {
                    Swal.fire({
                        title: 'Confirmacion',
                        text: 'Esta seguro ?',
                        showCancelButton: true,
                        preConfirm: () => {
                            pps = [
                                {name: 'app_name', value: 'imp_man'},
                                {name: 'module_name', value: 'imp_man.imp_man_manag'},
                                {name: 'class_name', value: 'ImpManag'},
                                {name: 'method_name', value: 'opts_model'},
                                {name: 'model_name', value: model_name},
                                {name: 'model_app', value: app_name},
                                {name: 'op', value: 'verificado_045'},
                                {name: 'checknop', value: 'aprobado_050'},
                            ];
                            pqgrid.execution.opts_model(pps, grid_selector);
                        }
                    })
                },
            }            
        },
        approved_model: (model_name, app_name, title, grid_selector) => {
            return {
                type: 'button',
                cls: 'btn btn-secondary btn-xs changes',
                label: `<span class="label label-success">${title}</span>`,
                listener: function () {
                    Swal.fire({
                        title: 'Confirmacion',
                        text: 'Esta seguro ?',
                        showCancelButton: true,
                        preConfirm: () => {
                            pps = [
                                {name: 'app_name', value: 'imp_man'},
                                {name: 'module_name', value: 'imp_man.imp_man_manag'},
                                {name: 'class_name', value: 'ImpManag'},
                                {name: 'method_name', value: 'opts_model'},
                                {name: 'model_name', value: model_name},
                                {name: 'model_app', value: app_name},
                                {name: 'op', value: 'aprobado_050'},
                                {name: 'checkfalse', value: 'verificado_045'},
                                {name: 'justone', value: 1},
                            ];
                            pqgrid.execution.opts_model(pps, grid_selector);
                        }
                    });
                },
            }
        },
        reinitialize: (model_name, app_name, title, grid_selector) => {
                return {
                    type: 'button',
                    cls: 'btn btn-secondary btn-xs changes',
                    label: `<span class="label label-warning">${title}</span>`,
                    listener: function () {
                        Swal.fire({
                            title: 'Confirmacion',
                            text: 'Esta seguro ?',
                            showCancelButton: true,
                            preConfirm: () => {
                                pps = [
                                    {name: 'app_name', value: 'imp_man'},
                                    {name: 'module_name', value: 'imp_man.imp_man_manag'},
                                    {name: 'class_name', value: 'ImpManag'},
                                    {name: 'method_name', value: 'opts_model'},
                                    {name: 'model_name', value: model_name},
                                    {name: 'model_app', value: app_name},
                                    {name: 'op', value: 'reinicializar'},
                                    {name: 'checkfalse', value: 'aprobado_050'},
                                    {name: 'checkdate', value: 7},
                                ];
                                pqgrid.execution.opts_model(pps, grid_selector);
                            }
                        });
                    },                
            }
        },
        cancel_model: (model_name, app_name, title, grid_selector) => {
            return {
                type: 'button',
                cls: 'btn btn-secondary btn-xs changes',
                label: `<span class="label label-danger">${title}</span>`,
                listener: function () {
                    Swal.fire({
                        title: 'Confirmacion',
                        text: 'Esta seguro ?',
                        showCancelButton: true,
                        preConfirm: () => {
                            pps = [
                                {name: 'app_name', value: 'imp_man'},
                                {name: 'module_name', value: 'imp_man.imp_man_manag'},
                                {name: 'class_name', value: 'ImpManag'},
                                {name: 'method_name', value: 'opts_model'},
                                {name: 'model_name', value: model_name},
                                {name: 'model_app', value: app_name},
                                {name: 'op', value: 'anulado_040'},
                                {name: 'justone', value: 1},
                            ];
                            pqgrid.execution.opts_model(pps, grid_selector);
                        }
                    });
                },
            }
        },
        execute_onselection: (app_name, module_name, class_name, method_name, title, grid_selector) => {
            return {
                type: 'button',
                cls: 'btn btn-secondary btn-xs changes',
                label: `<span class="label label-info">${title}</span>`,
                listener: function () {
                    Swal.fire({
                        title: 'Confirmacion',
                        text: 'Esta seguro ?',
                        showCancelButton: true,
                        preConfirm: () => {
                            pps = [
                                {name: 'app_name', value: app_name},
                                {name: 'module_name', value: module_name},
                                {name: 'class_name', value: class_name},
                                {name: 'method_name', value: method_name},
                            ];
                            pqgrid.execution.opts_model(pps, grid_selector);
                        }
                    });
                },
            }            
        }
    },
    helpers: {
        editdata: (model_name, model_app, selector) => {
            let grid = $(selector).pqGrid("getInstance").grid;
            let chgs = grid.getChanges({ format: 'byVal', all: false });
            bdata = []
            chgs.updateList.forEach((itobj) => {
                let tmpobj = itobj;
                tmpobj.pk = tmpobj.id;
                delete tmpobj.id;
                tmpobj.model_name = model_name;
                tmpobj.model_app = model_app;
                bdata.push(tmpobj)
            });
            return bdata;
        },
        getDataArray: (ui) => {
            d = ui.$cell.find("select").val();
            tmp = {}
            if (!Array.isArray(d)) {
                d = d.replace(/'/g, '"')
                d = JSON.stringify(JSON.parse(z));
            }
            tmp[ui.dataIndx] = d
            return tmp
        },
        check_editable: (ui) => {
            rd = ui.rowData;
            if (rd.aprobado_050) { return false }
            if (rd.pago <= 0) { return false }
            return true;
        }
    }
}