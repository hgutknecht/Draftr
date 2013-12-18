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

  var clock;

  var clock;
  clock = $('.clock').FlipClock(180, {
    clockFace: 'MinuteCounter',
    countdown: true,
    autoStart: false,
  });

});



var sock = new SockJS('/echo')

sock.onopen = function() {
  console.log('open');
};

sock.onmessage = function(e) {
  console.log('message', e);
  var msg = JSON.parse(e.data)
};

sock.onclose = function() {
  console.log('close');
};

function send(msg) {
  sock.send(JSON.stringify(msg))
}
