package datadixit.limsbi.action;

import javax.swing.tree.DefaultMutableTreeNode;
import javax.swing.tree.TreeNode;


public class Test0 {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub

		DefaultMutableTreeNode root;
        DefaultMutableTreeNode grandparent;
        DefaultMutableTreeNode parent;

        root = new DefaultMutableTreeNode("root");

        grandparent = new DefaultMutableTreeNode("grandparent");
        root.add(grandparent);

        parent = new DefaultMutableTreeNode("parent");
        grandparent.add(parent);		
        
        TreeNode[] nodes = parent.getPath();
        
        
        for(TreeNode node: nodes){
        	System.out.println(node);
        }
        
		
	}

}
