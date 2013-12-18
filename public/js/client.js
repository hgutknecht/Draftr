$(function() {

  var clockRunning = false;

  $('#sortable1, #sortable2, #sortable3').sortable({
    connectWith: '.connectedSortable',
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

  $('#sortable1').on('sortreceive', function(event, ui) {
    // Start the on the clock timer.
    clock.start();
    clockRunning = true;
    var $list = $(this);
    if ($list.children().length > 1) {
      $(ui.sender).sortable('cancel');
    }
  });

  $('.clock-controller').click(function(){
    if (clockRunning) {
      clock.stop();
      clockRunning = false;
    }
    else {
      clock.start();
      clockRunning = true;
    }
    send({
      type: 'clock'
    , running: clockRunning
    , time: clock.getTime().time
    })
  });

  clock = $('.clock').FlipClock(180, {
    clockFace: 'MinuteCounter',
    countdown: true,
    autoStart: false,
  });


  var $modal = $('#pickModal')
    , $modalSave = $('#pickSave')
    , $modalText = $('#pickInput')
    , $picks = $('.picks')
    , $commentary = $('.commentary')
    , $sort1 = $('#sortable1')

  $modalSave.on('click', function() {
    var txt = $modalText.val()
      , $el = $($sort1.children()[0])

    $el.append('<div class="pick-text">' + txt + '</div>')
    $picks.append($el)

    send({
      type: 'picks'
    , html: $picks.html()
    })

    $modalText.val('')
    $modal.modal('hide')
  })


  function getSorted(data) {
    $('#sortable1').html(data.sortable1)
    $('#sortable2').html(data.sortable2)
    $('#sortable3').html(data.sortable3)
  }

  function getPicks(data) {
    $picks.html(data.html);
  }

  function getClock(data) {
    clock.setTime(data.time)

    if (data.running) {
      clock.start();
    } else {
      clock.stop();
    }
  }



  var sock = new SockJS('/echo')

  sock.onopen = function() {
    console.log('open');
  };

  sock.onmessage = function(e) {
    console.log('message', e);
    var msg = JSON.parse(e.data)

    if (msg.type === 'sort') return getSorted(msg)
    if (msg.type === 'picks') return getPicks(msg)
    if (msg.type === 'clock') return getClock(msg)
  };

  sock.onclose = function() {
    console.log('close');
  };

  function send(msg) {
    console.log('send: ', msg)
    sock.send(JSON.stringify(msg))
  }


});
