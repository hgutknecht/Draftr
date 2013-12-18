$(function() {
  $( "#sortable1, #sortable2, #sortable3" ).sortable({
    connectWith: ".connectedSortable",
    start: function(e,ui){
      ui.placeholder.height(ui.item.height());
    }

  , update: function (event, ui) {
      var msg = {
        type: 'sort'
      , sortable1: $('#sortable1').html()
      , sortable2: $('#sortable2').html()
      , sortable3: $('#sortable3').html()
      }
      send(msg)
    }
  }).disableSelection();

  $("#sortable1").on("sortreceive", function(event, ui) {
    var $list = $(this);
    if ($list.children().length > 1) {
      $(ui.sender).sortable('cancel');
    }
  });

  var clock;

  clock = $('.clock').FlipClock(180, {
    clockFace: 'MinuteCounter',
    countdown: true,
    autoStart: false,
  });


  // var $modal = $('#pickModal')
  // $modal.modal({
    
  // })

});


function getSorted(data) {
  $('#sortable1').html(data.sortable1)
  $('#sortable2').html(data.sortable2)
  $('#sortable3').html(data.sortable3)
}



var sock = new SockJS('/echo')

sock.onopen = function() {
  console.log('open');
};

sock.onmessage = function(e) {
  console.log('message', e);
  var msg = JSON.parse(e.data)

  if (msg.type === 'sort') return getSorted(msg)
};

sock.onclose = function() {
  console.log('close');
};

function send(msg) {
  sock.send(JSON.stringify(msg))
}
