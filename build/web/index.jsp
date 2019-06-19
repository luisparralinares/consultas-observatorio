<%-- 
    Document   : index
    Created on : 9/05/2019, 09:52:49 AM
    Author     : Luis Parra
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Módulo Consultas Encuestas PERS</title>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous">
        <link href="css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <link href="css/bootstrap-select.min.css" rel="stylesheet" type="text/css"/>
        <link href="css/bootstrap-select.min.css" rel="stylesheet" type="text/css"/>
        <!--<link href="css/jquery-ui.min.css" rel="stylesheet" type="text/css"/>-->
    </head>
    <body>
        <style>
            .color-tags{
                    background-color: #1BCFC9;
                    margin-right: 5px !important;
            }
	</style>
        <header class="m-4">
            <div class="container">
                <div class="row">
                    <h3>Bienvenido al módulo de consultas proyecto PERS</h3>
                </div>
            </div>
        </header>
        <section>
            <form class="mb-4">
                <div class="container">
                    <div class="row">
                        <div class="col-sm-auto col-md-5">
                            <label for="pryct_encuestas">Proyecto</label>
                            <select class="form-control" id="pryct_encuestas">
                                <option selected disabled value="0">Seleccione un proyecto</option>
                            </select>
                        </div>
                        <div class="col-sm-auto col-md-1 align-items-end row justify-content-center">
                            <div id="cargando_encustas">
                            </div>
                        </div>
                        <div class="col-sm-auto col-md-5">
                            <label for="encuesta_nombre">Encuesta</label>
                            <select class="form-control" id="encuesta_nombre">
                                <option selected disabled value="0">Seleccione una encuesta</option>
                            </select>
                        </div>   
                        <div class="col-sm-auto col-md-1 align-items-end row justify-content-center">
                            <div id="cargando_opciones">
                            </div>
                        </div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-auto">
                            <h5>Criterios de búsqueda</h5>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-8 col-sm-10 select-picker">
                            <select class="custom-select-sm selectpicker form-control" 
                                    id="criterios" multiple title="Seleccione uno o más" 
                                    data-size="10" data-live-search="true" data-actions-box="true">
                            </select>        
                        </div>
                        <div class="col-auto">
                            <button class="form-control" type="button" title="buscar" id="search_questions"><i class="fa fa-search"></i></button>
                        </div>
                        <div class="col-sm-auto col-md-1 align-items-end row justify-content-center">
                            <div id="cargando_html_prgts">
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div class="container">
                <div class="row">
                    <h5>Opciones por pregunta</h5>
                </div>
                <br>
                <div id="pintar_resultados" class="form-group">
                </div>
                <div class="row">
                    <div class="col-sm-auto col-md-2">
                        <button type="button" class="btn btn-info btn-block" id="filtrar">Filtrar</button>
                    </div>
                </div>
            </div>
        </section>
        <script src="js/jquery-3.2.1.min.js" type="text/javascript"></script>
        <script src="js/popper.min.js" type="text/javascript"></script>
        <script src="js/bootstrap.min.js" type="text/javascript"></script>        
        <script src="js/bootstrap-select.min.js" type="text/javascript"></script>
        <script src="js/tagsinput.js" type="text/javascript"></script>
        <script src="js/dinamico.js" type="text/javascript"></script>
    </body>
</html>
