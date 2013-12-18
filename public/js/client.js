$(function() {

  var clockRunning = false;

  // Update 3 lists, broadcast on change to clients
  $('#sortable1, #sortable2, #sortable3').sortable({
    connectWith: '.connectedSortable',
    start: function(e,ui){
      ui.placeholder.height(ui.item.height());
    }
  , update: function (event, ui) {
      sendHTML();
    }
  }).disableSelection();

  // Define stage clock
  clock = $('.clock').FlipClock(180, {
    clockFace: 'MinuteCounter',
    countdown: true,
    autoStart: false
  });

  // Start the clock timer when someone goes on stage, send clock start to clients
  $('#sortable1').on('sortreceive', function(event, ui) {
    clock.start();
    clockRunning = true;
    send({
      type: 'clock'
    , running: clockRunning
    , time: clock.getTime().time
    });
    var $list = $(this);
    if ($list.children().length > 1) {
      console.log('this happened');
      $(ui.sender).sortable('cancel');
      $('.clock-status').html('');
    }
  });

  // Grab commentary input, send to clients.
  $('.commmentary-input').bind('enterKey',function(e){
    var editorInput = $(this).val();
    var commentaryMessage = {
        type: 'commentary'
      , data: editorInput
    };
    send(commentaryMessage);
    $(this).val('');
  });
  $('.commmentary-input').keyup(function(e){
    if (e.keyCode == 13) {
      $(this).trigger('enterKey');
    }
  });

  // Sync clock button start/pause to clients.
  $('.clock-controller').click(function(){
    if (clockRunning) {
      clock.stop();
      clockRunning = false;
      $('.clock-status').html('TIMEOUT');
    }
    else {
      clock.start();
      clockRunning = true;
      $('.clock-status').html('');
    }
    send({
      type: 'clock'
    , running: clockRunning
    , time: clock.getTime().time
    });
  });

  var $modal = $('#pickModal')
    , $modalSave = $('#pickSave')
    , $modalText = $('#pickInput')
    , $picks = $('.picks')
    , $commentary = $('.commentary')
    , $sort1 = $('#sortable1');

  // Broadcast pick/defer to picks list. Close modal
  $modalSave.on('click', function() {
    var txt = $modalText.val()
      , $el = $($sort1.children()[0]);
    $el.append('<div class="pick-text">' + txt + '</div>');
    $picks.append($el);

    send({
      type: 'picks'
    });
    sendHTML();

    $modalText.val('');
    $modal.modal('hide');
  });

  function sendHTML() {
    var msg = {
      type: 'html'
      , sortable1: $('#sortable1').html()
      , sortable2: $('#sortable2').html()
      , sortable3: $('#sortable3').html()
      , picks: $picks.html()
    };
    send(msg);
  }

  // Get html data from pre-sort list.
  function getHTML(data) {
    $('#sortable1').html(data.sortable1);
    $('#sortable2').html(data.sortable2);
    $('#sortable3').html(data.sortable3);
    $picks.html(data.picks);
  }

  // Get pick data from input.
  function getPicks(data) {
    $picks.html(data.html);
    clock.stop();
    clock.setTime(180);
  }

  // Sync clocks over clients.
  function getClock(data) {
    clock.setTime(data.time);
    if (data.running) {
      clock.start();
    } else {
      clock.stop();
    }
  }

  // Write commentary to commentary area.
  function writeCommentary(data) {
    var comment = '<div class="item">' + data.data + '</div>';
    console.log(comment);
    $('.commentary').append(comment);
  }

  // SockJs message handling
  var sock = new SockJS('/echo');
  sock.onopen = function() {
    console.log('open');
  };
  sock.onmessage = function(e) {
    // console.log('message', e);
    var msg = JSON.parse(e.data);
    if (msg.type === 'html') return getHTML(msg);
    if (msg.type === 'picks') return getPicks(msg);
    if (msg.type === 'clock') return getClock(msg);
    if (msg.type === 'commentary') return writeCommentary(msg);
  };
  sock.onclose = function() {
    console.log('close');
  };
  function send(msg) {
    // console.log('send: ', msg);
    sock.send(JSON.stringify(msg));
  }

});
