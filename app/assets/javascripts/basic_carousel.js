(function() {

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
          cycleFab_click(this, false);
        });

        $(this).children('.fab-forward-btn').first().click(function() {
          cycleFab_click(this, true);
        });

      });

    };

    function cycleFab_click(button_element, forward) {
      var fab_encapsulator = $(button_element).parent();

      var cycle_options = {
        user_id: fab_encapsulator.attr('data-user-id'),
        fab_id: fab_encapsulator.attr('data-fab-id'),
        fab_period: fab_encapsulator.attr('data-fab-period')
      }

      var direction = forward ? 'forward' : 'backward';

      requestCycledFab(direction, cycle_options, function(markup) {
        var options = JSON.parse(markup.split(';')[0]);
        var new_fab_id = options.fab_id;
        var new_fab_period = options.fab_period;
        var which_fabs_exist = options.neighbor_presence;

        disablePreviousOrNextBarsIfNeeded(fab_encapsulator, which_fabs_exist);
        markup = markup.split(";").slice(1).join(";");
        populateFabInDisplay(markup, fab_encapsulator);

        fab_encapsulator.attr('data-fab-period', new_fab_period);
      });
    }

    function disablePreviousOrNextBarsIfNeeded(fab_element, which_fabs_exist) {
      var previous_fab_exists = which_fabs_exist[0];
      var next_fab_exists = which_fabs_exist[1];

      enableAndDisableButtonsAsAppropriate();

      function enableAndDisableButtonsAsAppropriate() {
        if (previous_fab_exists)
          fab_element.children('.fab-backward-btn').first().removeClass('disabled');
        else
          fab_element.children('.fab-backward-btn').first().addClass('disabled');

        if (next_fab_exists)
          fab_element.children('.fab-forward-btn').first().removeClass('disabled');
        else
          fab_element.children('.fab-forward-btn').first().addClass('disabled');
      }

    }

    function requestCycledFab(direction, cycle_options, cb) {
      var action = (direction == "forward") ? "/tools/next_fab?" : "/tools/previous_fab?"
      var query_list = [];
      query_list.push("user_id=" + cycle_options.user_id);
      if (cycle_options.fab_period != undefined)
        query_list.push("fab_period=" + encodeURI(cycle_options.fab_period));


      var url = action + query_list.join("&");
      return ajaxRequest(url, function(data) {
        cb(data);
      });
    }

    function ajaxRequest(url, cb) {
      $.ajax({
        url: url,
        success: function(data){
          if (data != "no such fab")
            cb(data);
        },
        error: function(e){
          console.log("ajaxRequest failed for " + url);
        }
      });
    }

    // removes the old forward notes, and overwrites the backward notes with
    // the backward AND forward... kinda odd... javascript...
    function populateFabInDisplay(markup, fab_encapsulator) {
      var ulElements = parseTheUlElementsFromServerResponse(markup);

      var backward_notes = fab_encapsulator.children('.back').first();
      var forward_notes = fab_encapsulator.children('.forward').first();

      backward_notes[0].outerHTML = ulElements[0];
      forward_notes[0].outerHTML = ulElements[1];
    }

    // Parse the two <ul> sections out of the html response from the server
    // Those represent the FAB notes of both back and forward
    function parseTheUlElementsFromServerResponse(markup) {
      // Make an element to facilitate DOM manipulation
      var parsingDiv = document.createElement('div');

      parsingDiv.innerHTML = markup;

      var back_markup = parsingDiv.children[0].outerHTML;
      var forward_markup = parsingDiv.children[1].outerHTML;
      return [back_markup, forward_markup];
    }

  };
  window.basicCarousel = new BasicCarousel();

})();
