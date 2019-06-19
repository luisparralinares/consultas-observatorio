/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package controller;


import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.InvocationTargetException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.Filtro;

/**
 *
 * @author Luis Parra
 */
public class ConsultasController extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    
    String [] functions;
    Filtro filtro;
    
    public ConsultasController(){
        this.functions = new String[4];
        this.functions[0] = "obtenerProyectos";
        this.functions[1] = "obtenerDescripcionEncuestasProyecto";
        this.functions[2] = "obtenerDescripcionPreguntasEncuesta";
        this.functions[3] = "obtenerPreguntasEncuesta";
        this.filtro = new Filtro();
    }
    
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        
        int indexF = -1;
        String parametersF = "";
        
        if(request.getParameter("opcion") != null){
            indexF = Integer.parseInt(request.getParameter("opcion"));
        }
        
        if(request.getParameter("parametros") != null){
            parametersF = request.getParameter("parametros");
        }
        
        if(indexF != -1){
            try {
                if("".equals(parametersF)){
                    out.print(this.filtro.getClass().getMethod(functions[indexF]).invoke(this.filtro));
                }else{
                    out.print(this.filtro.getClass().getMethod(functions[indexF], parametersF.getClass()).invoke(this.filtro, parametersF));
                }
            } catch (IllegalAccessException | IllegalArgumentException | NoSuchMethodException | SecurityException | InvocationTargetException ex) { 
                Logger.getLogger(Filtro.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        
//        String opcion = request.getParameter("opcion");
//        String encuesta = request.getParameter("nombreEncuesta");
//        String preguntas [] = request.getParameterValues("arrPreguntas[]");
//        String consultas [] = request.getParameterValues("arrConsultas[]");
//        String cc = request.getParameter("arrConsultas");
        
//        JsonParser parser = new JsonParser();
//        Filtro f = new Filtro();
//        JsonArray json = null;
        
//        try {
//        if(opcion.equals("criterios") && !encuesta.equals("")) {
//            json = f.obtenerPreguntasEncuesta( encuesta);
//            out.print(json);
//        }
//        if(opcion.equals("preguntas") && !preguntas.equals("")){
//            List<String> pregunt = Arrays.asList(preguntas);
//            JsonArray respuesta = f.verTipoDePregunta(pregunt);
//            
//            out.print(respuesta);
//        }
//        if(opcion.equals("consultas")) {
//            System.out.println("consultas "+consultas);
//            System.out.println("consultas "+cc);
//            out.print("Hola Mundo");
//        }
//        }catch(Exception e){
//            out.print("error try-catch Consultas "+e.getMessage());
//        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
