/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.mongodb.client.AggregateIterable;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import database.MongoDB;
import database.MySQL;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.bson.Document;

/**
 *
 * @author Luis Parra
 */
public class Filtro {
    
    ResultSet rs;
    PreparedStatement ps;
    private final Connection conn;
    private final MongoClient mongocli;
    private final MongoCollection collection;
    private final MongoDatabase database;

    public Filtro() {
         this.mongocli = MongoDB.getConexion();
         this.collection = MongoDB.getCollection();
         this.database = MongoDB.getDatabase();
         this.conn = MySQL.getConecction();
    }

    
    JsonParser parser = new JsonParser();
    
    public JsonArray obtenerDescripcionPreguntasEncuesta(String parametros) {
        
        Encuesta encuesta = new Gson().fromJson(parametros, Encuesta.class);
        String parametro = "RespuestaPregunta.pregunta.TipoPregunta.descripcion";
        MongoCursor<String> descripciones = collection.distinct(parametro, new Document("encuesta", encuesta.getIdEncuesta()).append("proyecto", encuesta.getIdProyecto()), String.class).iterator();

        ArrayList<String> valores = new ArrayList<>();
        while (descripciones.hasNext()) {
            String next = descripciones.next();
            valores.add(next);
        }
        JsonArray json = (JsonArray) parser.parse(new Gson().toJson(valores));
        return json;
    }

    public JsonArray obtenerPreguntasEncuesta(String datos) {
        Encuesta encuesta = new Gson().fromJson(datos, Encuesta.class);

        Document match1 = new Document("$match", new Document("proyecto", encuesta.getIdProyecto()).append("encuesta", encuesta.getIdEncuesta()));
        Document unwind = new Document("$unwind", "$RespuestaPregunta");
        Document match2 = new Document("$match", new Document("RespuestaPregunta.pregunta.TipoPregunta.descripcion",
                new Document("$in", encuesta.getDscrpcns_prgnts())));

        Document group = new Document("$group", new Document("_id", "$RespuestaPregunta.pregunta.TipoPregunta.descripcion").
                append("CerradaMOUV", new Document("$addToSet",
                        "$RespuestaPregunta.pregunta.TipoPregunta.CerradaMOUV.PreguntaCerrada.texto")).
                append("CerradaMOVV", new Document("$addToSet",
                        "$RespuestaPregunta.pregunta.TipoPregunta.CerradaMOVV.PreguntaCerrada.texto")).
                append("CerradaLista", new Document("$addToSet",
                        "$RespuestaPregunta.pregunta.TipoPregunta.CerradaLista.PreguntaCerrada.texto")).
                append("DescripcionCL", new Document("$addToSet",
                        "$RespuestaPregunta.pregunta.TipoPregunta.CerradaLista.descripcion")).
                append("TablaFilas", new Document("$addToSet",
                        "$RespuestaPregunta.pregunta.TipoPregunta.tabla.fila")).
                append("TablaColumnas", new Document("$addToSet",
                        "$RespuestaPregunta.pregunta.TipoPregunta.tabla.columna")).
                append("Abierta", new Document("$addToSet",
                        "$RespuestaPregunta.pregunta.TipoPregunta.abierta.texto")).
                append("AbiertaRtas", new Document("$addToSet",
                        "$RespuestaPregunta.pregunta.TipoPregunta.abierta.valor"))
        );

        Document project = new Document("$project",
                new Document("CerradaMOUV", new Document("$cond", new Document("if", new Document("$eq", Arrays.asList("$CerradaMOUV",
                        Arrays.asList(Arrays.asList())))).append("then", null).append("else", new Document("$setUnion", "$CerradaMOUV")))).
                        append("CerradaMOVV", new Document("$cond", new Document("if", new Document("$eq", Arrays.asList("$CerradaMOVV",
                                Arrays.asList(Arrays.asList())))).append("then", null).append("else", new Document("$setUnion", "$CerradaMOVV")))).
                        append("CerradaLista", new Document("$cond", new Document("if", new Document("$eq", Arrays.asList("$CerradaLista",
                                Arrays.asList(Arrays.asList())))).append("then", null).append("else", new Document("$setUnion", "$CerradaLista")))).
                        append("DescripcionCL", new Document("$cond", new Document("if", new Document("$eq", Arrays.asList("$DescripcionCL",
                                Arrays.asList(Arrays.asList())))).append("then", null).append("else", new Document("$setUnion", "$DescripcionCL")))).
                        append("TablaFilas", new Document("$cond", new Document("if", new Document("$eq", Arrays.asList("$TablaFilas",
                                Arrays.asList(Arrays.asList())))).append("then", null).append("else", new Document("$setUnion", "$TablaFilas")))).
                        append("TablaColumnas", new Document("$cond", new Document("if", new Document("$eq", Arrays.asList("$TablaColumnas",
                                Arrays.asList(Arrays.asList())))).append("then", null).append("else", new Document("$setUnion", "$TablaColumnas")))).
                        append("Abierta", new Document("$cond", new Document("if", new Document("$eq", Arrays.asList("$Abierta",
                                Arrays.asList(Arrays.asList())))).append("then", null).append("else", new Document("$setUnion", "$Abierta")))).
                        append("AbiertaRtas", new Document("$cond", new Document("if", new Document("$eq", Arrays.asList("$AbiertaRtas",
                                Arrays.asList(Arrays.asList())))).append("then", null).append("else", new Document("$setUnion", "$AbiertaRtas")))));


        AggregateIterable<Document> result = collection.aggregate(Arrays.asList(match1, unwind, match2, group, project));
        System.out.println(Arrays.asList(match1.toJson(), unwind.toJson(), match2.toJson(), group.toJson(), project.toJson()));
        MongoCursor<Document> ite = result.iterator();

        JsonArray respuesta = new JsonArray();
        while (ite.hasNext()) {
            Document doc = ite.next();
            List<String> descripcion = (List<String>) doc.get("_id");
            List<List<List<List<String>>>> cerradaMOUV = (List<List<List<List<String>>>>) doc.get("CerradaMOUV");
            List<List<List<List<String>>>> cerradaMOVV = (List<List<List<List<String>>>>) doc.get("CerradaMOVV");
            List<List<List<List<String>>>> cerradaLista = (List<List<List<List<String>>>>) doc.get("CerradaLista");
            List<List<List<List<Document>>>> tablaFilas = (List<List<List<List<Document>>>>) doc.get("TablaFilas");
            List<List<List<List<Document>>>> tablaColumnas = (List<List<List<List<Document>>>>) doc.get("TablaColumnas");
            List<List<List<String>>> abierta = (List<List<List<String>>>) doc.get("Abierta");
            List<List<List<String>>> abiertaRtas = (List<List<List<String>>>) doc.get("AbiertaRtas");
            List<List<List<String>>> descripcionCL = (List<List<List<String>>>) doc.get("DescripcionCL");
            
            List<List<String>> opcu = new ArrayList<>();
            List<List<String>> opcv = new ArrayList<>();
            List<List<String>> opcl = new ArrayList<>();
            List<List<String>> opa = new ArrayList<>();
            List<List<String>> opaRtas = new ArrayList<>();
            List<String> optf = new ArrayList<>();
            List<String> optcuv = new ArrayList<>();
            List<String> optcvv = new ArrayList<>();
            List<String> opcclaux = new ArrayList<>();
            List<List<String>> opccl = new ArrayList<>();
            List<String> optca = new ArrayList<>();

            int contcl = 0;

            Fila fila = new Fila();
            Columna columna = new Columna();
            Pregunta pregunta = new Pregunta();

            if (cerradaMOUV != null) {
                for (int i = 0; i < cerradaMOUV.size(); i++) {
                    List<List<List<String>>> getuv1 = cerradaMOUV.get(i);
                    for (int j = 0; j < getuv1.size(); j++) {
                        List<List<String>> getuv2 = getuv1.get(j);
                        for (int k = 0; k < getuv2.size(); k++) {
                            List<String> get = getuv2.get(k);
                            opcu.add(get);
                        }
                    }
                }
                pregunta.setCerradauv(opcu);
            }
            if (cerradaMOVV != null) {
                for (int i = 0; i < cerradaMOVV.size(); i++) {
                    List<List<List<String>>> getvv1 = cerradaMOVV.get(i);
                    for (int j = 0; j < getvv1.size(); j++) {
                        List<List<String>> getvv2 = getvv1.get(j);
                        for (int k = 0; k < getvv2.size(); k++) {
                            List<String> get = getvv2.get(k);
                            opcv.add(get);
                        }
                    }
                }
                pregunta.setCerradavv(opcv);
            }
            if (cerradaLista != null) {
                for (int i = 0; i < cerradaLista.size(); i++) {
                    List<List<List<String>>> getcl1 = cerradaLista.get(i);
                    for (int j = 0; j < getcl1.size(); j++) {
                        List<List<String>> getcl2 = getcl1.get(j);
                        for (int k = 0; k < getcl2.size(); k++) {
                            List<String> get2 = getcl2.get(k);
                            get2.add(0, descripcionCL.get(i).get(j).get(k));
                            opcl.add(get2);
                        }
                    }
                }
                pregunta.setCerradaLista(opcl);
            }
            if (tablaFilas != null) {
                for (int i = 0; i < tablaFilas.size(); i++) {
                    List<List<List<Document>>> gettf1 = tablaFilas.get(i);
                    for (int j = 0; j < gettf1.size(); j++) {
                        List<List<Document>> gettf2 = gettf1.get(j);
                        for (int k = 0; k < gettf2.size(); k++) {
                            List<Document> filas = gettf2.get(k);
                            for (int l = 0; l < filas.size(); l++) {
                                if (filas.get(l).get("texto") != null) {
                                    //System.out.println("Opción fila " + filas.get(l).get("texto"));
                                    optf.add(filas.get(l).getString("texto"));
                                } else {
                                    Document abierta1 = filas.get(l).get("abierta", Document.class);
                                    //System.out.println("Opciones fila abierta: " + abierta1.getString("texto"));
                                    optf.add(abierta1.getString("texto"));
                                }

                            }
                        }
                    }
                }
                fila.setTexto(optf);
                pregunta.setTablaf(fila);
            }
            if (tablaColumnas != null) {
                for (int i = 0; i < tablaColumnas.size(); i++) {
                    List<List<List<Document>>> gettc1 = tablaColumnas.get(i);
                    for (int j = 0; j < gettc1.size(); j++) {
                        List<List<Document>> gettc2 = gettc1.get(j);
                        for (int k = 0; k < gettc2.size(); k++) {
                            List<Document> columnas = gettc2.get(k);
                            
                            for (int l = 0; l < columnas.size(); l++) {
                                if (columnas.get(l).get("abierta") != null) {
                                    List<Document> abiertas = columnas.get(l).get("abierta", List.class);
                                    for (int m = 0; m < abiertas.size(); m++) {
                                        System.out.println("Opciones columna abierta: " + abiertas.get(m).getString("texto"));
                                        optca.add(abiertas.get(m).getString("texto"));
                                        columna.setAbierta(optca);
                                    }
                                }                                
                                if (columnas.get(l).get("CerradaMOUV") != null) {
                                    List<Document> auxCerrada = columnas.get(l).get("CerradaMOUV", List.class);
                                    for (int m = 0; m < auxCerrada.size(); m++) {
                                        List<Document> cerradasuv = auxCerrada.get(0).get("PreguntaCerrada", List.class);
                                        for (int n = 0; n < cerradasuv.size(); n++) {
                                            System.out.println("Opciones columna cerradauv " + cerradasuv.get(n).getString("texto"));
                                            optcuv.add(cerradasuv.get(n).getString("texto"));
                                            columna.setCerradaMOUV(optcuv);
                                        }
                                    }
                                }
                                if (columnas.get(l).get("CerradaMOVV") != null) {
                                    List<Document> auxCerrada = columnas.get(l).get("CerradaMOVV", List.class);
                                    for (int m = 0; m < auxCerrada.size(); m++) {
                                        List<Document> cerradasvv = auxCerrada.get(0).get("PreguntaCerrada", List.class);
                                        for (int n = 0; n < cerradasvv.size(); n++) {
                                            System.out.println("Opciones columna cerradavv " + cerradasvv.get(n).getString("texto"));
                                            optcvv.add(cerradasvv.get(n).getString("texto"));
                                            columna.setCerradaMOVV(optcvv);
                                        }
                                    }
                                }
                                if (columnas.get(l).get("CerradaLista") != null) {
                                    opcclaux.add(columnas.get(l).getString("descripcion"));
                                    List<Document> auxCerrada = columnas.get(l).get("CerradaLista", List.class);
                                    for (int m = 0; m < auxCerrada.size(); m++) {
                                        System.out.println("tamaño cerrada lll " + auxCerrada.size());
                                        List<Document> cerradasl = auxCerrada.get(0).get("PreguntaCerrada", List.class);
                                        for (int n = 0; n < cerradasl.size(); n++) {
                                            System.out.println("cont1 " + cerradasl.size() + " cont0 " + auxCerrada.size());
                                            //System.out.println("Opciones columna cerradal "+cerradasl.get(n).getString("texto"));
                                            opcclaux.add(cerradasl.get(n).getString("texto"));
                                        }
                                        opccl.add(opcclaux);
                                        columna.setCerradaLista(opccl);
                                        opcclaux = new ArrayList<>();
                                    }

                                }
                            }
                        }
                    }
                }
                
                
                
                
                pregunta.setTablac(columna);
            }
            if (abierta != null) {
                for (int i = 0; i < abierta.size(); i++) {
                    List<List<String>> geta1 = abierta.get(i);
                    for (int j = 0; j < geta1.size(); j++) {
                        List<String> get = geta1.get(j);
                        opa.add(get);
                    }
                }
                pregunta.setAbierta(opa);
            }
            if (abiertaRtas != null) {
                for (int i = 0; i < abiertaRtas.size(); i++) {
                    List<List<String>> geta1 = abiertaRtas.get(i);
                    for (int j = 0; j < geta1.size(); j++) {
                        List<String> get = geta1.get(j);
                        opaRtas.add(get);
                    }
                }
                pregunta.setAbiertaRtas(opaRtas);
            }
            pregunta.setPregunta(descripcion.get(0));
            JsonObject jsonOpciones = (JsonObject) parser.parse(new Gson().toJson(pregunta));
            respuesta.add(jsonOpciones);
        }
        System.out.println(respuesta);
        return respuesta;
    }
    
    public void consulta_dinamica (String [] descripciones, String [] tipo, String [] opciones)  {
        Document aux = null;
        ArrayList<Document> documentos = new ArrayList<>();
        for (int i = 0; i < descripciones.length; i++) {
            if(tipo[i].equals("abierta")){
                aux = new Document("RespuestaPregunta.pregunta.TipoPregunta", 
                        new Document("$elemMatch", new Document("descripcion", descripciones[i])));
            documentos.add(aux);
            } else if(tipo[i].equals("cerradauv")){
                if(opciones.length > 1){
                    
                }else{
                    aux = new Document("RespuestaPregunta.pregunta.TipoPregunta",
                            new Document("$elemMatch", new Document("descripcion", descripciones[i]).
                                    append("CerradaMOUV.PreguntaCerrada", new Document("$elemMatch",
                                    new Document("texto", opciones[0]).append("seleccionado", true)))));
                    documentos.add(aux);
                }
                System.out.println("auxx: "+aux.toJson());
            }
        }
        FindIterable result = collection.find(new Document("$and", documentos)).projection(new Document("csv", 1));
        MongoCursor<Document> ite = result.iterator();
        int cont = 0;
        while (ite.hasNext()) {
            Document next = ite.next();
            cont +=1;
        }
        System.out.println("Encuestas :"+cont);
    }
    
    public String obtenerProyectos(){
        String proyectos = "[";
        String sql = "select NOMBRE, ID from PROYECTOS";
        try {
            this.ps = this.conn.prepareStatement(sql);
            this.rs = ps.executeQuery();
            
            while (rs.next()) {
                proyectos += "{\"nombre\": \""+rs.getString("nombre")+"\", \"id\": \""+rs.getString("id")+"\"},";
            }
            
            proyectos += "]";
            proyectos = proyectos.replaceAll("},]", "}]");
            
        } catch (SQLException ex) {
            Logger.getLogger(Filtro.class.getName()).log(Level.SEVERE, null, ex);
        }
        return proyectos;
    }
    
    public String obtenerDescripcionEncuestasProyecto(String id_proyecto){
        String encuestas_nombres = "[";
        String sql = "select * from (select (select DESCRIPCION from ENCUESTAS where id = pe.ENCUESTA) as NOMBRE, ENCUESTA as ID, (select count(*) from ENCUESTAS_RESPUESTAS_DATOS where ENCUESTA = pe.ENCUESTA and PROYECTO = pe.PROYECTO) as CANTIDAD from PROYECTOS_ENCUESTAS pe where PROYECTO = ?) a where CANTIDAD > 0 order by NOMBRE asc";
        try {
            this.ps = this.conn.prepareStatement(sql);
            this.ps.setInt(1, Integer.parseInt(id_proyecto));
            this.rs = ps.executeQuery();
            
            while (rs.next()) {
                encuestas_nombres += "{\"nombre\": \""+rs.getString("nombre")+"\", \"id\": \""+rs.getString("id")+"\",\"cantidad\": \""+rs.getString("cantidad")+"\"},";
            }
            
            encuestas_nombres += "]";
            encuestas_nombres = encuestas_nombres.replaceAll("},]", "}]");
            
        } catch (SQLException ex) {
            Logger.getLogger(Filtro.class.getName()).log(Level.SEVERE, null, ex);
        }
        return encuestas_nombres;
    }
}

class Encuesta{

    private final int idProyecto;
    private final int idEncuesta;
    List<String> dscrpcns_prgnts;
    
    public Encuesta(int idEncuesta, int idProyecto, List list){
        this.idEncuesta = idEncuesta;
        this.idProyecto = idProyecto;
        this.dscrpcns_prgnts = list;
    }

    public int getIdProyecto() {
        return idProyecto;
    }

    public int getIdEncuesta() {
        return idEncuesta;
    }

    public List<String> getDscrpcns_prgnts() {
        return dscrpcns_prgnts;
    }
}