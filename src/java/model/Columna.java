/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

import java.util.List;

/**
 *
 * @author Luis Parra
 */
public class Columna {
    
    List<String> abierta;
    List<String> CerradaMOUV;
    List<String> CerradaMOVV;
    List<List<String>> CerradaLista;    

    public List<String> getCerradaMOUV() {
        return CerradaMOUV;
    }

    public void setCerradaMOUV(List<String> CerradaMOUV) {
        this.CerradaMOUV = CerradaMOUV;
    }

    public List<String> getCerradaMOVV() {
        return CerradaMOVV;
    }

    public void setCerradaMOVV(List<String> CerradaMOVV) {
        this.CerradaMOVV = CerradaMOVV;
    }

    public List<String> getAbierta() {
        return abierta;
    }

    public void setAbierta(List<String> abierta) {
        this.abierta = abierta;
    }

    public List<List<String>> getCerradaLista() {
        return CerradaLista;
    }

    public void setCerradaLista(List<List<String>> CerradaLista) {
        this.CerradaLista = CerradaLista;
    }
    
}
