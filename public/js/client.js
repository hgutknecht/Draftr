$(function() {
  $( "#sortable1, #sortable2, #sortable3" ).sortable({
    connectWith: ".connectedSortable"
  }).disableSelection();
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