map_view_data = {
  "all": { "c": [34.55,69.20], "z": 3},
  "asia-e": { "c": [36.28081425933677, 110.02670288085939], "z": 4},
  "asia-s": { "c": [20.23771733282307, 79.86614227294923], "z": 5},
  "asia-se": { "c": [12.362136693132689, 101.61649703979494], "z": 5},
  "asia-w": { "c": [34.19433952572914, 44.00093078613282], "z": 5},
  "eu-balkan" : { "c": [41.94627690834832, 22.304391860961914], "z": 6},
  "eu-baltic" : { "c": [57.66491691975349, 24.722156524658203], "z": 6},
  "eu-e": { "c": [59.60126921711605, 56.466293334960945], "z": 4},
  "eu-cw": { "c": [49.762195306881786, 11.807384490966799], "z": 5},
}

default_v = map_view_data["all"];

var mymap = null;

function load_map({
  show_img = true,
  fixed_width = true
}) {
  mymap = L.map('main-map-id', {
    maxZoom: 10,
    minZoom: 3,
    zoomControl: 1,
    scrollWheelZoom: 0,
    doubleClickZoom: 1
  }).setView(default_v["c"], default_v["z"]);

  L.tileLayer('http://{s}.tiles.maps.sputnik.ru/{z}/{x}/{y}.png', {
    attribution: '<a href="https://maps.sputnik.ru">Спутник</a> &copy; <a href="https://rt.ru/">Ростелеком</a> &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
  }).addTo(mymap);

  var icon = L.icon({
    "iconUrl": "../jm/jm_marker.svg",
    "iconSize": [40, 40]
  });

  var layer = L.ajaxGeoJson(Y1_JM_PLACES_URL, {
    type: 'json',
    pointToLayer: function(geoJsonPoint, latlng) {
      return L.marker(latlng, {
        icon: icon
      });
    },
    onEachFeature: on_each_map_feature
  });

  layer.addTo(mymap);

  function on_each_map_feature(feature, layer) {
    let name = feature.properties["c"];
    let id = feature.properties["id"];
    let img_name = feature.properties["img"];
    let ratio = feature.properties["r"];

    width = (ratio > 1) ? 300 : 225;

    if (img_name) {
      html =  `<a href="/loc/${id}/" target="_blank" >`

      if (show_img) {
        html += `<img src="../assets/img/jm/s/${id}/${img_name}" alt="${name}" class"map-popup-image" />`
      }

      html += `<div class="map-popup-title">${name}</div></a>`

      options = {}

      if (fixed_width) {
        options = {
          maxWidth: width,
          minWidth: width,
        }
      }

      layer.bindPopup(html, options);
    }
  }

  $('#map-zoom-to').selectmenu({
    change: function( event, data ) {
      data = map_view_data[data.item.value];

      if (data == null) {
        data = default_v;
      }

      mymap.setView(data["c"], data["z"]);
    }
  });
}
