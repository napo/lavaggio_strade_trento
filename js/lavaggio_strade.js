      var timeline;
      var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      var osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">' +
        'OpenStreetMap</a> contributors';
      var mapboxUrl = 'http://{s}.tiles.mapbox.com/v3/tmcw.map-7s15q36b/{z}/{x}/{y}.png';
      var mapboxUrl = 'https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidG9tYXNkaWV6IiwiYSI6ImRTd01HSGsifQ.loQdtLNQ8GJkJl2LUzzxVg'
      var mapboxUrl = 'https://external-mxp1-1.xx.fbcdn.net/map_tile.php?v=1014&osm_provider=2&x={x}&y={y}&z={z}&language=it_IT'

      var mapboxAttrib = 'Data, imagery and map information provided by <a href="http://mapbox.com" target="_blank">Mapbox</a>,<a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors.';
      var mapboxAttrib = 'Data, imagery and map information provided by <a href="http://facebook.com" target="_blank">Facebook</a>,<a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors.';
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

            streetname = street.properties.nome + '<br/><span style="font-style:strong;font-size:xx-small;">'+street.properties.note+'</span>';
          } else {
            streetname = street.properties.nome
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
                    streetname = feature.properties.nome + '<br/>' + '<span style="font-style:strong;font-size:xx-small;">'+feature.properties.note+'</span>';
                  } else {
                    streetname = feature.properties.nome
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

/* to remove */
	var data = strade;
	var featuresLayer = new L.GeoJSON(data, {
			onEachFeature: function(feature, marker) {
				marker.bindPopup('<h4>'+ feature.properties.nome +'</h4>');
			}
		});

	map.addLayer(featuresLayer);
	var searchControl = new L.Control.Search({
		layer: featuresLayer,
		propertyName: 'nome',
		initial:false,
		casesensitive: false,
		marker: false,
		moveToLocation: function(latlng, title, map) {
			var zoom = map.getBoundsZoom(latlng.layer.getBounds());
			map.setView(latlng, zoom); // access the zoom
			latlng.layer.fire('click');
		}
	});
	
	searchControl.on('search:locationfound', function(e) {
		if(e.layer._popup)
			e.layer.openPopup();
	}).on('search:collapsed', function(e) {
		featuresLayer.eachLayer(function(layer) {	
			featuresLayer.resetStyle(layer);
		});	
	});
	
	map.addControl(searchControl);  
	map.removeLayer(featuresLayer)
/* to remove here */

    
	var baseMaps = {
                "mapbox": mapbox,
                "openstreetmap": maposm
               };

    var overlayMaps = {
               "lavaggio": timeline
    };	
    
	L.control.layers(baseMaps, overlayMaps).addTo(map);




