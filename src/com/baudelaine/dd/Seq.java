package com.baudelaine.dd;

public class Seq {

        String fkcolumn_name = ""; 
        String pkcolumn_name = ""; 
        Short key_seq = null;

        public String getFkcolumn_name() {
                return fkcolumn_name;
        }
        public void setFkcolumn_name(String fkcolumn_name) {
                this.fkcolumn_name = fkcolumn_name;
        }
        public String getPkcolumn_name() {
                return pkcolumn_name;
        }
        public void setPkcolumn_name(String pkcolumn_name) {
                this.pkcolumn_name = pkcolumn_name;
        }
        public Short getKey_seq() {
                return key_seq;
        }
        public void setKey_seq(Short key_seq) {
                this.key_seq = key_seq;
        }
    
}
