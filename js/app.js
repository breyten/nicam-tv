NicamTV = window.NicamTV || {};

NicamTV.init = function() {
  NicamTV.get_categories();
};

NicamTV.get_primaries = function(date_from, date_to, nicam_rating) {
  $.post('http://backstage-api.npo.nl/v0/gids/search', JSON.stringify({
      "query": "de||het||een",
      "facets": {
        "gids_genres.primary": {}
      },
      "size": 0,
      "key": "JaFXa3JfNvzaa6zGaHCcTJCud252RRGojBPrB2877Hw",
      "filters": {
        "date": {"from": "2015-11-14", "to": "2015-11-15"},
        "gids_genres.nicam_warning_cs": {"terms": [nicam_rating]}
      }
  }), function (data) {
    NicamTV.data = data;
    console.log("Got data:");
    console.dir(data);
    $('#primary').empty();
    $('div#primary').treemap(data.facets['gids_genres.primary'].terms.map(function (t) {
      return {label: '<a href="#" class="primary" data-term=" + t.term + ">' + t.term + '</a>', value: t.count, data: t.term + ' data'}
    }), {
      nodeClass: function(node, box){
        if(node.value <= 50){
          return 'minor';
        }
        return 'major';
      },
      mouseenter: function (node, box) {
        $('#data-box').html('<p>Label: ' + node.label + '</p><p>Data:' + node.data + '</p><p>Value:' + node.value + '</p>');
      },
      itemMargin: 2
      });
  });
};

NicamTV.get_categories = function(date_from, date_to) {
  $(document).on('click', '.nicam-rating', function (e) {
    //alert('you clicked something!' + $(this).text());
    NicamTV.get_primaries(date_from, date_to, $(this).text());
    e.preventDefault();
    return false;
  });

  $.post('http://backstage-api.npo.nl/v0/gids/search', JSON.stringify({
      "query": "de||het||een",
      "facets": {
        "gids_genres.nicam_warning_cs": {}
      },
      "size": 0,
      "key": "JaFXa3JfNvzaa6zGaHCcTJCud252RRGojBPrB2877Hw",
      "filters": {"date": {"from": "2015-11-14", "to": "2015-11-15"}}
  }), function (data) {
    NicamTV.data = data;
    console.log("Got data:");
    console.dir(data);
    $('#categories').empty();
    $('div#categories').treemap(data.facets['gids_genres.nicam_warning_cs'].terms.map(function (t) {
      return {label: '<a href="#" class="nicam-rating" data-term=" + t.term + ">' + t.term + '</a>', value: t.count, data: t.term + ' data'}
    }), {
      nodeClass: function(node, box){
        if(node.value <= 50){
          return 'minor';
        }
        return 'major';
      },
      mouseenter: function (node, box) {
        $('#data-box').html('<p>Label: ' + node.label + '</p><p>Data:' + node.data + '</p><p>Value:' + node.value + '</p>');
      },
      itemMargin: 2
      });
    // for (idx in data.facets['gids_genres.nicam_warning_cs'].terms) {
    //   var term = data.facets['gids_genres.nicam_warning_cs'].terms[idx];
    //   $('#categories').append($('<li>' + term.term + '</li>'));
    // }
  });
};

$(document).ready(function() {
  NicamTV.init();
});
