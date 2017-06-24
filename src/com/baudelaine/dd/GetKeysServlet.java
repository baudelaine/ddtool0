package com.baudelaine.dd;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class GetImportedKeysServlet
 */
@WebServlet("/GetKeys")
public class GetKeysServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
	Connection con = null;
	DatabaseMetaData metaData = null;
	String schema = "";
	String table = "";
	String alias = "";
	String type = "";
	String linker_id = "";
	Map<String, Relation> newRelations = null;
	Map<String, Relation> relations = null;
	Map<String, QuerySubject> query_subjects = null;

       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetKeysServlet() {
        super();
        // TODO Auto-generated constructor stub
    }
    
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	@SuppressWarnings("unchecked")
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		
		table = request.getParameter("table");
		alias = request.getParameter("alias");
		type = request.getParameter("type");
		linker_id = request.getParameter("linker_id");
		System.out.println("table=" + table);
		System.out.println("alias=" + alias);
		System.out.println("type=" + type);
		System.out.println("linker_id=" + linker_id);
		List<Object> result = new ArrayList<Object>();

		try{
			
			con = (Connection) request.getSession().getAttribute("con");
			schema = (String) request.getSession().getAttribute("schema");
			metaData = con.getMetaData();
			
			query_subjects = (Map<String, QuerySubject>) request.getSession().getAttribute("query_subjects");
	        
						
			newRelations = new HashMap<String, Relation>();
			relations = (Map<String, Relation>) request.getSession().getAttribute("relations");
			
			getQuerySubjects();
			getForeignKeys();
			getPrimaryKeys();
			
			
			for(Entry<String, Relation> relation: relations.entrySet()){
				System.out.println(relation.getKey());
			}
			
			if(linker_id != null && linker_id.length() > -1){
				if(relations.containsKey(linker_id)){
					System.out.println("+++ Update linker in relations +++");
					Relation relation = relations.get(linker_id);
					relation.setLinker(true);
					if(type.equalsIgnoreCase("Final")){
						relation.setFin(true);
					}
					if(type.equalsIgnoreCase("Ref")){
						relation.setRef(true);
					}
					relations.put(relation.get_id(), relation);
				}
			}

			relations.putAll(newRelations);
			
			
			
			
			
			
			for(Entry<String, Relation> relation: relations.entrySet()){
		    	result.add(relation.getValue());
		    }
		    
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write(Tools.toJSON(result));			
		
		}
		catch (Exception e){
			e.printStackTrace(System.err);
		}			
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}
	
	protected void getQuerySubjects() throws SQLException{
		
		String _id = alias + type + table;
		
		if(query_subjects.containsKey(_id)){
			return;
		}
		
		QuerySubject query_subject = new QuerySubject();
        query_subject.set_id(alias + type + table);
        query_subject.setTable_alias(alias);
        query_subject.setTable_name(table);
        query_subject.setType(type);
        
        ResultSet rst = metaData.getColumns(con.getCatalog(), schema, table, "%");
        
        while (rst.next()) {
        	String field_name = rst.getString("COLUMN_NAME");
        	String field_type = rst.getString("TYPE_NAME");
        	System.out.println(field_name + "," + field_type);
        	Field field = new Field();
        	field.setField_name(field_name);
        	field.setField_type(field_type);
        	query_subject.addField(field);
        	
        }
        
        query_subjects.put(alias + type + table, query_subject);

        
	}
	
	protected void getForeignKeys() throws SQLException{
		
	    ResultSet rst = metaData.getImportedKeys(con.getCatalog(), schema, table);
	    System.out.println("rst=" + rst);
	    
	    while (rst.next()) {
	    	
	    	String key_name = rst.getString("FK_NAME");
	    	String fk_name = rst.getString("FK_NAME");
	    	String pk_name = rst.getString("PK_NAME");
	    	String key_seq = rst.getString("KEY_SEQ");
	    	String fkcolumn_name = rst.getString("FKCOLUMN_NAME");
	    	String pkcolumn_name = rst.getString("PKCOLUMN_NAME");
	        String fktable_name = rst.getString("FKTABLE_NAME");
	        String pktable_name = rst.getString("PKTABLE_NAME");
	        String _id = key_name + type + alias + "F";
	        
	        System.out.println("_id=" + _id);

	        if(!newRelations.containsKey(key_name)){
	        	
	        	System.out.println("+++ add relation +++");
	        	
	        	Relation relation = new Relation();
	        	
	        	if(relations.get(_id) != null){
		        	System.out.println("Relation _id: " + _id + " already exists. Adding existing linker_ids...");
		        	relation.setLinker_ids(relations.get(_id).getLinker_ids());
		        }

	        	relation.set_id(_id);
	        	relation.setKey_name(key_name);
	        	relation.setFk_name(fk_name);
	        	relation.setPk_name(pk_name);
	        	relation.setTable_name(fktable_name);
	        	relation.setPktable_name(pktable_name);
	        	relation.setTable_alias(alias);
	        	relation.setPktable_alias(pktable_name);
	        	relation.type = type;
	        	relation.setRelashionship("[" + fktable_name + "].[" + fkcolumn_name + "] = [" + pktable_name + "].[" + pkcolumn_name + "]");
	        	relation.setKey_type("F");
	        	if(linker_id != null && linker_id.length() > -1){
	        		relation.addLinker_id(linker_id);
	        	}
	        	
	        	Seq seq = new Seq();
	        	seq.setColumn_name(fkcolumn_name);
	        	seq.setPkcolumn_name(pkcolumn_name);
	        	seq.setKey_seq(Short.parseShort(key_seq));
	        	relation.addSeq(seq);
	        	
	        	newRelations.put(_id, relation);

	        }
	        else{
	        	
	        	Relation relation = newRelations.get(_id);
	        	if(!relation.getSeqs().isEmpty()){
		        	System.out.println("+++ update relation +++");
	        		Seq seq = new Seq();
		        	seq.setColumn_name(fkcolumn_name);
		        	seq.setPkcolumn_name(pkcolumn_name);
		        	seq.setKey_seq(Short.parseShort(key_seq));
		        	
		        	relation.addSeq(seq);
		        	
		        	StringBuffer sb = new StringBuffer((String) relation.getRelashionship());
		        	sb.append(" AND [" + fktable_name + "].[" + fkcolumn_name + "] = [" + pktable_name + "].[" + pkcolumn_name + "]");
		        	relation.setRelashionship(sb.toString());
	        	}
	        	
	        }
        	
	        	
	    }
		
	}
	
	protected void getPrimaryKeys() throws SQLException{
		
		ResultSet rst = null;
		DatabaseMetaData metaData = con.getMetaData();
	    rst = metaData.getExportedKeys(con.getCatalog(), schema, table);
	    
	    while (rst.next()) {
	    	
	    	String key_name = rst.getString("FK_NAME");
	    	String fk_name = rst.getString("FK_NAME");
	    	String pk_name = rst.getString("PK_NAME");
	    	String key_seq = rst.getString("KEY_SEQ");
	    	String fkcolumn_name = rst.getString("FKCOLUMN_NAME");
	    	String pkcolumn_name = rst.getString("PKCOLUMN_NAME");
	        String fktable_name = rst.getString("FKTABLE_NAME");
	        String pktable_name = rst.getString("PKTABLE_NAME");
	        String _id = key_name + type + alias + "P";
	        
	        System.out.println("_id=" + _id);

	        if(!newRelations.containsKey(key_name)){
	        	
	        	System.out.println("+++ add relation +++");
	        	
	        	Relation relation = new Relation();
	        	
	        	if(type.equalsIgnoreCase("Ref")){
			        if(relations.get(_id) != null){
			        	System.out.println("Relation _id: " + _id + " already exists. Adding existing linker_ids...");
			        	relation.setLinker_ids(relations.get(_id).getLinker_ids());
			        }
	        	}

	        	relation.set_id(_id);
	        	relation.setKey_name(key_name);
	        	relation.setFk_name(fk_name);
	        	relation.setPk_name(pk_name);
	        	relation.setTable_name(pktable_name);
	        	relation.setPktable_name(fktable_name);
	        	relation.setTable_alias(alias);
	        	relation.setPktable_alias(fktable_name);
	        	relation.type = type;
	        	relation.setRelashionship("[" + fktable_name + "].[" + fkcolumn_name + "] = [" + pktable_name + "].[" + pkcolumn_name + "]");
	        	relation.setKey_type("P");
	        	if(linker_id != null && linker_id.length() > -1){
	        		relation.addLinker_id(linker_id);
	        	}
	        	
	        	Seq seq = new Seq();
	        	seq.setColumn_name(pkcolumn_name);
	        	seq.setPkcolumn_name(fkcolumn_name);
	        	seq.setKey_seq(Short.parseShort(key_seq));
	        	relation.addSeq(seq);
	        	
	        	newRelations.put(_id, relation);

	        }
	        else{
	        	
	        	Relation relation = newRelations.get(_id);
	        	if(!relation.getSeqs().isEmpty()){
		        	System.out.println("+++ update relation +++");
	        		Seq seq = new Seq();
		        	seq.setColumn_name(pkcolumn_name);
		        	seq.setPkcolumn_name(fkcolumn_name);
		        	seq.setKey_seq(Short.parseShort(key_seq));
		        	
		        	relation.addSeq(seq);
		        	
		        	StringBuffer sb = new StringBuffer((String) relation.getRelashionship());
		        	sb.append(" AND [" + fktable_name + "].[" + fkcolumn_name + "] = [" + pktable_name + "].[" + pkcolumn_name + "]");
		        	relation.setRelashionship(sb.toString());
	        	}
	        	
	        }
        	
	        	
	    }
		
	}
	

}

