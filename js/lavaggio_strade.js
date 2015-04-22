      var timeline;
      var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      var osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">' +
        'OpenStreetMap</a> contributors';
      var mapboxUrl = 'http://{s}.tiles.mapbox.com/v3/tmcw.map-7s15q36b/{z}/{x}/{y}.png';
      var mapboxAttrib = 'Data, imagery and map information provided by <a href="http://mapbox.com" target="_blank">Mapbox</a>,<a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors.';
        var mapquestUrl = 'http://otile1.mqcdn.com/tiles/1.0.0/osm//{z}/{x}/{y}.png';
        var mapquestAttrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors.</a> Tiles courtesy of <a href="http://www.mapquest.com/">MapQuest</a> <img src="https://developer.mapquest.com/content/osm/mq_logo.png">';

      var mapbox = L.tileLayer(mapboxUrl, {
        maxZoom: 18,
        attribution: mapboxAttrib,
        noWrap: true
      });
      var osm = L.tileLayer(osmUrl, {
        maxZoom: 18,
        attribution: osmAttrib,
        noWrap: true
      });
      var mapquest = L.tileLayer(mapquestUrl, {
        maxZoom: 18,
        attribution: mapquestAttrib,
        noWrap: true
      });
      var map = L.map('map', {
        layers: [mapquest],
        center: new L.LatLng(46.0664,11.1412),
        zoom: 14,
        maxBounds: [[46.14036,10.90805], [45.99243, 11.37428]]
      });
      var defaultBounds = map.getBounds();
	
	    lc = L.control.locate({
        		follow: true,
        		strings: {
            		title: "Mostrami dove mi trovo!"
        		}
	    }).addTo(map);

        map.on('startfollowing', function() {
            map.on('dragstart', lc._stopFollowing, lc);
        }).on('stopfollowing', function() {
            map.off('dragstart', lc._stopFollowing, lc);
        });    


      function updateList(timeline){
        var streets = Array()
        //map.fitBounds(timeline.getBounds());
        try {
            map.panTo(timeline.getBounds().getCenter());
            map.setZoom(15);
        }
        catch (e) {}
        
        var displayed = timeline.getDisplayed();
        var list = document.getElementById('displayed-list');
        var startday = document.getElementById('startday');
        var endday = document.getElementById('endday');
        startday.innerHTML = moment(timeline.time).format("DD-MM-YYYY")
        list.innerHTML = "";
        displayed.forEach(function(street){
        if (street.properties) {
          if (street.properties.limit != "NaN") {
            streetname = street.properties.name + '<br/><span style="font-style:strong;font-size:xx-small;">'+street.properties.limit+'</span>';
          } else {
            streetname = street.properties.name
          }
          if (streets.indexOf(streetname) == -1) {
            var li = document.createElement('li');
            streets.push(streetname);
            streets.sort();
                for (var s in streets) {
                    streets[s];
                    li.innerHTML =  streetname;
                    list.appendChild(li);
                }
            }
        }
        });
      }

      function onLoadData(data){
        timeline = L.timeline(data, {
          formatDate: function(date){
            return moment(date).format("DD-MM-YYYY");
          },
           onEachFeature: function (feature, layer) {
                  streetname = ""
                  if (feature.properties.limit != "NaN") {
                    streetname = feature.properties.name + '<br/>' + '<span style="font-style:strong;font-size:xx-small;">'+feature.properties.limit+'</span>';
                  } else {
                    streetname = feature.properties.name
                  }
                layer.bindPopup(streetname);
            },
        style: function (feature) {
            return {color: 'red',fillColor: 'red'};
        }
        });
        timeline.addTo(map);
        timeline.on('change', function(e){
          updateList(e.target);
        });
        updateList(timeline);
      }
    
        var baseMaps = {
                "mapbox": mapbox,
                "openstreetmap": maposm
               };

            var overlayMaps = {
               "lavaggio": timeline
            };	
            L.control.layers(baseMaps, overlayMaps).addTo(map);
