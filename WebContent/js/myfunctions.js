
var datas = [];
var $tableList = $('#tables');
var $datasTable = $('#DatasTable');
var $navTab = $('#navTab');
var $refTab = $("a[href='#Reference']");
var $finTab = $("a[href='#Final']");
var $qsTab = $("a[href='#QuerySubject']");
var activeTab = "Final";
var $activeSubDatasTable = "";
var $newRowModal = $('#newRowModal');

// var url = "js/PROJECT.json";

var qsCols = [];
qsCols.push({field:"checkbox", checkbox: "true"});
qsCols.push({field:"index", title: "index", formatter: "indexFormatter", sortable: false});
qsCols.push({field:"_id", title: "_id", sortable: true});
qsCols.push({field:"table_name", title: "table_name", sortable: true});
qsCols.push({field:"table_alias", title: "table_alias", editable: false, sortable: true});
qsCols.push({field:"type", title: "type", sortable: true});
qsCols.push({field:"visible", title: "visible", formatter: "boolFormatter", align: "center", sortable: false});
qsCols.push({field:"filter", title: "filter", editable: {type: "textarea"}, sortable: true});
qsCols.push({field:"label", title: "label", editable: {type: "textarea"}, sortable: true});
qsCols.push({field:"operate", title: "operate", formatter: "operateQSFormatter", align: "center", events: "operateQSEvents"});

var relationCols = [];
relationCols.push({field:"checkbox", checkbox: "true"});
relationCols.push({field:"index", title: "index", formatter: "indexFormatter", sortable: false});
relationCols.push({field:"_id", title: "_id", sortable: true});
relationCols.push({field:"key_name", title: "key_name", sortable: true});
relationCols.push({field:"key_type", title: "key_type", sortable: true});
relationCols.push({field:"pktable_name", title: "pktable_name", sortable: true});
relationCols.push({field:"pktable_alias", title: "pktable_alias", sortable: true, editable: {type: "text"}});
relationCols.push({field:"relationship", title: "relationship", editable: {type: "textarea", rows: 4}});
relationCols.push({field:"fin", title: "fin", formatter: "boolFormatter", align: "center"});
relationCols.push({field:"ref", title: "ref", formatter: "boolFormatter", align: "center"});
relationCols.push({field:"operate", title: "operate", formatter: "operateRelationFormatter", align: "center", events: "operateRelationEvents"});

// relationCols.push({field:"linker", formatter: "boolFormatter", align: "center", title: "linker"});
// relationCols.push({field:"linker_ids", title: "linker_ids"});

var fieldCols = [];
fieldCols.push({field:"index", title: "index", formatter: "indexFormatter", sortable: false});
fieldCols.push({field:"field_name", title: "field_name", sortable: true });
fieldCols.push({field:"label", title: "label", editable: {type: "text"}, sortable: true});
fieldCols.push({field:"traduction", title: "traduction", formatter: "boolFormatter", align: "center", sortable: false});
fieldCols.push({field:"visible", title: "visible", formatter: "boolFormatter", align: "center", sortable: false});
fieldCols.push({field:"field_type", title: "field_type", editable: false, sortable: true});
fieldCols.push({field:"timezone", title: "timezone", formatter: "boolFormatter", align: "center", sortable: false});

$(document)
.ready(function() {
  $('#DatasToolbar').hide();
  ChooseTable($tableList);
  buildTable($datasTable, qsCols, datas, true);
})
.ajaxStart(function(){
    $("div#divLoading").addClass('show');
		$("div#modDivLoading").addClass('show');
})
.ajaxStop(function(){
    $("div#divLoading").removeClass('show');
		$("div#modDivLoading").removeClass('show');
});

$tableList.change(function () {
    var selectedText = $(this).find("option:selected").text();
		$('#alias').val(selectedText);
});

$navTab.on('shown.bs.tab', function(event){
    activeTab = $(event.target).text();         // active tab
		console.log("activeTab=" + activeTab);
    previousTab = $(event.relatedTarget).text();  // previous tab
		console.log("previousTab=" + previousTab);
});

$qsTab.on('shown.bs.tab', function(e) {
  buildTable($datasTable, qsCols, datas, true, fieldCols, "fields");
  $datasTable.bootstrapTable('showColumn', 'visible');
  $datasTable.bootstrapTable('showColumn', 'filter');
  $datasTable.bootstrapTable('showColumn', 'label');
  $datasTable.bootstrapTable('hideColumn', 'operate');
});

$finTab.on('shown.bs.tab', function(e) {
  buildTable($datasTable, qsCols, datas, true, relationCols, "relations");
  // $datasTable.bootstrapTable("filterBy", {type: ['Final'], key_type: ['F', 'C']});
  // $datasTable.bootstrapTable('hideColumn', 'fin');
  // $datasTable.bootstrapTable('showColumn', 'ref');
  $datasTable.bootstrapTable('showColumn', 'operate');
  $datasTable.bootstrapTable('hideColumn', 'visible');
  $datasTable.bootstrapTable('hideColumn', 'filter');
  $datasTable.bootstrapTable('hideColumn', 'label');

});

$refTab.on('shown.bs.tab', function(e) {
  buildTable($datasTable, qsCols, datas, true, relationCols, "relations");
  // $datasTable.bootstrapTable("filterBy", {type: ['Final', 'Ref'], key_type: ['F','P', 'C']});
  // $datasTable.bootstrapTable('hideColumn', 'fin');
  // $datasTable.bootstrapTable('showColumn', 'ref');
  $datasTable.bootstrapTable('showColumn', 'operate');
  $datasTable.bootstrapTable('hideColumn', 'visible');
  $datasTable.bootstrapTable('hideColumn', 'filter');
  $datasTable.bootstrapTable('hideColumn', 'label');
});

$datasTable.on('editable-save.bs.table', function (editable, field, row, oldValue, $el) {
  if(field == "pktable_alias"){
    var newValue = row.pktable_alias;
    updateCell($activeSubDatasTable, row.index, 'relationship', row.relationship.split("[" + oldValue + "]").join("[" + newValue + "]"));
  }
});

$datasTable.on('reset-view.bs.table', function(){
  console.log("++++++++++++++on passe dans reset-view");
  if($activeSubDatasTable != ""){
    var v = $activeSubDatasTable.bootstrapTable('getData');
    console.log("+++++++++++ $activeSubDatasTable");
    console.log(v);
    var $tableRows = $activeSubDatasTable.find('tbody tr');
    console.log("++++++++++ $tableRows");
    console.log($tableRows);
    $.each(v, function(i, row){
      // console.log("row.ref");
      // console.log(row.ref);
      console.log("row.fin");
      console.log(row.fin);
      if(row.fin == true || row.ref == true){
        $tableRows.eq(i).find('a').eq(0).editable('disable');
        // $tableRows.eq(i).find('a').editable('disable');
      }
    });
  }
});

$datasTable.on('expand-row.bs.table', function (index, row, $detail) {
  console.log("index: ");
  console.log(index);
  console.log("row: ");
  console.log(row);
  console.log("$detail: ");
  console.log($detail);

});

$newRowModal.on('show.bs.modal', function (e) {
  // do something...
	ChooseQuerySubject($('#modQuerySubject'));
	ChooseTable($('#modPKTables'));

})

$('#modPKTables').change(function () {
    selectedText = $(this).find("option:selected").text();
		$('#modPKTableAlias').val(selectedText);
});

window.operateRelationEvents = {
    'click .duplicate': function (e, value, row, index) {
        // alert('You click duplicate action, row: ' + JSON.stringify(row));
        $activeSubDatasTable.bootstrapTable("filterBy", {});
        nextIndex = row.index + 1;
        console.log("nextIndex=" + nextIndex);
        var newRow = $.extend({}, row);
        newRow.checkbox = false;
        newRow.pktable_alias = "";
        newRow.fin = false;
        newRow.ref = false;
        newRow.relationship = newRow.relationship.replace(/ = \[FINAL\]\./g, " = ");
        newRow.relationship = newRow.relationship.replace(/ = \[REF\]\./g, " = ");
        console.log("newRow");
        console.log(newRow);
        $activeSubDatasTable.bootstrapTable('insertRow', {index: nextIndex, row: newRow});

    },
    'click .remove': function (e, value, row, index) {
        $activeSubDatasTable.bootstrapTable('remove', {
            field: 'index',
            values: [row.index]
        });
    }
};

window.operateQSEvents = {
    'click .addRelation': function (e, value, row, index) {

      console.log("++++++++++++++on passe dans window.operateQSEvents.add");
      if($activeSubDatasTable != ""){

        var v = $activeSubDatasTable.bootstrapTable('getData');
        console.log("+++++++++++ $activeSubDatasTable");
        console.log(v);
      }
      $newRowModal.modal('toggle');
      var qs = row._id + ' - ' + row.table_name;
      $('#modQuerySubject').selectpicker('val', qs);


    }
};

function operateRelationFormatter(value, row, index) {
    return [
        '<a class="duplicate" href="javascript:void(0)" title="Duplicate">',
        '<i class="glyphicon glyphicon-duplicate"></i>',
        '</a>  ',
        '<a class="remove" href="javascript:void(0)" title="Remove">',
        '<i class="glyphicon glyphicon-trash"></i>',
        '</a>'
    ].join('');
}

function operateQSFormatter(value, row, index) {
    return [
        '<a class="addRelation" href="javascript:void(0)" title="Add Relation">',
        '<i class="glyphicon glyphicon-plus-sign"></i>',
        '</a>  '
    ].join('');
}

function boolFormatter(value, row, index) {
  var icon = value == true ? 'glyphicon-check' : 'glyphicon-unchecked'
  return '<i class="glyphicon ' + icon + '"></i> ';
}

function indexFormatter(value, row, index) {
  row.index = index;
  return index;
}

function expandTable($detail, cols, data) {
    $subtable = $detail.html('<table></table>').find('table');
    console.log("expandTable.data=");
    console.log(data);
    $activeSubDatasTable = $subtable;
    buildSubTable($subtable, cols, data);
}

function buildSubTable($el, cols, data, detailView){

  console.log("activeTab=" + activeTab);

  $el.bootstrapTable("filterBy", {});

  $el.bootstrapTable({
      columns: cols,
      // url: url,
      data: data,
      showToggle: false,
      search: false,
      checkboxHeader: false,
      idField: "index",
      onClickCell: function (field, value, row, $element){

        if(field.match("traduction|visible|timezone|fin|ref")){
          var newValue = value == false ? true : false;

          console.log($(this).bootstrapTable("getData"));

          console.log("row.index=" + row.index);
          console.log("field=" + field);
          console.log("newValue=" + newValue);

          if(field == "fin" && newValue == true){
            row.relationship = row.relationship.replace(/ = /g, " = [FINAL].")
          }
          if(field == "fin" && newValue == false){
            row.relationship = row.relationship.replace(/ = \[FINAL\]\./g, " = ")
          }
          if(field == "ref" && newValue == true){
            row.relationship = row.relationship.replace(/ = /g, " = [REF].")
          }
          if(field == "ref" && newValue == false){
            row.relationship = row.relationship.replace(/ = \[REF\]\./g, " = ")
          }

          updateCell($el, row.index, field, newValue);

          if(field == "fin" && newValue == true){
            GetQuerySubjects(row.pktable_name, row.pktable_alias, "Final");
          }

          if(field == "ref" && newValue == true){
            GetQuerySubjects(row.pktable_name, row.pktable_alias, "Ref");
          }

        }
      }
  });

  if(activeTab == "Reference"){
    // $el.bootstrapTable("filterBy", {key_type: ['F','P', 'C']});
    $el.bootstrapTable('hideColumn', 'fin');
    $el.bootstrapTable('showColumn', 'ref');
  }

  if(activeTab == "Final"){
    // $el.bootstrapTable("filterBy", {key_type: ['F', 'C']});
    $el.bootstrapTable('hideColumn', 'ref');
    $el.bootstrapTable('showColumn', 'fin');
  }

}

function buildTable($el, cols, data) {

    $el.bootstrapTable({
        columns: cols,
        // url: url,
        // data: data,
        search: false,
				showRefresh: false,
				showColumns: false,
				showToggle: false,
				pagination: false,
				showPaginationSwitch: false,
        idField: "index",
				// toolbar: "#DatasToolbar",
        detailView: true,
        onClickCell: function (field, value, row, $element){
          if(field == "visible"){
            var newValue = value == false ? true : false;

            console.log($(this).bootstrapTable("getData"));

            console.log("row.index=" + row.index);
            console.log("field=" + field);
            console.log("newValue=" + newValue);

            updateCell($el, row.index, field, newValue);

          }
        },
        onExpandRow: function (index, row, $detail) {
          if(activeTab == "Final" || activeTab == "Reference"){
            expandTable($detail, relationCols, row.relations);
          }
          else{
            expandTable($detail, fieldCols, row.fields);
          }
        }
    });

    $el.bootstrapTable("filterBy", {});
    $el.bootstrapTable('hideColumn', 'visible');
    $el.bootstrapTable('hideColumn', 'filter');
    $el.bootstrapTable('hideColumn', 'label');

    if(activeTab == "Reference"){
      // $el.bootstrapTable("filterBy", {type: ['Final', 'Ref']});
    }

    if(activeTab == "Final"){
      // $el.bootstrapTable("filterBy", {type: ['Final']});
    }

    if(activeTab == "Query Subject"){
    }
}

function updateCell($table, index, field, newValue){

  $table.bootstrapTable("updateCell", {
    index: index,
    field: field,
    value: newValue
  });

}

function updateRow($table, index, row){

  $table.bootstrapTable("updateRow", {
    index: index,
    row: row
  });

}

function AddRow(){

	var qs = $('#modQuerySubject').find("option:selected").text().split(" ");

	console.log("qs=" + qs);

	var relation = {};

	relation.key_name = $('#modKeyName').val();
	relation.table_alias = qs[0];
	relation.table_name = qs[2];
	relation.pktable_alias = $('#modPKTableAlias').val();
	relation.pktable_name = $('#modPKTables').find("option:selected").text()
	relation.relashionship = $('#modRelashionship').val();
	relation.type = qs[1];
	relation.key_type = 'C';
	relation._id = qs[0] + qs[1] + relation.table_alias + relation.key_type;

	console.log("relation");
	console.log(relation);
}

function GetQuerySubjects(table_name, table_alias, type, pk) {

	var table_name, table_alias, type, linker_id;

	if (table_name == undefined){
		table_name = $tableList.find("option:selected").text();
	}

  if (table_name == 'Choose a table...') {
		showalert("GetQuerySubjects(): no table selected.", "alert-warning");
		return;
	}

	if(table_alias == undefined){
		table_alias = $('#alias').val();
	}

	if(type == undefined){
		type = 'Final';
	}

  if(pk == undefined){
		pk = false;
	}

	var parms = "table=" + table_name + "&alias=" + table_alias + "&type=" + type + "&pk=" + pk;

	console.log("calling GetKeys with: " + parms);

  $.ajax({
    type: 'POST',
    url: "GetQuerySubjects",
    dataType: 'json',
    data: parms,

    success: function(data) {
			console.log(data);
			if (data == "") {
				showalert("GetQuerySubjects(): " + table_name + " has no key.", "alert-info");
				return;
			}

			$datasTable.bootstrapTable('append', data);
      datas = $datasTable.bootstrapTable("getData");


  	},
      error: function(data) {
          console.log(data);
          showalert("GetQuerySubjects() failed.", "alert-danger");
    }

  });

  if(activeTab == 'Final'){
    // $('#DatasTable').bootstrapTable("filterBy", {type: 'Final', key_type: 'F'});
  }
  if(activeTab == 'Reference'){
    // $('#DatasTable').bootstrapTable("filterBy", {type: ['Final', 'Ref'], key_type: ['F', 'P']});
  }

}

function ChooseQuerySubject(table) {

	table.empty();

  var data = $datasTable.bootstrapTable("getData");

  $.each(data, function(i, obj){
		//console.log(obj.name);
		table.append('<option class="fontsize">' + obj._id + ' - ' + obj.table_name +'</option>');
  });
  table.selectpicker('refresh');

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

function showalert(message, alerttype) {

    $('#alert_placeholder').append('<div id="alertdiv" class="alert ' +
		alerttype + ' input-sm"><span>' + message + '</span></div>')

    setTimeout(function() {

      $("#alertdiv").remove();

    }, 2500);
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

// function refreshTable($table){
// 	var data = $table.bootstrapTable("getData");
// 	$table.bootstrapTable('load', data);
// }
