
var relation = {
	_id: "",
	// _ref: null,
	table_name: "",
	table_alias: "",
	type: "",
	key_name: "",
	key_type: "",
	pktable_name: "",
	pktable_alias: "",
	relashionship: "",
	fin: false,
	ref: false,
	linker: false,
	// seqs: [],
	// checkbox: false,
	linker_ids: []

};

var activeTab = 'Final';
var previousTab = '';

$(document).ready(function() {
	$(document).ready(function(){
	    $("div.content").click(function(){
	        $("div#divLoading").addClass('show');
	    });
	});
	ChooseTable($('#tables'));
	buildRelationsTable();
	builQuerySubjectsTable();
	$('#QuerySubjectsTable').hide();

});

$(document)
.ajaxStart(function(){
    $("div#divLoading").addClass('show');
		$("div#modDivLoading").addClass('show');
})
.ajaxStop(function(){
    $("div#divLoading").removeClass('show');
		$("div#modDivLoading").removeClass('show');
});

$('.nav-tabs a').on('shown.bs.tab', function(event){

		console.log($(this)[0].hash);

    activeTab = $(event.target).text();         // active tab
		console.log("activeTab=" + activeTab);
    previousTab = $(event.relatedTarget).text();  // previous tab
		console.log("previousTab=" + previousTab);

});

$('#modQuerySubject').change(function () {
    selectedText = $(this).find("option:selected").text();
		$('#modFKTableAlias').val(selectedText);
});

$('#modPKTables').change(function () {
    selectedText = $(this).find("option:selected").text();
		$('#modPKTableAlias').val(selectedText);
});

$('#tables').change(function () {
    var selectedText = $(this).find("option:selected").text();
		$('#alias').val(selectedText);
});

$('#newRowModal').on('show.bs.modal', function (e) {
  // do something...
	ChooseQuerySubject($('#modQuerySubject'));
	ChooseTable($('#modPKTables'));

})

function showalert(message, alerttype) {

    $('#alert_placeholder').append('<div id="alertdiv" class="alert ' +
		alerttype + ' input-sm"><span>' + message + '</span></div>')

    setTimeout(function() {

      $("#alertdiv").remove();

    }, 2500);
}

$("a[href='#QuerySubject']").on('shown.bs.tab', function(e) {
			$("#RelationsTable").hide();
			$("div#relsToolbar").hide();
			LoadQuerySubjects();
			$('#QuerySubjectsTable').show();

});

$("a[href='#Fields']").on('shown.bs.tab', function(e) {
			 $("#RelationsTable").hide();
 			$("div#relsToolbar").hide();
			$('#QuerySubjectsTable').hide();

});

$("a[href='#Reference']").on('shown.bs.tab', function(e) {
			$("#RelationsTable").show();
			$("div#relsToolbar").show();
			$('#QuerySubjectsTable').hide();
			$('#RelationsTable').bootstrapTable("filterBy", {type: ['Final', 'Ref'], key_type: ['F','P', 'C']});
			$('#RelationsTable').bootstrapTable('hideColumn', 'fin');
			$('#RelationsTable').bootstrapTable('showColumn', 'ref');
 });

 // or even this one if we want the earlier event
 $("a[href='#Final']").on('shown.bs.tab', function(e) {
			$("#RelationsTable").show();
			$("div#relsToolbar").show();
			$('#QuerySubjectsTable').hide();
			$('#RelationsTable').bootstrapTable("filterBy", {type: 'Final', key_type: ['F', 'C']});
			$('#RelationsTable').bootstrapTable('hideColumn', 'ref');
			$('#RelationsTable').bootstrapTable('showColumn', 'fin');
 });

function buildRelationsTable(){

    var cols = [];
    cols.push({field:"checkbox", checkbox: "true"});
		cols.push({field:"index", title: "index", formatter: "indexFormatter", sortable: false});
		cols.push({field:"_id", title: "_id", sortable: false});
    cols.push({field:"table_name", title: "table_name", sortable: false });
		cols.push({field:"table_alias", title: "table_alias", editable: false, sortable: true});
		cols.push({field:"type", title: "type", sortable: true});
    cols.push({field:"key_name", title: "key_name", sortable: false});
		cols.push({field:"key_type", title: "key_type", sortable: true});
		cols.push({field:"pktable_name", title: "pktable_name", sortable: false});
		cols.push({field:"pktable_alias", title: "pktable_alias", sortable: false, editable: {
			 	type: "text"
			}
		});
		cols.push({field:"relashionship", title: "relashionship", editable: {type: "textarea"}});
		cols.push({field:"fin", title: "fin", formatter: "boolFormatter", align: "center"});
		cols.push({field:"ref", title: "ref", formatter: "boolFormatter", align: "center"});
		cols.push({field:"linker", formatter: "boolFormatter", title: "linker"});
		cols.push({field:"linker_ids", title: "linker_ids"});

    $('#RelationsTable').bootstrapTable("destroy").bootstrapTable({
        columns: cols,
				search: true,
				showRefresh: false,
				showColumns: true,
				showToggle: true,
				pagination: false,
				// uniqueId: "_id",
				// idField: "index",
				toolbar: "#relsToolbar",
				sortOrder: "table_alias",
				showPaginationSwitch: true
    });

		$('#RelationsTable').bootstrapTable('hideColumn', 'ref');

}

function builQuerySubjectsTable(){

    var cols = [];
    cols.push({field:"checkbox", checkbox: "true"});
		cols.push({field:"index", title: "index", formatter: "indexFormatter", sortable: false});
		cols.push({field:"_id", title: "_id", sortable: false});
    cols.push({field:"table_name", title: "table_name", sortable: false });
		cols.push({field:"table_alias", title: "table_alias", editable: false, sortable: false});
		cols.push({field:"type", title: "type", sortable: false});
		cols.push({field:"visible", title: "visible", formatter: "boolFormatter", sortable: false});
    cols.push({field:"filter", title: "filter", editable: {type: "textarea"}, sortable: false});
		cols.push({field:"label", title: "label", editable: {type: "textarea"}});

    $('#QuerySubjectsTable').bootstrapTable("destroy").bootstrapTable({
        columns: cols,
				search: false,
				showRefresh: false,
				showColumns: false,
				showToggle: false,
				pagination: false,
				// toolbar: "#relsToolbar",
				// uniqueId: "_id",
				// idField: "index",
				showPaginationSwitch: false
    });

}


function boolFormatter(value, row, index) {
	var icon = value == true ? 'glyphicon-ok' : ''
	return '<i class="glyphicon ' + icon + '"></i> ';
}

function indexFormatter(value, row, index) {
	row.index = index;
  return index;
}

// !!!!!!!!!!! Don't remove !!!!!!!!!!!
$('#RelationsTable').bootstrapTable({});
// !!!!!!!!!!! Don't remove !!!!!!!!!!!

$('#RelationsTable').on('check.bs.table', function(row, $element){

	console.log("row");
	console.log(row);
	console.log("$element");
	console.log($element);

});

$('#RelationsTable').on('click-row.bs.table', function (e, row, $element) {
	// rowNum = $element.index() + 1;
	// console.log("rowNum=" + rowNum);
});


$('#RelationsTable').on('click-cell.bs.table', function(field, value, row, $element){

	console.log("field: " + field);
	console.log("value: " + value);
	console.log("$element: ");
	console.log($element);

	// var checkglyph = ['<a class="checked" href="javascript:void(0)" title="Checked">','<i class="glyphicon glyphicon-ok"></i>','</a>'].join('');

	if (value == "fin" || value == "ref" ) {

		if ($element.linker == false) {

			if ($element.table_alias == $element.pktable_alias || $element.pktable_alias == '') {
				showalert("Change pktable_alias before proceeding.", "alert-warning");
				return;
			}

			var type = value == "fin" ? "Final" : "Ref";
			// if(value == "fin"){
			// 	type = "Final";
			// }
			// if(value == "ref"){
			// 	type = "Ref";
			// }
			GetKeys($element.pktable_name, $element.pktable_alias, type, $element._id);
			return;
		}

		if ($element.linker == true) {

			RemoveKeys($element);
			$element.linker = false;
			if(value == "fin"){$element.fin = false;}
			if(value == "ref"){$element.ref = false;}
			SyncRelations();
			if(activeTab == 'Final'){
				$('#RelationsTable').bootstrapTable("filterBy", {type: 'Final', key_type: ['F', 'C']});
			}
			if(activeTab == 'Reference'){
				$('#RelationsTable').bootstrapTable("filterBy", {type: ['Final', 'Ref'], key_type: ['F', 'P', 'C']});
			}
			return;
		}

	}

});

function RemoveKeys(o){

        indexes2rm = [];

        var recurse = function(o){
                tableData = $('#RelationsTable').bootstrapTable("getData");
                tableData.forEach(function(e){
                        if(e.linker_ids.indexOf(o._id) > -1){
                                console.log("RemoveImportedKeys _id found: " + e._id);
                                console.log("RemoveImportedKeys linker_ids.length: " + e.linker_ids.length);
                                if(e.linker_ids.length == 1){
                                        indexes2rm.push(e._id);
                                        console.log("RemoveImportedKeys push to indexes2rm: " + e._id);
                                }
                                if(e.linker_ids.length > 1){
                                        e.linker_ids.splice(e.linker_ids.indexOf(o._id), 1);
                                        console.log("RemoveImportedKeys remove from linker_ids: " + e._id);
                                }
                                return recurse(tableData[e.index]);
                        }
                        else {
                                return;
                        }
                });
        };
        recurse(o);

        $('#RelationsTable').bootstrapTable('remove', {
      field: '_id',
      values: indexes2rm
  });
}


function refreshTable($table){
	var data = $table.bootstrapTable("getData");
	$table.bootstrapTable('load', data);
}

function DuplicateRow(){


	selections = $('#RelationsTable').bootstrapTable('getSelections');
	if (selections == "") {
		showalert("DuplicateRow(): no row selected.", "alert-warning");
		return;
	}

	$('#RelationsTable').bootstrapTable("filterBy", {});

	$.each(selections, function(i, o){

		nextIndex = o.index + 1;
		console.log("nextIndex=" + nextIndex);
		var newRow = $.extend({}, o);
		newRow.checkbox = false;
		newRow.pktable_alias = "";
		newRow.fin = false;
		newRow.ref = false;
		newRow.linker = false;
		newRow.linker_ids = [];
		console.log("newRow");
		console.log(newRow);

		$('#RelationsTable').bootstrapTable('insertRow', {index: nextIndex, row: newRow});

	});

	if(activeTab == 'Final'){
		$('#RelationsTable').bootstrapTable("filterBy", {type: 'Final', key_type: ['F', 'C']});
	}
	if(activeTab == 'Reference'){
		$('#RelationsTable').bootstrapTable("filterBy", {type: ['Final', 'Ref'], key_type: ['F', 'P', 'C']});
	}

	$('#RelationsTable').bootstrapTable('uncheckAll');


}

function AddRow(){

	var qs = $('#modQuerySubject').find("option:selected").text().split(" ");

	console.log(qs);

	var relation = {};

	relation.key_name = $('#modKeyName').val();
	relation.table_alias = qs[0];
	relation.table_name = qs[2];
	relation.pktable_alias = $('#modPKTableAlias').val();
	relation.pktable_name = $('#modPKTables').find("option:selected").text()
	relation.relashionship = $('#modRelashionship').val();
	relation.type = qs[1];
	relation.key_type = 'C';
	relation._id = relation.fktable_alias + relation.type + relation.pktable_alias + relation.key_type;

	console.log("relation");
	console.log(relation);

	$('#RelationsTable').bootstrapTable("filterBy", {});

	nextIndex = $('#RelationsTable').bootstrapTable("getData").length;
	console.log("nextIndex=" + nextIndex);
	$('#RelationsTable').bootstrapTable('insertRow', {index: nextIndex, row: relation});

	if(activeTab == 'Final'){
		$('#RelationsTable').bootstrapTable("filterBy", {type: 'Final', key_type: ['F', 'C']});
	}
	if(activeTab == 'Reference'){
		$('#RelationsTable').bootstrapTable("filterBy", {type: ['Final', 'Ref'], key_type: ['F', 'P', 'C']});
	}

	$('#newRowModal').modal('hide');

}

function RemoveRow(){

	var $table = $('#RelationsTable');

	selections = $table.bootstrapTable('getSelections');
	if (selections == "") {
		showalert("RemoveRow(): no row selected.", "alert-warning");
		return;
	}

  var indexes = $.map($table.bootstrapTable('getSelections'), function (row) {
      return row.index;
  });
  $table.bootstrapTable('remove', {
      field: 'index',
      values: indexes
  });

	$('#RelationsTable').bootstrapTable('uncheckAll');

}

function SyncRelations(){

	$('#RelationsTable').bootstrapTable("filterBy", {type: ['Final', 'Ref'], key_type: ['F','P']});
	var data = $('#RelationsTable').bootstrapTable('getData');

	var objs = [];

	$.each(data, function(k, v){
		var obj = JSON.stringify(v);
		objs += obj + "\r\n";
	});

	$.ajax({
		type: 'POST',
		url: "SyncRelations",
		dataType: 'json',
		data: objs,

		success: function(data) {
			$('#RelationsTable').bootstrapTable('load', data);
		},
		error: function(data) {
			showalert("SyncRelations() failed.", "alert-danger");
		}
	});

}

function LoadQuerySubjects() {

   $.ajax({
        type: 'POST',
        url: "GetQuerySubjects",
        dataType: 'json',

        success: function(data) {
					if ( data == "") {
						showalert("LoadQuerySubjects(): no query subject stored on server.", "alert-info");
						return;
					}
					console.log(data);
					$('#QuerySubjectsTable').bootstrapTable('load', data);
        },
        error: function(data) {
            console.log(data);
            showalert("LoadQuerySubjects() failed.", "alert-danger");
        }

    });

}

function Reset() {

	var success = "OK";

	$.ajax({
        type: 'POST',
        url: "Reset",
        dataType: 'json',

        success: function(data) {
			success = "OK";
        },
        error: function(data) {
            console.log(data);
   			success = "KO";
        }

    });

	if (success == "KO") {
		showalert("Reset() failed.", "alert-danger");
	}

	location.reload(true);

}

function ClearSelections() {

	$('#RelationsTable').bootstrapTable("removeAll");

}

function GetKeys(table_name, table_alias, type, linker_id) {

	var table_name, table_alias, type, linker_id;

	if (table_name == 'Choose a table...') {
		showalert("GetKeys(): no table selected.", "alert-warning");
		return;
	}

	if (table_name == undefined){
		table_name = $('#tables').find("option:selected").text();
	}

	if(table_alias == undefined){
		table_alias = $('#alias').val();
	}

	if(type == undefined){
		type = 'Final';
	}

	var parms = "table=" + table_name + "&alias=" + table_alias + "&type=" + type + "&linker_id=" + linker_id;

	console.log("calling GetKeys with: " + parms);

  $.ajax({
    type: 'POST',
    url: "GetKeys",
    dataType: 'json',
    data: parms,

    success: function(data) {
			console.log(data);
			if (data == "") {
				showalert("GetAllKeys(): " + table_name + " has no key.", "alert-info");
				return;
			}

			$('#RelationsTable').bootstrapTable('load', data);

  	},
      error: function(data) {
          console.log(data);
          showalert("GetAllKeys() failed.", "alert-danger");
    }

  });

	if(activeTab == 'Final'){
		$('#RelationsTable').bootstrapTable("filterBy", {type: 'Final', key_type: 'F'});
	}
	if(activeTab == 'Reference'){
		$('#RelationsTable').bootstrapTable("filterBy", {type: ['Final', 'Ref'], key_type: ['F', 'P']});
	}

}

function TestDBConnection() {

    $.ajax({
        type: 'POST',
        url: "TestDBConnection",
        dataType: 'json',

        success: function(data) {
            console.log(data);
            showalert("TestDBConnection() was successfull.", "alert-success");
        },
        error: function(data) {
            console.log(data);
            showalert("TestDBConnection() failed.", "alert-danger");
        }

    });

}

function ChooseQuerySubject(table) {

	table.empty();

    $.ajax({
        type: 'POST',
        url: "GetQuerySubjects",
        dataType: 'json',

        success: function(data) {
            console.log(data);
            $.each(data, function(i, obj){
							//console.log(obj.name);
							table.append('<option class="fontsize">' + obj.table_alias + ' ' + obj.type + ' ' + obj.table_name + '</option>');
			            });
			            table.selectpicker('refresh');
			        },
        error: function(data) {
            console.log(data);
            showalert("ChooseTable() failed.", "alert-danger");
        }
		});

}

function ChooseTable(table) {

	table.empty();

    $.ajax({
        type: 'POST',
        url: "GetTables",
        dataType: 'json',

        success: function(data) {
            console.log(data);
            $.each(data, function(i, obj){
							//console.log(obj.name);
							table.append('<option class="fontsize">' + obj.name + '</option>');
			            });
			            table.selectpicker('refresh');
			        },
        error: function(data) {
            console.log(data);
            showalert("ChooseTable() failed.", "alert-danger");
        }
		});

}

function GetTableData(){
		var data = $('#RelationsTable').bootstrapTable("getData");
		console.log("data=");
		console.log(data);

}
