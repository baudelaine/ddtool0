package com.baudelaine.dd;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Relation {

	String _id = "";
	String _ref = null;
	String key_name = "";
	String fktable_name = "";
	String pktable_name = "";	
	String fktable_alias = "";
	String pktable_alias = "";	
	String type = "";
	boolean fin = false;
	boolean ref = false;
	String relashionship = "";
	boolean father = false;
	String key_type = "";
	Set<String> father_ids =  new HashSet<String>();
	List<Seq> seqs = new ArrayList<Seq>();
	
	public String get_id() {
		return _id;
	}
	public void set_id(String _id) {
		this._id = _id;
	}
	public String get_ref() {
		return _ref;
	}
	public String getKey_name() {
		return key_name;
	}
	public void setKey_name(String key_name) {
		this.key_name = key_name;
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
	public boolean isFather() {
		return father;
	}
	public void setFather(boolean father) {
		this.father = father;
	}
	public Set<String> getFather_ids() {
		return father_ids;
	}
	public void setFather_ids(Set<String> father_ids) {
		this.father_ids = father_ids;
	}
	public void addFather_id(String father){
		this.father_ids.add(father);
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public void set_ref(String _ref) {
		this._ref = _ref;
	}
	public String getFktable_name() {
		return fktable_name;
	}
	public void setFktable_name(String fktable_name) {
		this.fktable_name = fktable_name;
	}
	public String getPktable_name() {
		return pktable_name;
	}
	public void setPktable_name(String pktable_name) {
		this.pktable_name = pktable_name;
	}
	public String getFktable_alias() {
		return fktable_alias;
	}
	public void setFktable_alias(String fktable_alias) {
		this.fktable_alias = fktable_alias;
	}
	public String getPktable_alias() {
		return pktable_alias;
	}
	public void setPktable_alias(String pktable_alias) {
		this.pktable_alias = pktable_alias;
	}
	public String getRelashionship() {
		return relashionship;
	}
	public void setRelashionship(String relashionship) {
		this.relashionship = relashionship;
	}
	public String getKey_type() {
		return key_type;
	}
	public void setKey_type(String key_type) {
		this.key_type = key_type;
	}
	public List<Seq> getSeqs() {
        return seqs;
	}
	public void setSeqs(List<Seq> seqs) {
	        this.seqs = seqs;
	}
	public void addSeq(Seq seq){
		this.seqs.add(seq);
	}
	
}
