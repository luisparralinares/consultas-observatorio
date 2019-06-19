

// *****************************************************************************

let prgts_slccnds = {}; //Preguntas seleccionas en el select multiple
let encst_actl = ""; // encuesta actualmente seleccionada
let pryct_actl = ""; // proyecto actualmente seleccionado
let prgts_encst_actl = [];

(function(){
    $.ajax({
        url: "ConsultasController",
        type: "post",
        dataType: "json",
        data: {opcion: 0},
        beforeSend: function(){
            $("#pryct_encuestas").empty().append($("<option value='0' selected  disabled>"));
        },
        success: function(result){ 
            $.each(result, function(i, item){
                $("#pryct_encuestas").append($("<option>").text(item.nombre).val(item.id));
            });
        },error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}());

$(document).ready(function(){
    $.fn.selectpicker.Constructor.DEFAULTS.BootstrapVersion = '4';
    $.fn.selectpicker.Constructor.DEFAULTS.deselectAllText = 'Deseleccionar Todo'; 
    $.fn.selectpicker.Constructor.DEFAULTS.selectAllText = 'Seleccionar Todo';
    
    $("#pryct_encuestas").change(function(){
        let valor = $("option:selected",this).val();
        pryct_actl = valor;
        $.ajax({
            url: "ConsultasController",
            type: "post",
            dataType: "json",
            data: {opcion: 1, parametros: valor},
            beforeSend: function(){
                $("#encuesta_nombre").empty().append($("<option value='0' selected disabled>").text("Seleccione una encuesta"));
                $("#pintar_resultados,#criterios").empty();
                $("#criterios").selectpicker("refresh");
                $("thead,tbody","#encst_prmt").empty();
                indx_rw_tbl_encst = {};
                prgts_slccnds = {};
                $("#cargando_encustas").addClass("spinner-border");
            },
            success: function(result){
                $.each(result, function(i, item){
                    $("#encuesta_nombre").append($("<option>").text(item.nombre).val(item.id));
                    indx_rw_tbl_encst[item.id] = {nombre: item.nombre, cantidad: item.cantidad};
                });
                $("#encuesta_nombre").selectpicker("refresh");
                $("#cargando_encustas").removeClass("spinner-border");
            },error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
    });
    
    $("#encuesta_nombre").on("change", function () {
        encst_actl = $("option:selected",this).val();
        obtenerCriterios(encst_actl);
    });
    
    $("#criterios").on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue){
        if(isSelected){
            prgts_slccnds[$("option",this).eq(clickedIndex).val()] = $("option",this).eq(clickedIndex).text();
        }else{
            delete prgts_slccnds[$("option",this).eq(clickedIndex).val()];
            
            if($(this).val().length === prgts_encst_actl.length){
                if(Object.keys(prgts_slccnds).length !== $(this).val().length){
                    prgts_slccnds = {};
                    $("option",this).each(function(i, item){
                        prgts_slccnds[$(item).val()] = $(item).text();
                    });
                }
            }
            if($(this).val().length === 0){
                prgts_slccnds = {};
            }
        }
    });
    
    $("#pintar_resultados").on("change","div.check_sn",function(){
        let active = $("input[type=checkbox]",this).is(":checked");
        $("input[type=checkbox]",$(this).parent()).prop("checked",false);
        if(active){
            $("input[type=checkbox]",this).prop("checked",true);
        }
    });
    
    $("#search_questions").click(function(){
        let descripcion_prgts = {};
        if(Object.keys(prgts_slccnds).length > 0){
            descripcion_prgts["dscrpcns_prgnts"] = [];
            descripcion_prgts["idProyecto"] = pryct_actl;
            descripcion_prgts["idEncuesta"] = encst_actl;
            $.each(prgts_slccnds,function(i, item){
                descripcion_prgts["dscrpcns_prgnts"].push(item);
            });
            $.ajax({
                url: "ConsultasController",
                type: "post",
                dataType: "json",
                data: {opcion: 3, parametros: JSON.stringify(descripcion_prgts)},
                beforeSend: function(){
                   $("#cargando_html_prgts").addClass("spinner-border");
                },
                success: function(result){
                    if(Object.keys(result).length > 0){
                        pintarResultados(result);
                    }
                    $("#cargando_html_prgts").removeClass("spinner-border");
                },error: function(jqXHR, textStatus, errorThrown) {
                    console.log(textStatus, errorThrown);
                }
            });
        }
    });
    
    $("#filtrar").click(function(){
        let filtros = {};
        let aux = {};
        filtros["mouv"] = {ind: []};
        filtros["cerradaLista"] = {ind: []};
        filtros["abierta"] = {ind: []};
        
        $(".mouvS").each(function(i, item){
            aux = {};
            if($("input[type=checkbox]:checked",item).length > 0){
                aux["descripcion"] = $(".descripcionP",$(item).parents("div.card").children("div.card-header")).text();
                aux["opciones"] = [];
               $("input[type=checkbox]:checked",item).each(function(x, itm){
                    aux["opciones"].push($(itm).siblings("label").text());
                }); 
            }
            if(Object.keys(aux).length > 0){
                filtros.mouv.ind.push(aux);
            }
        });
        
        $(".crrdListaS").each(function(i, item){
            aux = {};
            if($("input[type=checkbox]:checked",item).length > 0){
                aux["descripcion"] = $(".descripcionP",$(item).parents("div.card").children("div.card-header")).text();
                aux["opciones"] = [];
               $("input[type=checkbox]:checked",item).each(function(x, itm){
                    aux["opciones"].push($(itm).siblings("label").text());
                }); 
            }
            if(Object.keys(aux).length > 0){
                filtros.cerradaLista.ind.push(aux);
            }
        });
        
        $(".abiertaS").each(function(i, item){
            aux = {};
            if($("input",item).length > 0){
                aux["descripcion"] = $(".descripcionP",$(item).parents("div.card").children("div.card-header")).text();
                aux["opciones"] = [];
               $("input",item).each(function(x, itm){
                    aux["opciones"].push($(itm).siblings("label").text());
                }); 
            }
            if(Object.keys(aux).length > 0){
                filtros.abierta.ind.push(aux);
            }
        });
        
        console.info(filtros);
    });
    
});

// Obtener criterios seleccionados
function obtenerCriterios(encuesta) {
    $.ajax({
        async: true,
        type: 'POST',
        dataType: "json",
        data: {
            opcion: 2,
            parametros: JSON.stringify({idProyecto: pryct_actl, idEncuesta: encuesta})
        },
        url: 'ConsultasController',
        beforeSend: function () {
            $("#cargando_opciones").addClass("spinner-border");
            prgts_encst_actl = [];
            $("#pintar_resultados").empty();
            prgts_slccnds = {};
            $("#criterios").empty().selectpicker("refresh");
        },
        success: function (result) {
            let cadena = "";
            $.each(result,function(i, item){
                prgts_encst_actl.push(item);
                cadena += "<option style='white-space: normal; border-color: black !important; ' value='" + i + "'>" + item + "</option>";
            });
            $("#criterios").empty().append(cadena);
            $("#criterios").selectpicker("refresh");
            $("#cargando_opciones").removeClass("spinner-border");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR + "-" + textStatus + "-" + errorThrown);
        }
    });
}


// Se genera el html con los resultados de la consulta

function pintarResultados(result){
    let div_prncpl = $("#pintar_resultados");
    let div_card;
    let tamanno = Object.keys(result).length;
    div_prncpl.empty();
    console.info(result);
    if(tamanno > 0){
        $.each(result,function(key,item){
            $.each(item ,function(ky, itm){
                if(ky === "pregunta"){
                    div_card = $("<div class='card mb-3'>").append($("<div class='card-header'>").append(crearHtmlDescripcionPregunta(itm))).append($("<div class='card-body'>"));
                    
                }
                
                if(Object.keys(item).length === 2){
                    if(ky === "abierta"){
                        $("div.card-body",div_card).append(crearHtmlAbierta(itm,0));
                    }

                    if(ky === "cerradauv"){
                        $("div.card-body",div_card).append(crearHtmlCerradaMOUV(itm,0,""));
                    }
                    
                    if(ky === "cerradavv"){
                       $("div.card-body",div_card).append(crearHtmlCerradaMOVV(itm,0,""));
                    }
                    
                    if(ky === "cerradaLista"){
                        $("div.card-body",div_card).append(crearHtmlCerradaLista(itm,0,""));
                    }
                }else{
                    if(ky === "cerradauv" && item["abierta"] !== undefined){
                        $("div.card-body",div_card).append(crearHtmlCerradaMOUV(item,1,""));
                    }
                    
                    if(ky === "cerradavv"){
                        
                    }
                    
                    if(ky === "cerradaLista"){
//                        $("div.card-body",div_card).append(crearHtmlCerradaLista(itm,0,""));
                    }
                }
            });
            $(div_prncpl).append($(div_card));  
            
        });
    }
}

// ********************************* Tipos de pregunta **************************

function crearPanelCondiciones(tipo){
    let panel = $("<div>");
    switch(tipo){
        case 0:
            
            break;
                    
    }
}

function crearHtmlAbierta(contenido,tipo){
    let contenedor = $("<div>").addClass("prgt_abrt").append($("<div class='row'>"));
    let texto = "";
    switch(tipo){
        case 0:
            $("div.row",contenedor).addClass("abiertaS");
            $.each(contenido,function(i, item){
                $.each(item,function(x,itm){
                    texto = itm.replace(":","");
                    $("div.row",contenedor).append($("<div class = 'col-md-4'>").append($("<label>").text(texto)).append($("<input type='text' class='form-control'>")));   
                });  
            });
            
            break;
    }
    return contenedor;
}

function crearHtmlCerradaLista(contenido,tipo, descripcion){
    let contenedor = $("<div>").addClass("prgt_crrdLst");
    let check_row = "";
    let auxClass = "";
    switch(tipo){
        case 0:
            contenedor.addClass("crrdListaS");
            $.each(contenido,function(i, item){
                check_row = $("<div class='row'>");
                if(item[0] !== ""){
                    check_row.append($("<div class='col-md-12'>").append($("<div class='row'>").append($("<div class='col-auto'>").append($("<label>").text(item[0])))));
                }
                
                if(i + 1 < contenido.length){
                    check_row.addClass("mb-3");
                }
                if(item.length === 3){
                    if((item[2] === "Si" || item[1] === "Si") && (item [1] === "No" || item[2] === "No")){
                        auxClass = "check_sn";
                    }
                }
                $.each(item, function(x,itm){
                    if(x > 0){
                        check_row.append($("<div class='col-auto "+auxClass+"'>").append($('<div class="form-check form-check-inline">').append("<input type='checkbox' class='cerradaLista_"+x+"'>").append($("<label class='form-check-label'>").text(itm))));  
                    }else{
                        
                    }
                });
                contenedor.append(check_row);
            });
            break;
    }
    contenedor.append(check_row);
    return contenedor;
}

function crearHtmlCerradaMOUV(contenido,tipo, descripcion){
    let contenedor = $("<div>").addClass("prgt_cMOUV");
    let check_row = $("<div class='row'>");
    let auxClass = "";
    let abiertaCheck = "";
    switch(tipo){
        case 0:
            check_row.addClass("mouvS");
            $.each(contenido,function(i, item){
                if(item.length === 2){
                    if((item[0] === "Si" || item[1] === "Si") && (item [0] === "No" || item[1] === "No")){
                        auxClass = "check_sn";
                    }
                }
                $.each(item, function(x,itm){
                    check_row.append($("<div class='col-auto "+auxClass+"'>").append($('<div class="form-check form-check-inline">').append("<input type='checkbox' class='cerradaMOUV_"+x+"'>").append($("<label class='form-check-label'>").text(itm))));  
                });
            });
            break;
        case 1:
            let texto = "";
            abiertaCheck = $("<div class='col-auto'>").append($("<div class='row'>").append($("<div class='col-auto pr-0'>").append($('<div class="form-check form-check-inline">').append("<input type='checkbox' class='cerradaMOUVA'>").append($("<label class='form-check-label'>")))).append($("<div class='col-auto p-0'>").append($("<input type='text' class='form-control form-control-sm'>"))));
            $.each(contenido["cerradauv"][0],function(i, item){
                if(/\bOtro\b/i.test(item)){
                    texto = item;
                }else{
                    check_row.append($("<div class='col-auto'>").append($('<div class="form-check form-check-inline">').append("<input type='checkbox' class='cerradaMOUVA_"+i+"'>").append($("<label class='form-check-label'>").text(item))));  
                }
            });
            if(texto === ""){
                texto = contenido["abierta"][0];  
            }
            $("label.form-check-label",abiertaCheck).text(texto);
            check_row.append(abiertaCheck);
            break;
    }
    contenedor.append(check_row);
    return contenedor;
}

function crearHtmlCerradaMOVV(lista, index){
    let contenedor = $("<div>").addClass("prgt_cMOUV");
    let check_row = $("<div class='row'>");
    
    return contenedor;
}

function crearHtmlDescripcionPregunta(descripcion){
    let contenedor = $("<h6 style='margin: 0px;' class='descripcionP'>").text(descripcion);
    return contenedor;
}

// *******************************************************************************
