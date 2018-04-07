      var timeline;
      var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      var osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">' +
        'OpenStreetMap</a> contributors';
      var mapboxUrl = 'http://{s}.tiles.mapbox.com/v3/tmcw.map-7s15q36b/{z}/{x}/{y}.png';
      var mapboxAttrib = 'Data, imagery and map information provided by <a href="http://mapbox.com" target="_blank">Mapbox</a>,<a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors.';

      var mapbox = L.tileLayer(mapboxUrl, {
        maxZoom: 18,
        attribution: mapboxAttrib,
        noWrap: true
      });
      var maposm = L.tileLayer(osmUrl, {
        maxZoom: 18,
        attribution: osmAttrib,
        noWrap: true
      });
      var map = L.map('map', {
        layers: [mapbox],
        center: new L.LatLng(46.0664,11.1412),
        zoom: 12,
        maxBounds: [[46.14036,10.90805], [45.99243, 11.37428]]
      });
      var defaultBounds = map.getBounds();
	
        map.on('startfollowing', function() {
            map.on('dragstart', lc._stopFollowing, lc);
        }).on('stopfollowing', function() {
            map.off('dragstart', lc._stopFollowing, lc);
        });    

        function zoomtoroads(lng,lat) {
            var latlng = L.latLng(lng, lat);
            map.panTo(latlng);
            map.setZoom(15);
        return true;
        }

      function updateList(timeline){
        var streets = Array()
        //map.fitBounds(timeline.getBounds());
        /*
	try {
            map.panTo(timeline.getBounds().getCenter());
            map.setZoom(15);
        }
        catch (e) {}
        */
        var displayed = timeline.getDisplayed();
        var list = document.getElementById('displayed-list');
        var startday = document.getElementById('startday');
        var zoomtoarea = document.getElementById('zoomtoarea');
        startday.innerHTML = moment(timeline.time).format("DD-MM-YYYY")
        list.innerHTML = "";
        displayed.forEach(function(street){
        if (street.properties) {
          if (street.properties.note != null) {

            streetname = street.properties.via + '<br/><span style="font-style:strong;font-size:xx-small;">'+street.properties.note+'</span>';
          } else {
            streetname = street.properties.via
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
                if (streets.length != 0) {
                    lng=timeline.getBounds().getCenter().lng;
                    lat = timeline.getBounds().getCenter().lat;
		    // zoomtoarea.innerHTML='<a onClick="zoomtoroads(lng,lat);" href="#">visualizza area</a>';
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
                  if (feature.properties.note != null) {
                    streetname = feature.properties.via + '<br/>' + '<span style="font-style:strong;font-size:xx-small;">'+feature.properties.note+'</span>';
                  } else {
                    streetname = feature.properties.via
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
