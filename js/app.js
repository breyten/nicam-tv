NicamTV = window.NicamTV || {};
NicamTV.nicam_rating = undefined;
NicamTV.primary = undefined;

NicamTV.init = function() {
  var d = new Date();
  var date_only = d.toISOString().split('T')[0];
  NicamTV.get_categories(date_only, date_only);
};

NicamTV.get_programs = function(date_from, date_to, nicam_rating, primary) {
  $.post('http://backstage-api.npo.nl/v0/gids/search', JSON.stringify({
      "facets": {},
      "size": 100,
      "sort": "date",
      "order": "asc",
      "key": "JaFXa3JfNvzaa6zGaHCcTJCud252RRGojBPrB2877Hw",
      "filters": {
        "date": {"from": date_from, "to": date_to},
        "gids_genres.nicam_warning_cs": {"terms": [nicam_rating]},
        "gids_genres.primary": {"terms": [primary]}
      }
  }), function (data) {
    $('a[href="#tab-listing"]').click();
    NicamTV.data = data;
    console.log("Got data:");
    console.dir(data);
    $('#listing').empty();
    for (idx in data.hits.hits) {
      var item = data.hits.hits[idx];
      var item_time = item._source.published_start_time.split('T')[1].split(':').slice(0,2);
      var output = '<div class="listing">';
      output += '<h2>' + item._source.title + '(' + item_time.join(':') + '/' + item._source.channel + ')</h2>';
      output += '<p>' + item._source.description + '</p>';
      output += '</div>';
      console.dir(item);
      $('#listing').append($(output));
    }
  });
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
        "date": {"from": date_from, "to": date_to},
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
        if(node.value <= 10){
          return 'minor';
        }
        return 'major';
      },
      mouseenter: function (node, box) {
        $('#data-box').html('<p>Label: ' + node.label + '</p><p>Data:' + node.data + '</p><p>Value:' + node.value + '</p>');
      },
      itemMargin: 2
    });
    $('a[href="#tab-primary"]').click();
  });
};

NicamTV.get_categories = function(date_from, date_to) {
  $(document).on('click', '.nicam-rating', function (e) {
    //alert('you clicked something!' + $(this).text());
    NicamTV.nicam_rating = $(this).text();
    NicamTV.get_primaries(date_from, date_to, NicamTV.nicam_rating);
    e.preventDefault();
    return false;
  });

  $(document).on('click', '.primary', function (e) {
    //alert('you clicked something!' + $(this).text());
    NicamTV.primary = $(this).text();
    NicamTV.get_programs(date_from, date_to, NicamTV.nicam_rating, NicamTV.primary);
    e.preventDefault();
    return false;
  });

  $.post('http://backstage-api.npo.nl/v0/gids/search', JSON.stringify({
      //"query": "de||het||een",
      "facets": {
        "gids_genres.nicam_warning_cs": {}
      },
      "size": 0,
      "key": "JaFXa3JfNvzaa6zGaHCcTJCud252RRGojBPrB2877Hw",
      "filters": {"date": {"from": date_from, "to": date_to}}
  }), function (data) {
    NicamTV.data = data;
    console.log("Got data:");
    console.dir(data);
    $('#categories').empty();
    $('div#categories').treemap(data.facets['gids_genres.nicam_warning_cs'].terms.map(function (t) {
      return {label: '<a href="#" class="nicam-rating" data-term=" + t.term + ">' + t.term + '</a>', value: t.count, data: t.term + ' data'}
    }), {
      nodeClass: function(node, box){
        if(node.value <= 15){
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

$(document).ready(function() {
  NicamTV.init();
});
