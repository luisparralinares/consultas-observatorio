/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Edwin
 */
public class MySQL {
    
    private static Connection conn=null;
    
    public static Connection getConecction()  {
        try {
            String ip="localhost";
            String instancia="encuestas_nuevo";
            String usuario="root";
            String pass="";
            String puerto="3306";
            String url="jdbc:mysql://"+ ip +":"+ puerto +"/"+ instancia ;
        
            if (MySQL.conn == null || MySQL.conn.isClosed() ){
                Class.forName("com.mysql.jdbc.Driver"); 
                MySQL.conn=DriverManager.getConnection(url,usuario,pass);
                return MySQL.conn;
            }
        }
        catch (ClassNotFoundException | SQLException ex){
            System.out.println("ERROR EN EL DRIVER \n ERROR : "+ex.getMessage());
            Logger.getLogger(MySQL.class.getName()).log(Level.SEVERE, null, ex);
            MySQL.DestroyConnection();
        }
        return MySQL.conn;
    }
    
    public static void DestroyConnection(){
        try {
            MySQL.conn.close();
            MySQL.conn=null;
        } catch (SQLException ex) {
            MySQL.conn=null;
            Logger.getLogger(MySQL.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
}
