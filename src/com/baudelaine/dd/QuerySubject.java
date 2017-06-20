package com.baudelaine.dd;

public class QuerySubject {
	
	String _id = "";
	String _ref = null;
	String table_name = "";
	String table_alias = "";
	String type = "";
	boolean visible = false;
	String filter = "";
	String Label = "";
	
	public String get_id() {
		return _id;
	}
	public void set_id(String _id) {
		this._id = _id;
	}
	public String get_ref() {
		return _ref;
	}
	public void set_ref(String _ref) {
		this._ref = _ref;
	}
	public String getTable_name() {
		return table_name;
	}
	public void setTable_name(String table_name) {
		this.table_name = table_name;
	}
	public String getTable_alias() {
		return table_alias;
	}
	public void setTable_alias(String table_alias) {
		this.table_alias = table_alias;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public boolean isVisible() {
		return visible;
	}
	public void setVisible(boolean visible) {
		this.visible = visible;
	}
	public String getFilter() {
		return filter;
	}
	public void setFilter(String filter) {
		this.filter = filter;
	}
	public String getLabel() {
		return Label;
	}
	public void setLabel(String label) {
		Label = label;
	}

}
