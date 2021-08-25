vform = {
    serializers: {
        data_structure: (elem, edata) => {
            var inputs = elem.elements;
            // Iterate over the form controls
            for (i = 0; i < inputs.length; i++) {
                ipobj = inputs[i]
                if (ipobj.getAttribute('data-ds') === "json_array") {
                    tmpvalue = edata[ipobj.name]
                    if (!Array.isArray(tmpvalue)) {
                        edata[ipobj.name] = jfy([tmpvalue]);
                    } else {
                        edata[ipobj.name] = jfy(tmpvalue);
                    }
                }
            }
            return edata
        },
        from: (elem) => {
            let fdata = new FormData(elem)
            newo = {};
            fdata.forEach((item, idx) => {
                if (newo.hasOwnProperty(idx)) {
                    tmpvalue = newo[idx];
                    if (typeof (tmpvalue) === 'string') {
                        tmpvalue = [tmpvalue, item];
                        newo[idx] = tmpvalue;
                    } else {
                        newo[idx].push(item);
                    }
                } else {
                    newo[idx] = item;
                }
            });
            return vform.serializers.data_structure(elem, newo);
        }
    },
    submission: {
        add_model: (fsel, model_app, model_name, gsel) => {
            vform.formatter.currency(true);
            qelem(fsel).addEventListener('submit', (evt) => {
                vform.formatter.currency(false);
                evt.preventDefault();
                let ffdata = vform.serializers.from(qelem(fsel));
                pps = [
                    { name: 'model_app', value: model_app },
                    { name: 'model_name', value: model_name }
                ];
                for (idx in ffdata) {
                    pps.push({ name: idx, value: ffdata[idx] });
                }
                api_models.add_model(pps).then((rsp) => {
                    vform.helpers.success(rsp, fsel, gsel);
                }).catch((err) => {
                    vform.helpers.error(err);
                });
            })
        },

    },
    search: {
        select2: ({ app_name,
            model_name,
            model_key,
            sterm,
            nelem,
            plh,
            fdisplay = '_id',
            squery = {},
            theme = 'bootstrap',
            width = '240px',
            ml = 5,
            multiple = false,
            bname = undefined,
            bid = undefined
         }) => {
            $('select[name=' + nelem + ']').select2({
                multiple: multiple,
                placeholder: plh,
                theme: theme,
                width: width,
                minimumInputLength: ml,
                ajax: {
                    url: api_urls.json_model,
                    data: (pps) => {
                        let term = pps.term;
                        let query = {
                            'key_name': 'salamanca',
                            'app_name': app_name,
                            'model_name': model_name,
                            'model_key': model_key,
                        };
                        sterm.forEach((itobj) => { query[itobj] = term });
                        let fquery = Object.assign(query, squery);
                        return fquery;
                    },
                    processResults: (data) => {
                        sdata = [];
                        dataj = JSON.parse(data);
                        dataj.forEach((itobj) => {
                            if (bname) {
                                tmpf = [];
                                bname.forEach((fiobj)=>{
                                    tmpf.push(itobj[fiobj]);
                                })
                                fname = tmpf.join('_');
                            } else {
                                fname = itobj[fdisplay];
                            }
                            if (bid) {
                                pobj = { id: itobj[bid], text: fname }
                            } else {
                                pobj = { id: fname, text: fname }
                            }
                            fpobj = Object.assign(pobj, itobj);
                            sdata.push(fpobj);
                        })
                        return { results: sdata };
                    }
                }
            });
        }
    },
    populate: {
        select: ({
            app_name,
            model_name,
            model_key,
            nelem,
            plh,
            edata = [],
            option_id,
            option_id_complement = undefined,
            option_value,
            multiple = false,
            tags = false,
            theme = 'bootstrap',
            width = '240px',
        })=>{
            api_models.get_models(app_name, model_name, model_key, edata).then((rsp)=>{
                data = rsp.data;
                data.forEach((itobj)=>{
                    oid = itobj[option_id];
                    if (option_id_complement) {
                        oid += `_${itobj[option_id_complement]}`;
                    }
                    ovalue =  itobj[option_value];
                    qelem(`select[name=${nelem}]`).innerHTML += `<option value=${oid}>${ovalue}</option>`;
                });
                $(`select[name=${nelem}]`).select2({
                    multiple: multiple,
                    placeholder: plh,
                    theme: theme,
                    width: width,
                    tags: tags
                });
            });
        }
    },
    formatter: {
        currency: (on) => {
            if (on) {
                currency_options = {
                    alias: 'numeric',
                    groupSeparator: ',',
                    autoGroup: true,
                    digits: 0,
                    digitsOptional: false,
                    prefix: '',
                    placeholder: '0',
                    removeMaskOnSubmit: true
                };
                $('.currency_format').inputmask(currency_options);
            } else {
                $('.currency_format').inputmask('remove');
            }
        },
        datepicker: (selector, type='dp')=>{
            if (!Array.isArray(selector)) {selector = [selector];};
            selector.forEach((sele)=>{
                let ele = $(sele);
                let opts = { changeMonth: true,changeYear: true, dateFormat: 'yy-mm-dd'};
                if (type === 'dp') {ele.datepicker(opts);}
                if (type === 'dtp') {$(ele).datetimepicker(opts);}
            });
            
        }
    },
    helpers: {
        populate_form: async (fdata, mobj, exc) => {
            if (!Array.isArray(exc)) {exc = [];};
            fdata.forEach((item, idx) => {
                let mvalue = mobj[idx];
                if (exc.includes(idx)) { return false }
                let msel = `${fsel} [name=${idx}]`;
                let ele = qelem(msel);
                //console.log(idx, mvalue, msel);
                //console.log(ele);
                //console.log(idx)
                if (!ele) { return false};
                if (ele.classList.contains('select2-hidden-accessible')) {
                    s2 = $(msel);
                    // Create a DOM Option and pre-select by default
                    var newOption = new Option(mvalue, mvalue, true, true);
                    s2.append(newOption).trigger('change');
                    
                }
                else if (ele.type == 'checkbox') {
                    ele.checked = mvalue;
                }
                //TODO: Investigate how the deal with this
                else if (ele.type == 'file') {
                    null
                }
                else if (ele.type == 'select-multiple') {
                    ele.value = null; // Reset pre-selected options (just in case)
                    if (Array.isArray(mvalue)) {
                        let multiLen = ele.options.length;
                        for (var i = 0; i < multiLen; i++) {
                            if (mvalue.includes(ele.options[i].value)) {
                                ele.options[i].selected = true;
                            }
                        }
                    }
                }
                else {
                    ele.value = mvalue
                }
            })
            return mobj
        },
        clean: (fsel) => {
            qelem(fsel).reset();
            $('form select').val(null).trigger('change');
        },
        success: (rsp, fsel, gsel) => {
            rd = rsp.data;
            mensajes.global_notification_pqgrid(rd, gsel, undefined);
            if (rd.hasOwnProperty('exitos')) {
                vform.helpers.clean(fsel);
            }
            if (rd.hasOwnProperty('rsp')) {
                if (rd.rsp[0].hasOwnProperty('exitos')) {
                    vform.helpers.clean(fsel);
                }
            }
            vform.formatter.currency(true);
        },
        error: (err) => {
            console.log(err);
            mensajes.error(err);
            vform.formatter.currency(true);
        }
    }
}
