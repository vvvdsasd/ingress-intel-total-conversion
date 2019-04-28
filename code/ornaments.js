// ORNAMENTS ///////////////////////////////////////////////////////

// Added as part of the Ingress #Helios in 2014, ornaments
// are additional image overlays for portals.
// currently there are 6 known types of ornaments: ap$x$suffix
// - cluster portals (without suffix)
// - volatile portals (_v)
// - meeting points (_start)
// - finish points (_end)
//
// Beacons and Frackers were introduced at the launch of the Ingress
// ingame store on November 1st, 2015
// - Beacons (pe$TAG - $NAME) ie: 'peNIA - NIANTIC'
// - Frackers ('peFRACK')
// (there are 7 different colors for each of them)


window.ornaments = {};
window.ornaments.OVERLAY_SIZE = 60;
window.ornaments.OVERLAY_OPACITY = 0.6;

window.ornaments.setup = function() {
  window.ornaments._portals = {};
  window.ornaments._layer = L.layerGroup();
  window.ornaments._beacons = L.layerGroup();
  window.ornaments._frackers = L.layerGroup();
  window.addLayerGroup('Ornaments', window.ornaments._layer, true);
  window.addLayerGroup('Beacons', window.ornaments._beacons, true);
  window.addLayerGroup('Frackers', window.ornaments._frackers, true);
};

// quick test for portal having ornaments
window.ornaments.isInterestingPortal = function(portal) {
  return portal.options.data.ornaments.length !== 0;
};

window.ornaments.addPortal = function(portal) {
  var guid = portal.options.guid;

  window.ornaments.removePortal(portal);

  var size = window.ornaments.OVERLAY_SIZE;
  var latlng = portal.getLatLng();

  if (portal.options.data.ornaments) {
    window.ornaments._portals[guid] = portal.options.data.ornaments.map(function(ornament) {
      var layer = window.ornaments._layer;
      if (ornament.startsWith("ap") && ornament.length === 3) {
        var color = "#000000";
        switch (ornament) {
          case 'ap1':
            color = "#ff9136"; break;
          case 'ap2':
            color = "#ff52e7"; break;
          case 'ap3':
            color = "#9e5aff"; break;
          case 'ap4':
            color = "#d74545"; break;
          case 'ap5':
            color = "#fff100"; break;
          case 'ap6':
            color = "#a6ffe6"; break;
          case 'ap7':
            color = "#929497"; break;
          default:
            console.warn('unknown ornament: '+ornament);
        }
        return L.circleMarker(latlng, {color: color, interactive: false, keyboard: false, opacity: window.ornaments.OVERLAY_OPACITY }).addTo(layer);
      }
      
      if (ornament.startsWith("pe")) {
        if (ornament === "peFRACK") {
          layer = window.ornaments._frackers;
        } else {
          layer = window.ornaments._beacons;
        }
      }
      var icon = L.icon({
        iconUrl: "//commondatastorage.googleapis.com/ingress.com/img/map_icons/marker_images/" + ornament + ".png",
        iconSize: [size, size],
        iconAnchor: [size/2, size/2],
      });

      return L.marker(latlng, {icon: icon, interactive: false, keyboard: false, opacity: window.ornaments.OVERLAY_OPACITY }).addTo(layer);
    });
  }
};

window.ornaments.removePortal = function(portal) {
  var guid = portal.options.guid;
  if(window.ornaments._portals[guid]) {
    window.ornaments._portals[guid].forEach(function(marker) {
      window.ornaments._layer.removeLayer(marker);
      window.ornaments._beacons.removeLayer(marker);
      window.ornaments._frackers.removeLayer(marker);
    });
    delete window.ornaments._portals[guid];
  }
};
