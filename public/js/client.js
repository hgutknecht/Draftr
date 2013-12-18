$(function() {
  $( "#sortable1, #sortable2, #sortable3" ).sortable({
    connectWith: ".connectedSortable",
    start: function(e,ui){
      ui.placeholder.height(ui.item.height());
    }
  }).disableSelection();

  $("#sortable1").on("sortreceive", function(event, ui) {
    var $list = $(this);
    if ($list.children().length > 1) {
      $(ui.sender).sortable('cancel');
    }
  });

});
