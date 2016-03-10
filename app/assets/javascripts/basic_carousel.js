var BasicCarousel = function() {

  // apply this to a selector that will get divs...
  // the divs must have a data-user-id and a data-fab-id
  // The divs must also contain navigation buttons:
  // .fab-backward-btn and .fab-forward-btn
  this.register = function(selector) {

    $(selector).each(function() {

      // Make it so when you click the child nav button, they look for the
      // parent's data and conduct the appropriate ajax/ view change action
      $(this).children('.fab-backward-btn').first().click(function() {
        var user_id = $(this).parent().attr('data-user-id');
        var fab_id = $(this).parent().attr('data-fab-id');
        var fab_element = $($(this).parent());

        requestPreviousFab(user_id, fab_id, function(markup) {
          populateFabInDisplay(markup, fab_element);
        });

      });

    });

  };

  function requestPreviousFab(user_id, fab_id, cb) {
    var url = "/tools/previous_fab?" + "user_id=" + user_id + "&fab_id=" + fab_id;

    return ajaxRequest(url, function(data) {
      cb(data);
    });
  }

  function requestNextFab(user_id, fab_id, cb) {
    var url = "/tools/previous_fab?" + "user_id=" + user_id + "&fab_id=" + fab_id;

    return ajaxRequest(url, function(data) {
      cb(data);
    });
  }

  function ajaxRequest(url, cb) {
    $.ajax({
      url: url,
      success: function(data){
        cb(data);
      },
      error: function(e){
        console.log("ajaxRequest failed for " + url);
      }
    });
  }

  // removes the old forward notes, and overwrites the backward notes with
  // the backward AND forward... kinda odd... javascript...
  function populateFabInDisplay(markup, fab_element) {
    var backward_notes = fab_element.children('.forward-back').first();
    var forward_notes = fab_element.children('.forward-back').last();

    forward_notes.remove();
    // TODO:  research how to do this with Tribby's templates and json?
    backward_notes[0].outerHTML = markup;
    alert('done');
  }

};

window.basicCarousel = new BasicCarousel();

// FIXME: this needs to be handled better... only do it on the page we need it
// for...
$(document).ready(function() {
  basicCarousel.register('.basic-carousel');
});
