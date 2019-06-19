/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package database;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

/**
 *
 * @author Luis Parra
 */
public class MongoDB {

    private static MongoClient mclient = null;
    private static MongoDatabase dbase = null;
    private static MongoCollection mcollection = null;

    public static MongoClient getConexion() {

        String usuario = "pruebas";
        String contrasena = "pruebas";
        String bd = "observatorio";
        String dominio = "localhost";
        String puerto = "27017";
        String uri = "mongodb://" + usuario + ":" + contrasena + "@" + dominio + ":" + puerto + "/?authSource=" + bd;

        if (MongoDB.mclient == null) {
            MongoDB.mclient = MongoClients.create(uri);
        }

        return MongoDB.mclient;
    }
    
    public static MongoDatabase getDatabase(){
        if (MongoDB.dbase == null) {
            MongoDB.dbase = MongoDB.getConexion().getDatabase("observatorio");       
        }
        return MongoDB.dbase;
    }
    
    public static MongoCollection getCollection(){
        if (MongoDB.mcollection == null) {
            MongoDB.mcollection = MongoDB.getDatabase().getCollection("encuestas");       
        }
        return MongoDB.mcollection;
    }

    public static void destroyConnection() {
        MongoDB.mclient.close();
        MongoDB.mclient = null;
    }

}
