package com.baudelaine.dd;

import java.io.IOException;
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

import datadixit.limsbi.pojos.RelationShip;
import datadixit.limsbi.svc.FactorySVC;
import datadixit.limsbi.svc.TaskerSVC;

/**
 * Servlet implementation class GetSelectionsServlet
 */
@WebServlet(name = "SendQuerySubjects", urlPatterns = { "/SendQuerySubjects" })
public class SendQuerySubjectsServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	Map<String, RefMap> gRefMap;
	List<RelationShip> rsList;
	Map<String, QuerySubject> query_subjects;
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public SendQuerySubjectsServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	@SuppressWarnings("unchecked")
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		query_subjects = (Map<String, QuerySubject>) request.getSession().getAttribute("query_subjects");
		
		System.out.println("+++++++++++ query_subjects.size=" + query_subjects.size());
		
		try{
			
			TaskerSVC.start();
	
			TaskerSVC.init();
			TaskerSVC.Import();
			TaskerSVC.IICInitNameSpace();
	
			
			
			List<Object> result = new ArrayList<Object>();
		
			// start creation tronc
			
			gRefMap = new HashMap<String, RefMap>();
			
			rsList = new ArrayList<RelationShip>();
			
			for(Entry<String, QuerySubject> query_subject: query_subjects.entrySet()){
	
				// on reset tout les inc de gRefMap
				for(Entry<String, RefMap> rm: gRefMap.entrySet()){
					rm.getValue().resetInc();
				}
				
				System.out.println("+++++++++++++++ alias=" + query_subject.getValue().getTable_alias());
				System.out.println("+++++++++++++++ table=" + query_subject.getValue().getTable_name());
				System.out.println("+++++++++++++++ type=" + query_subject.getValue().getType());
				
				if (query_subject.getValue().getType().equalsIgnoreCase("Final")){
					FactorySVC.createQuerySubject("PHYSICAL", "FINAL", query_subject.getValue().getTable_name(), query_subject.getValue().getTable_alias());
					System.out.println("FactorySVC.createQuerySubject PHYSICAL, FINAL, " + query_subject.getValue().getTable_name() + ", " + query_subject.getValue().getTable_alias());
					
					
					
					for(Entry<String, Relation> rel: query_subject.getValue().getRelations().entrySet()){
						if(rel.getValue().isRef()){
							
							String alias = rel.getValue().getPktable_name();
							
							RefMap refMap = gRefMap.get(alias);
							String qs = "";
							
							if(refMap == null){
								refMap = new RefMap();
								refMap.add(alias, true);
								refMap.incInc();
								gRefMap.put(alias, refMap);
								
								qs = alias + refMap.getCount();
								
								FactorySVC.createQuerySubject("PHYSICAL", "REF", rel.getValue().getPktable_name(), qs);

							}
							else{
								refMap.incInc();
								if(refMap.getInc() > refMap.getCount()){
									refMap.add(alias, true);
									gRefMap.put(alias, refMap);
									
									qs = alias + refMap.getCount();
									
									FactorySVC.createQuerySubject("PHYSICAL", "REF", rel.getValue().getPktable_name(), qs);
								}
								
							}

							qs = alias + refMap.getInc();
							
							RelationShip RS = new RelationShip("[FINAL].[" + query_subject.getValue().getTable_alias() + "]" , "[REF].[" + qs + "]");
							RS.setExpression(rel.getValue().getRelashionship());
							RS.setCard_left_min("one");
							RS.setCard_left_max("many");

							RS.setCard_right_min("one");
							RS.setCard_right_max("one");
							RS.setParentNamespace("AUTOGENERATION");
							rsList.add(RS);
							
						}
					}

				}
	
		    }
			
			// end creation troncs

			Map<String, RefMap> troncs = new HashMap<String, RefMap>();
			
			for(Entry<String, RefMap> tronc: gRefMap.entrySet()){
				RefMap value = tronc.getValue();
				RefMap copy = new RefMap(value.getCount(), value.getInc(), value.getTreeCount(), value.getTree());
				troncs.put(tronc.getKey(), copy);
				
			}
			
					
			System.out.println("+-+-+-+-+-+- TRONCS " + troncs);
			
			for(Entry<String, RefMap> tronc: troncs.entrySet()){
				String aliasTronc = tronc.getKey();
				System.out.println("+-+-+-+-+- aliasTronc " + aliasTronc);
				Map<String, Boolean> qsTroncs = tronc.getValue().getTree();
				for(Entry<String, Boolean> qsTronc: qsTroncs.entrySet()){
					System.out.println("+-+-+-+-+- qsTronc " + qsTronc);
					
					f0(aliasTronc, qsTronc.getKey());
					
					}
					
				
			}
			TaskerSVC.IICCreateRelation(rsList);
			
			TaskerSVC.stop();

			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write(Tools.toJSON(result));
			
		}
		catch(Exception e){
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

	protected void f0(String aliasTronc, String qs){
		
		QuerySubject query_subject = query_subjects.get(aliasTronc + "Ref");
		
		System.out.println("+-+-+-+-" + query_subject.get_id());
		for(Entry<String, Relation> rel: query_subject.getRelations().entrySet()){
			if(rel.getValue().isRef()){
				
				String alias = rel.getValue().getPktable_name();
				
				RefMap refMap = gRefMap.get(alias);
				
				if(refMap == null){
					System.out.println("+-+-+-+- ON RENTRE DANS LE NULL");
					refMap = new RefMap();
				}
				refMap.add(alias, false);

//						gRefMap.put(alias, refMap);
				
				FactorySVC.createQuerySubject("PHYSICAL", "REF", rel.getValue().getPktable_name(), alias + refMap.getCount());
				
				RelationShip RS = new RelationShip("[REF].[" + qs + "]" , "[REF].[" + alias + refMap.getCount() + "]");
				// changer en qs + refobj
				RS.setExpression(rel.getValue().getRelashionship());
				RS.setCard_left_min("one");
				RS.setCard_left_max("many");

				RS.setCard_right_min("one");
				RS.setCard_right_max("one");
				RS.setParentNamespace("REF");
				rsList.add(RS);
				
				// Le rappel recursif
				f0(alias, alias + refMap.getCount());
				
			}
		}
	}
	
}
