
var relation = {
	_id: "",
	// _ref: null,
	fktable_name: "",
	fktable_alias: "",
	type: "",
	key_name: "",
	key_type: "",
	pktable_name: "",
	pktable_alias: "",
	relashionship: "",
	fin: false,
	ref: false,
	father: false,
	// seqs: [],
	// checkbox: false,
	father_ids: []

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
	buildRelsTable();
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
			$("#relsTable").hide();
			$("div#relsToolbar").hide();
			LoadQuerySubjects();
			$('#QuerySubjectsTable').show();

});

$("a[href='#Fields']").on('shown.bs.tab', function(e) {
			 $("#relsTable").hide();
 			$("div#relsToolbar").hide();
			$('#QuerySubjectsTable').hide();

});

$("a[href='#Reference']").on('shown.bs.tab', function(e) {
			$("#relsTable").show();
			$("div#relsToolbar").show();
			$('#QuerySubjectsTable').hide();
			$('#relsTable').bootstrapTable("filterBy", {type: ['Final', 'Ref'], key_type: ['F','P', 'C']});
			$('#relsTable').bootstrapTable('hideColumn', 'fin');
			$('#relsTable').bootstrapTable('showColumn', 'ref');
 });

 // or even this one if we want the earlier event
 $("a[href='#Final']").on('shown.bs.tab', function(e) {
			$("#relsTable").show();
			$("div#relsToolbar").show();
			$('#QuerySubjectsTable').hide();
			$('#relsTable').bootstrapTable("filterBy", {type: 'Final', key_type: ['F', 'C']});
			$('#relsTable').bootstrapTable('hideColumn', 'ref');
			$('#relsTable').bootstrapTable('showColumn', 'fin');
 });

function buildRelsTable(){

    var cols = [];
    cols.push({field:"checkbox", checkbox: "true"});
		cols.push({field:"index", title: "index", formatter: "indexFormatter", sortable: false});
		cols.push({field:"_id", title: "_id", sortable: false});
    cols.push({field:"fktable_name", title: "fktable_name", sortable: false });
		cols.push({field:"fktable_alias", title: "fktable_alias", editable: false, sortable: false});
		cols.push({field:"type", title: "type", sortable: false});
    cols.push({field:"key_name", title: "key_name", sortable: false});
		cols.push({field:"key_type", title: "key_type"});
		cols.push({field:"pktable_name", title: "pktable_name", sortable: false});
		cols.push({field:"pktable_alias", title: "pktable_alias", sortable: false, editable: {
			 	type: "text"
			}
		});
		cols.push({field:"relashionship", title: "relashionship", editable: {type: "textarea"}});
		cols.push({field:"fin", title: "fin", formatter: "boolFormatter", align: "center"});
		cols.push({field:"ref", title: "ref", formatter: "boolFormatter", align: "center"});
		cols.push({field:"father", formatter: "boolFormatter", title: "father"});
		cols.push({field:"father_ids", title: "father_ids"});

    $('#relsTable').bootstrapTable("destroy").bootstrapTable({
        columns: cols,
				search: false,
				showRefresh: false,
				showColumns: false,
				showToggle: false,
				pagination: false,
				// uniqueId: "_id",
				// idField: "index",
				toolbar: "#relsToolbar",
				showPaginationSwitch: false
    });

		$('#relsTable').bootstrapTable('hideColumn', 'ref');
		$('#relsTable').bootstrapTable('hideColumn', 'father');
		$('#relsTable').bootstrapTable('hideColumn', 'father_ids');

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
$('#relsTable').bootstrapTable({});
// !!!!!!!!!!! Don't remove !!!!!!!!!!!

$('#relsTable').on('check.bs.table', function(row, $element){

	console.log("row");
	console.log(row);
	console.log("$element");
	console.log($element);

});

$('#relsTable').on('click-row.bs.table', function (e, row, $element) {
	// rowNum = $element.index() + 1;
	// console.log("rowNum=" + rowNum);
});


$('#relsTable').on('click-cell.bs.table', function(field, value, row, $element){

	console.log("field: " + field);
	console.log("value: " + value);

	// var checkglyph = ['<a class="checked" href="javascript:void(0)" title="Checked">','<i class="glyphicon glyphicon-ok"></i>','</a>'].join('');

	if (value == "fin" || value == "ref" ) {

		if ($element.father == false) {

			if ($element.fktable_alias == $element.pktable_alias || $element.pktable_alias == '') {
				showalert("Change pktable_alias before proceeding.", "alert-warning");
				return;
			}

			$element.father = true;
			if(value == "fin"){
				$element.fin = true;
			}
			if(value == "ref"){
				$element.ref = true;
			}
			GetAllKeys($element);
			return;
		}

		if ($element.father == true) {

			RemoveImportedKeys($element);
			$element.father = false;
			if(value == "fin"){$element.fin = false;}
			if(value == "ref"){$element.ref = false;}
			SyncRelations();
			if(activeTab == 'Final'){
				$('#relsTable').bootstrapTable("filterBy", {type: 'Final', key_type: 'F'});
			}
			if(activeTab == 'Reference'){
				$('#relsTable').bootstrapTable("filterBy", {type: ['Final', 'Ref'], key_type: ['F', 'P']});
			}
			return;
		}

	}

});

function RemoveImportedKeys(o){

        indexes2rm = [];

        var recurse = function(o){
                tableData = $('#relsTable').bootstrapTable("getData");
                tableData.forEach(function(e){
                        if(e.father_ids.indexOf(o._id) > -1){
                                console.log("RemoveImportedKeys _id found: " + e._id);
                                console.log("RemoveImportedKeys father_ids.length: " + e.father_ids.length);
                                if(e.father_ids.length == 1){
                                        indexes2rm.push(e._id);
                                        console.log("RemoveImportedKeys push to indexes2rm: " + e._id);
                                }
                                if(e.father_ids.length > 1){
                                        e.father_ids.splice(e.father_ids.indexOf(o._id), 1);
                                        console.log("RemoveImportedKeys remove from father_ids: " + e._id);
                                }
                                return recurse(tableData[e.index]);
                        }
                        else {
                                return;
                        }
                });
        };
        recurse(o);

        $('#relsTable').bootstrapTable('remove', {
      field: '_id',
      values: indexes2rm
  });
}


function RemoveImportedKeysByIndex(o){

	indexes2rm = [];

	var recurse = function(o){
		tableData = $('#relsTable').bootstrapTable("getData");
		tableData.forEach(function(e){
			if(e.fatherIndexes.indexOf(o.index) > -1){
				console.log("RemoveImportedKeys index found: " + e.index);
				console.log("RemoveImportedKeys fatherIndexes.length: " + e.fatherIndexes.length);
				if(e.fatherIndexes.length == 1){
					indexes2rm.push(e.index);
					console.log("RemoveImportedKeys push to indexes2rm: " + e.index);
				}
				if(e.fatherIndexes.length > 1){
					e.fatherIndexes.splice(e.fatherIndexes.indexOf(o.index), 1);
					console.log("RemoveImportedKeys remove from fatherIndexes: " + e.index);
				}
				return recurse(tableData[e.index]);
			}
			else {
				return;
			}
		});
	};
	recurse(o);

	$('#relsTable').bootstrapTable('remove', {
      field: 'index',
      values: indexes2rm
  });
}


function refreshTable($table){
	var data = $table.bootstrapTable("getData");
	$table.bootstrapTable('load', data);
}

function DuplicateRow(){


	selections = $('#relsTable').bootstrapTable('getSelections');
	if (selections == "") {
		showalert("DuplicateRow(): no row selected.", "alert-warning");
		return;
	}

	$('#relsTable').bootstrapTable("filterBy", {});

	$.each(selections, function(i, o){

		nextIndex = o.index + 1;
		console.log("nextIndex=" + nextIndex);
		var newRow = $.extend({}, o);
		newRow.checkbox = false;
		newRow.pktable_alias = "";
		newRow.fin = false;
		newRow.ref = false;
		newRow.father = false;
		newRow.father_ids = [];
		console.log("newRow");
		console.log(newRow);

		$('#relsTable').bootstrapTable('insertRow', {index: nextIndex, row: newRow});

	});

	if(activeTab == 'Final'){
		$('#relsTable').bootstrapTable("filterBy", {type: 'Final', key_type: ['F', 'C']});
	}
	if(activeTab == 'Reference'){
		$('#relsTable').bootstrapTable("filterBy", {type: ['Final', 'Ref'], key_type: ['F', 'P', 'C']});
	}

	$('#relsTable').bootstrapTable('uncheckAll');


}

function AddRow(){

	var qs = $('#modQuerySubject').find("option:selected").text().split(" ");

	console.log(qs);

	var relation = {};

	relation.key_name = $('#modKeyName').val();
	relation.fktable_alias = qs[1];
	relation.fktable_name = qs[0];
	relation.pktable_alias = $('#modPKTableAlias').val();
	relation.pktable_name = $('#modPKTables').find("option:selected").text()
	relation.relashionship = $('#modRelashionship').val();
	relation.type = qs[2];
	relation.key_type = 'C';
	relation._id = relation.fktable_alias + relation.type + relation.pktable_alias + relation.key_type;

	console.log("relation");
	console.log(relation);

	$('#relsTable').bootstrapTable("filterBy", {});

	nextIndex = $('#relsTable').bootstrapTable("getData").length;
	console.log("nextIndex=" + nextIndex);
	$('#relsTable').bootstrapTable('insertRow', {index: nextIndex, row: relation});

	if(activeTab == 'Final'){
		$('#relsTable').bootstrapTable("filterBy", {type: 'Final', key_type: ['F', 'C']});
	}
	if(activeTab == 'Reference'){
		$('#relsTable').bootstrapTable("filterBy", {type: ['Final', 'Ref'], key_type: ['F', 'P', 'C']});
	}

	$('#newRowModal').modal('hide');

}

function RemoveRow(){

	var $table = $('#relsTable');

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

	$('#relsTable').bootstrapTable('uncheckAll');

}

function SyncRelations(){

	$('#relsTable').bootstrapTable("filterBy", {type: ['Final', 'Ref'], key_type: ['F','P']});
	var data = $('#relsTable').bootstrapTable('getData');

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
			$('#relsTable').bootstrapTable('load', data);
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

	$('#relsTable').bootstrapTable("removeAll");

}

function GetAllKeys(relation) {

	$table_name = $('#tables').find("option:selected").text();
	if ($table_name == undefined || $table_name == 'Choose a table...') {
		showalert("GetAllKeys(): no table selected.", "alert-warning");
		return;
	}

	if(relation == undefined){
		var relation = {};
		relation.pktable_name = $('#tables').find("option:selected").text();
		relation.pktable_alias = $('#alias').val();
		relation.type = "Final";
		relation.father = true;
		relation.fin = true;
	}

	console.log(relation);

  $.ajax({
    type: 'POST',
    url: "GetAllKeys",
    dataType: 'json',
    data: JSON.stringify(relation),

    success: function(data) {
			console.log(data);
			if (data == "") {
				showalert("GetAllKeys(): " + table_name + " has no key.", "alert-info");
				return;
			}

			$('#relsTable').bootstrapTable('load', data);

  	},
      error: function(data) {
          console.log(data);
          showalert("GetAllKeys() failed.", "alert-danger");
    }

  });

	if(activeTab == 'Final'){
		$('#relsTable').bootstrapTable("filterBy", {type: 'Final', key_type: 'F'});
	}
	if(activeTab == 'Reference'){
		$('#relsTable').bootstrapTable("filterBy", {type: ['Final', 'Ref'], key_type: ['F', 'P']});
	}

}

function GetImportedKeys(father) {

	var table_name = "";

	if(father == undefined){
		table_name = $('#tables').find("option:selected").text();
	}
	else {
		table_name = father.pktable_name;
	}

	console.log("table_name=" + table_name);

	if (table_name == undefined || table_name == 'Choose a table...') {
		showalert("GetImportedKeys(): no table selected.", "alert-warning");
		return;
	}

  $.ajax({
    type: 'POST',
    url: "GetImportedKeys",
    dataType: 'json',
    data: "table=" + table_name,

    success: function(data) {

			if (data == "") {
				showalert("GetImportedKeys(): " + table_name + " has no importedKey.", "alert-info");
				return;
			}

			$.each(data, function(i, o){

				if(father != undefined){
					o.fktable_alias = father.pktable_alias;
				}
				else {
					o.fktable_alias = $('#alias').val();
				}

				nextIndex = alreadyExists(o);
				// console.log("nextIndex="+nextIndex);

				if (nextIndex > -1){
					o = $('#relsTable').bootstrapTable("getData")[nextIndex];
					if(father != undefined) {
						o.fatherIndexes.push(father.index);
						//Remove duplicate entry
						o.fatherIndexes = Array.from(new Set(o.fatherIndexes));
						//or
						// o.fatherIndexes = [...new Set(o.fatherIndexes)];
					}
					$('#relsTable').bootstrapTable('updateRow', {index: nextIndex, row: o});
					return;
				}

				if(father != undefined) {
					o.fatherIndexes.push(father.index);
					o.fatherIndexes = Array.from(new Set(o.fatherIndexes));
				}
				nextIndex = $('#relsTable').bootstrapTable("getData").length;
				console.log("nextIndex=" + nextIndex);

				$('#relsTable').bootstrapTable('insertRow', {index: nextIndex, row: o});

			});

  	},
      error: function(data) {
          console.log(data);
          showalert("GetImportedKeys() failed.", "alert-danger");
    }

  });

}

function alreadyExists(o) {

	tableData = $('#relsTable').bootstrapTable("getData");
	res = -1;

	tableData.forEach(function(entry) {
			oUID = o.fktable_alias+o.pktable_alias+o.type+o.key_type;
			entryUID = entry.fktable_alias+entry.pktable_alias+entry.type+entry.key_type;
			if ( oUID == entryUID) {
				console.log(entryUID + " already exists");
				// console.log("entry.index="+entry.index);
				res = entry.index;
				return;
			}
	});

	return res;
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
							table.append('<option class="fontsize">' + obj.table_name + ' ' + obj.table_alias + ' ' + obj.type + '</option>');
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
		var data = $('#relsTable').bootstrapTable("getData");
		console.log("data=");
		console.log(data);

}
