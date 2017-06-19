package com.baudelaine.dd;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
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

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Servlet implementation class GetImportedKeysServlet
 */
@WebServlet("/GetAllKeys")
public class GetAllKeysServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetAllKeysServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	@SuppressWarnings("unchecked")
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub

		BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
        String json = "";
        ObjectMapper mapper = new ObjectMapper();
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);

        Relation father = null;
        
        if(br != null){
            while((json = br.readLine()) != null){
	            System.out.println("json="+json);
		        father = mapper.readValue(json, Relation.class);
            }
        }
        
        if(father == null){
        	System.err.println("!!! father is null !!!");
        	return;
        }
        
        Map<String, Object> table_aliases = (Map<String, Object>) request.getSession().getAttribute("table_aliases");
        table_aliases.put(father.getPktable_alias(), father.getFktable_name());
        
        Map<String, Relation> relations = (Map<String, Relation>) request.getSession().getAttribute("relations");
        
		// Update father _id if pktable_alias has changed
        relations.remove(father.get_id());
        father.set_id(father.getFktable_alias() + father.getType() + father.getPktable_alias() + father.getKey_type());
        relations.put(father.get_id(), father);
		
		
		Connection con = null;
		ResultSet rst = null;
		List<Object> result = new ArrayList<Object>();
    	String schema = "";
		
		try {
			
			con = (Connection) request.getSession().getAttribute("con");
			schema = (String) request.getSession().getAttribute("schema");
			DatabaseMetaData metaData = con.getMetaData();

	    	// get Foreign Keys
		    rst = metaData.getImportedKeys(con.getCatalog(), schema, father.getPktable_name());
		    Map<String, Relation> newRelations = new HashMap<String, Relation>();
		    while (rst.next()) {
		    	
		    	String key_name = rst.getString("FK_NAME");
		    	String key_seq = rst.getString("KEY_SEQ");
		    	String fkcolumn_name = rst.getString("FKCOLUMN_NAME");
		    	String pkcolumn_name = rst.getString("PKCOLUMN_NAME");
		        String fktable_name = rst.getString("FKTABLE_NAME");
		        String pktable_name = rst.getString("PKTABLE_NAME");
		        String _id = father.getPktable_alias() + father.getType() + pktable_name + "F";
		        
		        System.out.println("_id=" + _id);
		        Relation relation = null;

		        if(!newRelations.containsKey(key_name)){
		        	
		        	System.out.println("+++ add relation +++");
		        	
		        	relation = new Relation();

			        if(relations.get(_id) != null){
			        	System.out.println("Relation _id: " + _id + " already exists. Adding existing father_ids...");
			        	relation.setFather_ids(relations.get(_id).getFather_ids());
			        }
		        	
		        	relation.set_id(_id);
		        	relation.setKey_name(key_name);
		        	relation.setFktable_name(fktable_name);
		        	relation.setPktable_name(pktable_name);
		        	relation.setFktable_alias(father.getPktable_alias());
		        	relation.setPktable_alias(pktable_name);
		        	relation.setType(father.getType());
		        	relation.setRelashionship("[" + fktable_name + "].[" + fkcolumn_name + "] = [" + pktable_name + "].[" + pkcolumn_name + "]");
		        	relation.setKey_type("F");
		        	relation.addFather_id(father.get_id());
		        	
		        	Seq seq = new Seq();
		        	seq.setFkcolumn_name(fkcolumn_name);
		        	seq.setPkcolumn_name(pkcolumn_name);
		        	seq.setKey_seq(Short.parseShort(key_seq));
		        	relation.addSeq(seq);
		        	
		        	newRelations.put(key_name, relation);
			        relations.put(_id, relation);

		        }
		        else{
		        	
		        	relation = newRelations.get(key_name);
		        	if(!relation.getSeqs().isEmpty()){
			        	System.out.println("+++ update relation +++");
		        		Seq seq = new Seq();
			        	seq.setFkcolumn_name(fkcolumn_name);
			        	seq.setPkcolumn_name(pkcolumn_name);
			        	seq.setKey_seq(Short.parseShort(key_seq));
			        	
			        	relation.addSeq(seq);
			        	
			        	StringBuffer sb = new StringBuffer((String) relation.getRelashionship());
			        	sb.append(" AND [" + fktable_name + "].[" + fkcolumn_name + "] = [" + pktable_name + "].[" + pkcolumn_name + "]");
			        	relation.setRelashionship(sb.toString());
		        	}
		        	
		        }
	        	
		        	
		    }
		    rst.close();
		    
	    	// get Primary Keys
		    rst = metaData.getExportedKeys(con.getCatalog(), schema, father.getPktable_name());
		    newRelations = new HashMap<String, Relation>();
		    while (rst.next()) {
		    	
		    	String key_name = rst.getString("PK_NAME");
		    	String key_seq = rst.getString("KEY_SEQ");
		    	String fkcolumn_name = rst.getString("FKCOLUMN_NAME");
		    	String pkcolumn_name = rst.getString("PKCOLUMN_NAME");
		        String fktable_name = rst.getString("FKTABLE_NAME");
		        String pktable_name = rst.getString("PKTABLE_NAME");
		        String _id = father.getPktable_alias() + father.getType() + fktable_name + "P";
		        System.out.println("_id=" + _id);
		        Relation relation = null;
		        
		        if(!newRelations.containsKey(fktable_name)){
		        	
		        	System.out.println("+++ add relation +++");
		        	
		        	relation = new Relation();

		        	relation.set_id(_id);
		        	relation.setKey_name(key_name);
		        	relation.setFktable_name(pktable_name);
		        	relation.setPktable_name(fktable_name);
		        	relation.setFktable_alias(father.getPktable_alias());
		        	relation.setPktable_alias(fktable_name);
		        	relation.setType(father.getType());
		        	relation.setRelashionship("[" + fktable_name + "].[" + fkcolumn_name + "] = [" + pktable_name + "].[" + pkcolumn_name + "]");
		        	relation.setKey_type("P");
		        	relation.addFather_id(father.get_id());
		        	
		        	Seq seq = new Seq();
		        	seq.setFkcolumn_name(fkcolumn_name);
		        	seq.setPkcolumn_name(pkcolumn_name);
		        	seq.setKey_seq(Short.parseShort(key_seq));
		        	relation.addSeq(seq);
		        	
		        	newRelations.put(fktable_name, relation);
			        relations.put(_id, relation);

		        }
		        else{
		        	
		        	relation = newRelations.get(fktable_name);
		        	if(!relation.getSeqs().isEmpty()){
			        	System.out.println("+++ update relation +++");
		        		Seq seq = new Seq();
			        	seq.setFkcolumn_name(fkcolumn_name);
			        	seq.setPkcolumn_name(pkcolumn_name);
			        	seq.setKey_seq(Short.parseShort(key_seq));
			        	
			        	relation.addSeq(seq);
			        	
			        	StringBuffer sb = new StringBuffer((String) relation.getRelashionship());
			        	sb.append(" AND [" + fktable_name + "].[" + fkcolumn_name + "] = [" + pktable_name + "].[" + pkcolumn_name + "]");
			        	relation.setRelashionship(sb.toString());
		        	}
		        	
		        }
	        	
		        	
		    }
		    rst.close();
		    
		    
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

}

