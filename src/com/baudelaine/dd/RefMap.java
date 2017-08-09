package com.baudelaine.dd;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.ReentrantLock;

public class RefMap {
	
	Integer count = new Integer(0);
	Integer inc = new Integer(0);
	Integer treeCount = new Integer(0);
	Map<String, Boolean> tree = new HashMap<String, Boolean>();  
	ReentrantLock lock = new ReentrantLock();
	
	
	public RefMap(Integer count, Integer inc, Integer treeCount,
			Map<String, Boolean> tree) {
		super();
		this.count = count;
		this.inc = inc;
		this.treeCount = treeCount;
		this.tree = tree;
	}

	public RefMap() {
		// TODO Auto-generated constructor stub
	}

	public void add(String alias, boolean tree){

		String s = alias + ++this.count;
		
		System.out.println("++++++++++++++ alias + ++this.count " + s);
		
		this.tree.put(s, tree);
		if(tree == true){
			this.treeCount++;
		}
		
	}
	
	public Map<String, Boolean> getTree(){
		return this.tree;
	}
	
	public int getCount(){
		 return this.count;
	}
	
	public void resetInc(){
		this.inc = 0;
	}
	
	public  int getInc(){
		return this.inc;
	}
	
	public void incInc(){
		this.inc++;
	}
	
	public int getTreeCount(){
		return this.treeCount;
	}
	
	
}
