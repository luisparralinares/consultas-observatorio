/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

    
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//cerradas únicas ligadas a abiertas por valor otro
//cerradas únicas con opciones
//cerradas únicas unidas a abierta como complemento
var nombreEncuesta = "";
var seleccionados = [];
var limite = 0;
var abiertaYCerrada = false;
var cerradaLYAbierta = false;
var tablaYAbierta = false;
var consulta = [];
var jsonOriginal = null;
var mostrar = [];
var cerradas = [];
var opcionesCerradaUV = [];
var opcionesCerradaVV = [];
var opcionCerradaLista = [];
var ok = true;

$(document).ready(function () {
    
});

$(document).on("click", ".remove", function () {
    let aux = $(this);
    let texto = $(this).siblings("label").text();
    let opcion = $(this).parents().eq(0).attr("class");
    let pos = $(this).parents().eq(1).attr("class").match(/\d+/g)[0];
    let conte = $(this).parents().eq(2).siblings(".cerrada" + pos + "").children().first(); //col-lg-9
    if (opcion === "opciones") {
        $(conte).find("div").each(function () {
            let seleccionado = $(this).find("input");
            let label = $(this).find("label").text();
            if ($(seleccionado).prop("checked") && label === texto) {
                cerradas[pos].contadorOpc -= 1;
                $(seleccionado).prop("checked", false);
                $(seleccionado).prop("disabled", false);
                $(aux).parents().eq(0).remove();
                if (texto === "Otro") {
                    $("#selecta" + pos + "").prop("disabled", true);
                    $("#valora" + pos + "").prop("disabled", true);
                }
            }
        });
    } else {
        cerradas[pos].contadorOpe -= 1;
        $(aux).parents().eq(0).remove();
    }
});

$(document).on("change", "input[type=checkbox]", function () {
    var tipo = $(this).prop("class");
    var texto = $(this).closest("div").find("label").text();
    var posContenedor = $(this).parents().eq(2).attr("class").match(/\d+/g)[0];

    switch (tipo) {
        case "opciones":
            if ($(this).prop("checked")) {
                cerradas[posContenedor].contadorOpc += 1;
                if (texto === "Otro") {
                    $("#selecta" + posContenedor + "").prop("disabled", false);
                    $("#valora" + posContenedor + "").prop("disabled", false);
                }
            } else {
                cerradas[posContenedor].contadorOpc -= 1;
            }
            break;
        case "operadores":
            if ($(this).prop("checked") && cerradas[posContenedor].contadorOpc !== 0) {
                cerradas[posContenedor].contadorOpe += 1;
                $(this).prop("checked", false);
            } else if (cerradas[posContenedor].contadorOpc !== 0) {
                cerradas[posContenedor].contadorOpe -= 1;
                $(this).prop("checked", false);
            } else if (cerradas[posContenedor].contadorOpc === 0) {
                $(this).prop("checked", false);
            }
            break;

        default:
            console.log("default");
            break;
    }
    console.log("Contador opciones   ", posContenedor, cerradas[posContenedor].contadorOpc);
    console.log("Contador operadores ", posContenedor, cerradas[posContenedor].contadorOpe);

    if (cerradas[posContenedor].contadorOpc < cerradas[posContenedor].contadorOpe) {
        cerradas[posContenedor].contadorOpe -= 1;
        console.log("No es posible orden");
    } else if (tipo === "operadores" && cerradas[posContenedor].contadorOpe !== 0) {
        $(".orden" + posContenedor + "").append("<div class='operadores' id='removeOpe" + cerradas[posContenedor].contadorOpe + "'><label>"
                + texto + " </label>&nbsp;<span class='remove' style='border: 1px solid black; cursor: context-menu; color: #ff4d4d;'> X&nbsp;</span></div>");
    }
    if ((cerradas[posContenedor].contadorOpc - cerradas[posContenedor].contadorOpe) > 1) {
        $(this).prop("checked", false);
        if (texto === "Otro") {
            $("#selecta").prop("disabled", true);
            $("#valora").prop("disabled", true);
        }
        cerradas[posContenedor].contadorOpc -= 1;
        console.log("No es posible mayor a 1");
    } else if (tipo === "opciones") {
        $(this).prop("disabled", true);
        $(".orden" + posContenedor + "").append("<div class='opciones' id='removeOpc" + cerradas[posContenedor].contadorOpc + "'><label>"
                + texto + "</label> &nbsp;<span class='remove' style='border: 1px solid black; cursor: context-menu; color: #ff4d4d;'> X&nbsp;</span></div>");
    }
});


$("#encuestas").on("change", function () {
    nombreEncuesta = $("#encuestas option:selected").text();
    obtenerCriterios(nombreEncuesta);
});


function obtenerCriterios(encuesta) {
    $.ajax({
        async: true,
        type: 'POST',
        data: {
            opcion: "criterios",
            nombreEncuesta: encuesta
        },
        url: 'ConsultasController',
        beforeSend: function () {
            $("#mensaje").addClass("spinner-border");
        },
        success: function (result) {
            var arreglo = JSON.parse(result);
            var cadena = "";
            for (var i = 0, max = arreglo.length; i < max; i++) {
                cadena += "<option style='white-space: normal;' value='" + i + "'>" + arreglo[i] + "</option>";
            }
            $("#criterios").html(cadena);
            $("#criterios").selectpicker("refresh");
            $("#mensaje").removeClass("spinner-border");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR + "-" + textStatus + "-" + errorThrown);
        }
    });
}

$('#criterios').on("change", function () {
    seleccionados = [];
    mostrar = [];
    var criterios = $('#criterios option:selected');
    $(criterios).each(function () {
        seleccionados.push($(this).text());
    });
    $("#lista").html("");
    if (seleccionados.length > 0) {
        $.ajax({
            async: true,
            type: 'POST',
            data: {
                opcion: "preguntas",
                arrPreguntas: seleccionados
            },
            url: 'ConsultasController',
            beforeSend: function () {
                $("#mensaje").addClass("spinner-border");
            },
            success: function (result) {
                cerradas = [];
                var json = JSON.parse(result);
                jsonOriginal = json;
                console.log(json);
                var pre = "<div>";
                $.each(json, function (k, v) {
                    var contadores = {contadorOpc: 0, contadorOpe: 0};
                    if (v.cerradauv !== undefined) {

                        if (v.cerradauv.length > 2) {
                            var tamano = v.cerradauv.length;
                            if (v.cerradauv[tamano - 1] === "Otro") {
                                pre += '<div class="contenedor cerradauvd"  style="border: 1px solid black;" >';
                                abiertaYCerrada = true;
                            } else {
                                abiertaYCerrada = false;
                                pre += '<div class="contenedor cerradauvi"  style="border: 1px solid black;" >';
                            }
                            pre += '<div class="form-group row">' +
                                    '   <div class="col-lg-10">' +
                                    '       <label class="col-form-label">' + v.pregunta + '</label>' +
                                    '   </div>';//col-lg-10

                            pre += '<div class="col-lg-2">' +
                                    '   <label class="col-form-label">Cerrada Única</label>' +
                                    '</div>';
                            pre += '<div style="margin-left: 1%;" class="row cerrada' + k + '"><div class="col-lg-10">';
                            for (var i = 0; i < v.cerradauv.length; i++) {
                                pre += '<div class="form-check form-check-inline">' +
                                        '   <input class="opciones" type="checkbox">' +
                                        '   <label class="form-check-label">' + v.cerradauv[i] + '</label>' +
                                        '</div>';
                            }
                            pre += '</div>'; // class col-lg-10
                            pre += '<div class="col-lg-2">' +
                                    '   <div class="form-check form-check-inline">' +
                                    '       <input class="operadores" type="checkbox">' +
                                    '       <label class="form-check-label">OR</label>' +
                                    '   </div>';
                            pre += '</div></div>'; // class row
                            pre += '<br><div class="row"><div style="display: inline-flex;" class="orden' + k + '"></div></div>';


                        } else {
                            pre += '<div class="contenedor cerradauvsn"  style="border: 1px solid black;" >';
                            pre += '<div class="form-group row">' +
                                    '   <div class="col-lg-10">' +
                                    '       <label class="col-form-label">' + v.pregunta + '</label>' +
                                    '   </div>';//col-lg-10                            
                            pre += '<div class="col-lg-2">' +
                                    '   <label class="col-form-label">Cerrada Única</label>' +
                                    '</div>';
                            pre += '<div class="row cerrada' + k + '" style="margin-left: 2%;">' +
                                    '<label for="" class="col-form-label">Opciones</label>' +
                                    '<div>' +
                                    '   <select class="form-control selectsn' + k + '" id="">';
                            pre += '<option disabled selected>Elija</option>';
                            for (var i = 0; i < v.cerradauv.length; i++) {
                                pre += '    <option id="' + i + '">' + v.cerradauv[i] + '</option>';
                            }
                            pre += '    </select>' +
                                    '</div></div>';
                        }
                        pre += '</div>';
                        //cerradas.push(contadores);
                    }
                    if (v.cerradavv !== undefined) {
                        var tamano = v.cerradavv.length;
                        if (v.cerradavv[tamano - 1] === "Otro") {
                            pre += '<div class="contenedor cerradavvd"  style="border: 1px solid black;" >'; //cerradavv dependiente
                            abiertaYCerrada = true;
                        } else {
                            abiertaYCerrada = false;
                            pre += '<div class="contenedor cerradavvi"  style="border: 1px solid black;" >'; //cerradavv independiente
                        }
                        pre += '<div class="form-group row">';
                        pre += '   <div class="col-lg-10">' +
                                '       <label class="col-form-label">' + v.pregunta + '</label>' +
                                '   </div>';//col-lg-10                        
                        pre += '<div class="col-lg-2">' +
                                '   <label class="col-form-label">Cerrada Múltiple</label>' +
                                '</div>';
                        pre += '<div style="margin-left: 1%;" class="row cerrada' + k + '"><div class="col-lg-10">';
                        for (var i = 0; i < v.cerradavv.length; i++) {
                            pre += '<div class="form-check form-check-inline">' +
                                    '   <input class="opciones" type="checkbox">' +
                                    '   <label class="form-check-label">' + v.cerradavv[i] + '</label>' +
                                    '</div>';
                        }
                        pre += '</div>'; // class col-lg-10
                        pre += '<div class="col-lg-2">' +
                                '   <div class="form-check form-check-inline">' +
                                '       <input class="operadores" type="checkbox">' +
                                '       <label class="form-check-label">OR</label>' +
                                '   </div>';
                        pre += '   <div class="form-check form-check-inline">' +
                                '       <input class="operadores" type="checkbox">' +
                                '       <label class="form-check-label">AND</label>' +
                                '   </div>';
                        pre += '</div></div>'; // class row
                        pre += '<br><div class="row"><div style="display: inline-flex;" class="orden' + k + '"></div></div></div>';
                    }
                    if (v.cerradaLista !== undefined) {
                        if (v.abierta !== undefined) {
                            cerradaLYAbierta = true;
                            pre += '<div class="contenedor cerradalistad"  style="border: 1px solid black;" >';
                        } else {
                            cerradaLYAbierta = false;
                            pre += '<div class="contenedor cerradalistai"  style="border: 1px solid black;" >';
                        }
                        pre += '<div class="form-group row">' +
                                '   <div class="col-lg-10">' +
                                '       <label class="col-form-label">' + v.pregunta + '</label>' +
                                '   </div>';//col-lg-10                            
                        pre += '<div class="col-lg-2">' +
                                '   <label class="col-form-label">Cerrada Lista</label>' +
                                '</div>';
                        pre += '<div class="row cerradalista' + k + '" style="margin-left: 2%;">' +
                                '<label for="" class="col-form-label">Opciones</label>' +
                                '<div class="cerrada' + k + '">' +
                                '   <select class="form-control" id="selectcl' + k + '">' +
                                '<option selected disabled>Elija</option>';
                        for (var i = 0; i < v.cerradaLista.length; i++) {
                            pre += '    <option id="' + i + '">' + v.cerradaLista[i] + '</option>';
                        }
                        pre += '    </select>' +
                                '   </div>' +
                                '</div>' +
                                '</div>';
                    }
                    if (v.tabla !== undefined) {
                        if (v.abierta !== undefined) {
                            tablaYAbierta = true;
                            pre += '<div class="contenedor tablad"  style="border: 1px solid black;" >';
                        } else {
                            tablaYAbierta = false;
                            pre += '<div class="contenedor tablai"  style="border: 1px solid black;" >';
                        }
                        pre += '<div class="form-group row">' +
                                '   <div class="col-lg-10">' +
                                '       <label class="col-form-label">' + v.pregunta + '</label>' +
                                '   </div>';//col-lg-10                            
                        pre += '<div class="col-lg-2">' +
                                '   <label class="col-form-label">Tabla</label>' +
                                '</div>';
                        
                        pre += '<h3>Opciones de la tabla</h3>';
                    }

                    if (v.abierta !== undefined) {
                        if (v.cerradauv === undefined && v.cerradavv === undefined &&
                                v.cerradaLista === undefined && v.tabla === undefined) {
                            console.log("unicamente abierta");
                            pre += '<div class="contenedor abierta"  style="border: 1px solid black;" >';
                        }
                        pre += '<div class="form-group"><div class="row abierta' + k + '">' +
                                '   <div class="col-auto">' +
                                '       <label class="col-form-label">' + v.pregunta + '</label>' +
                                '   </div>' +
                                '<div class="col-auto">' +
                                '   <label class="col-form-label">Abierta</label>' +
                                '</div>' +
                                '<div class="col-auto">' +
                                '   <label class="col-form-label">' + v.abierta[0] + '</label>' +
                                '</div>                    ' +
                                '<label for="" class="col-form-label">Acción</label>' +
                                '<div class=" col-auto">';
                        if (abiertaYCerrada) {
                            pre += '<select disabled class="form-control" id="selecta' + k + '">';
                        } else if (cerradaLYAbierta) {
                            pre += '<select class="form-control" id="selecta' + k + '">';
                        } else {
                            pre += '<select class="form-control" id="selecta' + k + '">';
                        }
                        pre += '<option id="">Elija</option>' +
                                '   <option id="mayora">mayor a</option>' +
                                '   <option id="menora">menor a</option>' +
                                '   <option id="iguala">igual a</option>' +
                                '   <option id="diferentede">diferente de</option>' +
                                '</select>' +
                                '</div>' + //a
                                '<div class="col-auto">';
                        if (abiertaYCerrada) {
                            pre += '<input disabled type="text" id="valora' + k + '" class="form-control" placeholder="Valor">';
                        } else if (cerradaLYAbierta) {
                            pre += '<input type="text" id="valora' + k + '" class="form-control" placeholder="Valor">';
                        } else {
                            pre += '<input type="text"  id="valora' + k + '" class="form-control" placeholder="Valor">';
                        }
                        pre += '</div>' + //col-auto
                                '</div>' + //row
                                '</div>'; //form-group

                    }
                    pre += '</div>';
                    cerradas.push(contadores);
                });
                pre += "</div>";
                pre += '<input type="button" value="Consultar" class="btn btn-success" onclick="consultar()">';
                $("#lista").html(pre);
                $("#mensaje").removeClass("spinner-border");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR + "-" + textStatus + "-" + errorThrown);
            }
        });
    }
});

function obtenerAbierta(tipo, k) {
    let abierta = $(tipo).find(".abierta" + k + "");
    let selecta = $(abierta).find("#selecta" + k + " option:selected").val();
    let valoraa = $(abierta).find("#valora" + k + "").val();
    if (selecta === "Elija") {
        ok = false;
        $(abierta).css("color", "red");
        return ["", ""];
    } else {
        ok = true;
        $(abierta).css("color", "black");
        return [selecta, valoraa];
    }
}

function obtenerCerradaUV(tipo, k) {
    let opcionesCerradaUV = [];
    let aux = $(tipo[0]).find("div").eq(2).children(); //cerrada                
    let arreglo = $(tipo).find(".orden" + k + "").children();
    if (arreglo.length === 0 || arreglo.length % 2 === 0) {
        $(aux).css("color", "red");
        ok = false;
    } else {
        ok = true;
        $(aux).css("color", "black");
        $(arreglo).each(function () {
            opcionesCerradaUV.push($(this).find("label").text());
        });
    }
    return opcionesCerradaUV;
}

function obtenerCerradaVV(tipo, k) {
    let opcionesCerradaVV = [];
    let aux = $(tipo).find("div").eq(2).children(); //cerrada
    let arreglo = $(tipo).find(".orden" + k + "").children();
    if (arreglo.length === 0 || arreglo.length % 2 === 0) {
        $(aux).css("color", "red");
        ok = false;
    } else {
        ok = true;
        $(aux).css("color", "black");
        $(arreglo).each(function () {
            opcionesCerradaVV.push($(this).find("label").text());
        });
    }
    return opcionesCerradaVV;
}

function obtenerCerradaLista(tipo, k) {
    let cerradal = $(tipo).find(".cerradalista" + k + "");
    let selectcl = $(cerradal).find("#selectcl" + k + " option:selected").text();
    if (selectcl === "Elija") {
        ok = false;
        $(cerradal).css("color", "red");
    } else {
        ok = true;
        $(cerradal).css("color", "black");
    }
    return selectcl;
}

function consultar() {
    var objConsulta = [];

    $(".contenedor").each(function (k, v) {
        opcionesCerradaUV = [];
        opcionesCerradaVV = [];
        opcionCerradaLista = "";
        let clases = $(this).attr("class");
        let tipoContenedor = clases.split(" ")[1];
        let tipo = $(this).children();
        var selectaa = "";
        var valoraa = "";
        switch (tipoContenedor) {
            case "abierta":
                let resulta = obtenerAbierta(tipo, k);
                selectaa = resulta[0];
                valoraa = resulta[1];
                break;

            case "cerradauvi":
                opcionesCerradaUV = obtenerCerradaUV(tipo, k);
                let result = obtenerAbierta(tipo, k);
                selectaa = result[0];
                valoraa = result[1];
                break;

            case "cerradauvd":
                if (!$("#selecta" + k + "").prop("disabled")) { //seleccionó opcion Otro en cerradauv
                    let result = obtenerAbierta(tipo, k);
                    selectaa = result[0];
                    valoraa = result[1];
                }
                opcionesCerradaUV = obtenerCerradaUV(tipo, k);
                break;
            case "cerradavvd":
                if (!$("#selecta" + k + "").prop("disabled")) { //seleccionó opcion Otro en cerradauv
                    let result = obtenerAbierta(tipo, k);
                    selectaa = result[0];
                    valoraa = result[1];
                }
                opcionesCerradaVV = obtenerCerradaVV(tipo, k);
                break;
            case "cerradauvsn":
                let selectsn = $(tipo).find("div").eq(2).find(".selectsn" + k + " option:selected").text();
                if (selectsn !== "Elija") {
                    opcionesCerradaUV.push(selectsn);
                }
                break;
            default:

            case "cerradalistad":
                if (!$("#selecta" + k + "").prop("disabled")) { //seleccionó opcion Otro en cerradauv
                    let result = obtenerAbierta(tipo, k);
                    selectaa = result[0];
                    valoraa = result[1];
                }
                opcionCerradaLista = obtenerCerradaLista(tipo, k);
                break;
                console.log("default");
                break;
        }

        var parametros = {tipo: tipoContenedor, pregunta: jsonOriginal[k].pregunta, cerradauv: opcionesCerradaUV,
            cerradavv: opcionesCerradaVV, cerradalista: opcionCerradaLista,
            abierta: [{accion: selectaa}, {valor: valoraa}]};
        objConsulta.push(parametros);
    }); //each contenedor
    console.log(objConsulta);
    if (ok) {
        $.ajax({
            async: true,
            type: 'POST',
            data: {
                opcion: "consultas",
                arrConsultas: JSON.stringify(objConsulta)
            },
            url: 'ConsultasController',
            beforeSend: function (xhr) {
                $("#mensaje").addClass("spinner-border");
            },
            success: function (result) {
                console.log(result);
                $("#mensaje").removeClass("spinner-border");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("consultar " + jqXHR + "-" + textStatus + "-" + errorThrown);
            }
        });
    } else {
        console.info("No se puede enviar");
    }
}


