qelem = (selector) => document.querySelector(selector);
qelems = (selector) => document.querySelectorAll(selector);
jfy = (obj) => JSON.stringify(obj);
jpar = (obj) => JSON.parse(obj);

api_models = {
    update_bulk: (edata) => {
        let fdata = new FormData()
        fdata.append('app_name', 'imp_man');
        fdata.append('module_name', 'imp_man.imp_man_manag');
        fdata.append('class_name', 'ImpManag');
        fdata.append('method_name', 'add_modelbulk');
        fdata.append('bdata', JSON.stringify(edata));
        return axios.post(api_urls.execute_module, fdata)
    },
    add_model: (edata) => {
        let pps = [
            { name: 'app_name', value: 'imp_man' },
            { name: 'module_name', value: 'imp_man.imp_man_manag' },
            { name: 'class_name', value: 'ImpManag' },
            { name: 'method_name', value: 'add_model' },
        ];
        edata.forEach((itobj) => {
            pps.push({ name: itobj.name, value: itobj.value });
        });
        let fdata = new FormData();
        Object.keys(pps).forEach(key => fdata.append(pps[key].name, pps[key].value));
        return axios.post(api_urls.execute_module, fdata)
    },
    get_models: (app_name, model_name, model_key, edata) => {
        let pps = [
            { name: 'key_name', value: 'salamanca' },            
            { name: 'app_name', value: app_name },
            { name: 'model_name', value: model_name },
            { name: 'model_key', value: model_key },            
        ];
        edata.forEach((itobj) => {
            pps.push({ name: itobj.name, value: itobj.value });
        });
        let searchParams = new URLSearchParams();
        Object.keys(pps).forEach(key => searchParams.append(pps[key].name, pps[key].value));
        return axios.get(api_urls.json_model, {params: searchParams})
    }
}

api_ui = {
    get_template: (app_name, tmpl, dst, edata) => {
        pps = [{ name: 'template', value: `${app_name}/${tmpl}`}]
        searchParams = new URLSearchParams();
        Object.keys(pps).forEach(key => searchParams.append(pps[key].name, pps[key].value));
        if (edata) {
            Object.keys(edata).forEach(key => searchParams.append(edata[key].name, edata[key].value));
        }        
        return axios.get(api_urls.dinamic_template, { params: searchParams, responseType: 'text' })
            .then(function (response) {
                data = response.data;
                //TODO: Replace this with a innerHTML functions that handles javascript injection
                $(dst).html(data);
            })
            .catch(function (error) {
                mensajes.error(error)
            })
    }
}

api_rpt = {
    send_mail: (title, cuerpo, html, subject, destinos)=>{
        //cuerpo concat with html in the backend
        rhtml = LZString.compressToBase64(html);
        rptpa = [
            {name: 'app_name', value: 'imp_man'},
            {name: 'module_name', value: 'imp_man.imp_man_manag'},
            {name: 'class_name', value: 'ImpManag'},
            {name: 'method_name', value: 'print_ascii_html'},
            {name: 'printer', value: 'sendmail'}, {name: 'html', value: rhtml},
            {name: 'title', value: title}
        ];
        rptpa.push({name: 'asunto', value: subject});
        rptpa.push({name: 'cuerpo', value: cuerpo});
        rptpa.push({name: 'destinos', value: JSON.stringify(destinos)});
        formd = new FormData();
        Object.keys(rptpa).forEach(key => formd.append(rptpa[key].name, rptpa[key].value));
        axios.post(api_urls.execute_module, formd).then(function (rsp) {
            response = rsp.data;
            mensajes.global_notification_pqgrid(response, '', '');
            if (response.hasOwnProperty('exitos')) {
                utils.download_files([response.location_file]);
            }
            if (response.hasOwnProperty('rsp')) {
                if (response.rsp[0].hasOwnProperty('exitos')) {
                    utils.download_files(response.rsp);
                }
            }
            //Catch error from the platform if you need
        }).catch(err => console.log(err))
    }
}