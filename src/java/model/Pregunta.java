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
public class Pregunta {
    String pregunta = "";
    List<List<String>> cerradauv = null;
    List<List<String>> cerradavv = null;
    List<List<String>> cerradaLista = null;
    List<List<String>> abierta = null;
    List<List<String>> abiertaRtas = null;
    Fila tablaf = null;
    Columna tablac = null;

    public List<List<String>> getCerradauv() {
        return cerradauv;
    }

    public void setCerradauv(List<List<String>> cerradauv) {
        this.cerradauv = cerradauv;
    }

    public List<List<String>> getCerradavv() {
        return cerradavv;
    }

    public void setCerradavv(List<List<String>> cerradavv) {
        this.cerradavv = cerradavv;
    }

    public List<List<String>> getCerradaLista() {
        return cerradaLista;
    }

    public void setCerradaLista(List<List<String>> cerradaLista) {
        this.cerradaLista = cerradaLista;
    }

    public List<List<String>> getAbierta() {
        return abierta;
    }

    public void setAbierta(List<List<String>> abierta) {
        this.abierta = abierta;
    }

    public List<List<String>> getAbiertaRtas() {
        return abiertaRtas;
    }

    public void setAbiertaRtas(List<List<String>> abiertaRtas) {
        this.abiertaRtas = abiertaRtas;
    }

    
    
    public String getPregunta() {
        return pregunta;
    }

    public void setPregunta(String pregunta) {
        this.pregunta = pregunta;
    }   

    public Fila getTablaf() {
        return tablaf;
    }

    public void setTablaf(Fila tablaf) {
        this.tablaf = tablaf;
    }

    public Columna getTablac() {
        return tablac;
    }

    public void setTablac(Columna tablac) {
        this.tablac = tablac;
    }
    
}
