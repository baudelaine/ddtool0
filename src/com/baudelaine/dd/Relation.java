package com.baudelaine.dd;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Relation {

	String _id = "";
	String _rev = null;
	String key_name = "";
	String fk_name = "";
	String pk_name = "";
	String table_name = "";
	String pktable_name = "";	
	String table_alias = "";
	String pktable_alias = "";	
	String type = "";
	boolean fin = false;
	boolean ref = false;
	String relashionship = "";
	boolean linker = false;
	String key_type = "";
	Set<String> linker_ids =  new HashSet<String>();
	List<Seq> seqs = new ArrayList<Seq>();
	
	public String get_id() {
		return _id;
	}
	public void set_id(String _id) {
		this._id = _id;
	}
	public String get_rev() {
		return _rev;
	}
	public void set_rev(String _rev) {
		this._rev = _rev;
	}
	public String getKey_name() {
		return key_name;
	}
	public void setKey_name(String key_name) {
		this.key_name = key_name;
	}
	public String getFk_name() {
		return fk_name;
	}
	public void setFk_name(String fk_name) {
		this.fk_name = fk_name;
	}
	public String getPk_name() {
		return pk_name;
	}
	public void setPk_name(String pk_name) {
		this.pk_name = pk_name;
	}
	public String getTable_name() {
		return table_name;
	}
	public void setTable_name(String table_name) {
		this.table_name = table_name;
	}
	public String getPktable_name() {
		return pktable_name;
	}
	public void setPktable_name(String pktable_name) {
		this.pktable_name = pktable_name;
	}
	public String getTable_alias() {
		return table_alias;
	}
	public void setTable_alias(String table_alias) {
		this.table_alias = table_alias;
	}
	public String getPktable_alias() {
		return pktable_alias;
	}
	public void setPktable_alias(String pktable_alias) {
		this.pktable_alias = pktable_alias;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public boolean isFin() {
		return fin;
	}
	public void setFin(boolean fin) {
		this.fin = fin;
	}
	public boolean isRef() {
		return ref;
	}
	public void setRef(boolean ref) {
		this.ref = ref;
	}
	public String getRelashionship() {
		return relashionship;
	}
	public void setRelashionship(String relashionship) {
		this.relashionship = relashionship;
	}
	public boolean isLinker() {
		return linker;
	}
	public void setLinker(boolean linker) {
		this.linker = linker;
	}
	public String getKey_type() {
		return key_type;
	}
	public void setKey_type(String key_type) {
		this.key_type = key_type;
	}
	public Set<String> getLinker_ids() {
		return linker_ids;
	}
	public void setLinker_ids(Set<String> linker_ids) {
		this.linker_ids = linker_ids;
	}
	public List<Seq> getSeqs() {
		return seqs;
	}
	public void setSeqs(List<Seq> seqs) {
		this.seqs = seqs;
	}
	public void addSeq(Seq seq) {
		this.seqs.add(seq);
	}
	public void addLinker_id(String linker){
		this.linker_ids.add(linker);
	}
	
	
	
	
}
