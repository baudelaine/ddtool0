package com.baudelaine.dd;

public class Field {

	String field_name = "";
	String field_type = "";
	String label = "";
	boolean traduction = false;
	boolean visibleField = false;
	boolean timezone = false;
	String icon = "";

	public String getField_name() {
		return field_name;
	}
	public void setField_name(String field_name) {
		this.field_name = field_name;
	}
	public String getField_type() {
		return field_type;
	}
	public void setField_type(String field_type) {
		this.field_type = field_type;
	}
	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
	}
	public boolean isTraduction() {
		return traduction;
	}
	public void setTraduction(boolean traduction) {
		this.traduction = traduction;
	}
	
	public boolean isVisibleField() {
		return visibleField;
	}
	public void setVisibleField(boolean visibleField) {
		this.visibleField = visibleField;
	}
	public boolean isTimezone() {
		return timezone;
	}
	public void setTimezone(boolean timezone) {
		this.timezone = timezone;
	}
	public String getIcon() {
		return icon;
	}
	public void setIcon(String icon) {
		this.icon = icon;
	}
	
}
