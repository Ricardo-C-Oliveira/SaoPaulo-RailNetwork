     var map = L.map('map', {
         'zoomControl': false,
     }).setView([-23.5759, -46.6468], 12);

     //zoom custom position
     L.control.zoom({
         position: 'topright'
     }).addTo(map);

     //the base map
     L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
         attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
     }).addTo(map);


     function getColor(d) {
         return d == 1 ? "#171796" :
             d == 2 ? "#007A5E" :
             d == 3 ? "#ED2E38" :
             d == 4 ? "#FFD525" :
             d == 5 ? "#BA1FB5" :
             d == 7 ? "#a50050" :
             d == 8 ? "#919388" :
             d == 9 ? "#00ab84" :
             d == 10 ? "#00778b" :
             d == 11 ? "#e05a5c" :
             d == 12 ? "#001a72" :
             "#b10026";
     }

     //function that defines style for each line
     function Style(feature) {
         return {
             color: getColor(feature.properties.ref),
             weight: 5,
             //weight: getWeight(feature.properties.pass_2014),
             opacity: 1,
             dashArray: '',
         };
     }



     function highlightFeature(e) {
         var layer = e.target;

         layer.setStyle({
             weight: 8,
             //color: '#666',
             dashArray: '5',
             fillOpacity: 0.7
         });

         if (!L.Browser.ie && !L.Browser.opera) {
             layer.bringToFront();
         }

         info.update(layer.feature.properties);

     }

     var cptm;
     var metro;

     function resetHighlight(e) {
         cptm.resetStyle(e.target);
         metro.resetStyle(e.target);
         info.update();
     }

     function zoomToFeature(e) {
         map.fitBounds(e.target.getBounds());
     }

     function onEachFeature(feature, layer) {
         layer.on({
             mouseover: highlightFeature,
             mouseout: resetHighlight,
             click: zoomToFeature,

         });
     }

     //geoJson calls
     var cptm = L.geoJson(line_cptm, {
         style: Style,
         onEachFeature: onEachFeature
     }).addTo(map);

     var metro = L.geoJson(line_metro, {
         style: Style,
         onEachFeature: onEachFeature
     }).addTo(map);

     //layer control
     var overlayMaps = {
         "Metro": metro,
         "CPTM": cptm
     };

     var layerControl = L.control.layers(null, overlayMaps, {
         collapsed: false,
     });

     layerControl.addTo(map);

     layerControl._container.remove();

     document.getElementById('layerControl').appendChild(layerControl.onAdd(map));

     //info on hover!!!
     var info = L.control();

     info.onAdd = function (map) {
         this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
         this.update();
         return this._div;
     };

     // method that we will use to update the control based on feature properties passed
     info.update = function (props) {
         this._div.innerHTML = '<h4>Line Information:</h4>' + (props ?
             '<p>Operator: ' + props.operator + '</p><p>Line Number: ' + props.ref + '</p><p>Ridership - 2014: ' + props.pass_2014 + '</p><p>Ridership - 2012: ' + props.pass_2012 + '</p>' : '<i>Hover over a line</i>');
     };

     info.addTo(map);

     info._container.remove();

     document.getElementById('layerControl').appendChild(info.onAdd(map));