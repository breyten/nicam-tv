NicamTV = window.NicamTV || {};

NicamTV.init = function() {
  NicamTV.get_categories();
};

NicamTV.get_categories = function(date_from, date_to) {
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
      return {label: t.term, value: t.count, data: t.term + ' data'}
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
