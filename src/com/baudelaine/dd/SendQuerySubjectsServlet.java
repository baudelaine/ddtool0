package com.baudelaine.dd;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import datadixit.limsbi.svc.FactorySVC;
import datadixit.limsbi.svc.TaskerSVC;

/**
 * Servlet implementation class GetSelectionsServlet
 */
@WebServlet(name = "SendQuerySubjects", urlPatterns = { "/SendQuerySubjects" })
public class SendQuerySubjectsServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
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
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		@SuppressWarnings("unchecked")
		Map<String, QuerySubject> query_subjects = (Map<String, QuerySubject>) request.getSession().getAttribute("query_subjects");
		
		System.out.println("+++++++++++ query_subjects.size=" + query_subjects.size());
		
//		TaskerSVC.start();
//
//		TaskerSVC.init();
//		TaskerSVC.Import();
		
		FactorySVC.createNamespace("AUTOGENERATION", "STANDARD");
		FactorySVC.createNamespace("FINAL", "AUTOGENERATION");
		FactorySVC.createNamespace("REF", "AUTOGENERATION");
		FactorySVC.createNamespace("DATA", "AUTOGENERATION");
		
		List<Object> result = new ArrayList<Object>();
		
		for(Entry<String, QuerySubject> query_subject: query_subjects.entrySet()){
	    	
			
			System.out.println("+++++++++++++++ alias=" + query_subject.getValue().getTable_alias());
			System.out.println("+++++++++++++++ table=" + query_subject.getValue().getTable_name());
			System.out.println("+++++++++++++++ type=" + query_subject.getValue().getType());
			
	    }
		
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(Tools.toJSON(result));
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
