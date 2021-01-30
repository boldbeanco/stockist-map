document.addEventListener("DOMContentLoaded", () => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiZGlnYnlrIiwiYSI6ImNra2ZjMmxxMjBzMGgyb21uZHltb2wwYjIifQ.tfI899NGWW__KVmKVl8qBg";
  if (window.navigator.geolocation) {
    window.navigator.geolocation.getCurrentPosition(
      function (position) {
        drawMap(position.coords.longitude, position.coords.latitude);
      },
      function () {
        drawMap(-0.9859655, 51.5845089);
      }
    );
  } else {
    drawMap(-0.9859655, 51.5845089);
  }
  function drawMap(lat, lng) {
    var map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/outdoors-v11",
      center: [lat, lng],
      zoom: 10,
    });
    var client = contentful.createClient({
      space: "6v34qe172vks",
      accessToken: "vYDWMMLQ75F3agfli-nyOp29eah00JIvj_qqMwaKDbk",
    });
    const geojson = {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    };
    client.getEntries().then(function (entries) {
      // Convert data to geojson
      geojson.data.features = entries.items.map((entry) => {
        return {
          // feature for Mapbox DC
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [entry.fields.location.lon, entry.fields.location.lat],
          },
          properties: {
            title: entry.fields.name,
            description: entry.fields.description,
          },
        };
      });
      map.on("load", function () {
        map.loadImage("/img/boldbeanco-marker.png", (error, image) => {
          if (error) throw error;
          map.addImage("marker", image);
          map.addSource("points", geojson);
          map.addLayer({
            id: "stockists",
            type: "symbol",
            source: "points",
            layout: {
              "icon-image": "marker",
              "text-field": ["get", "title"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 2],
              "text-anchor": "top",
            },
          });
        });
      });
      map.on("click", "stockists", function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var title = e.features[0].properties.title;
        var description = e.features[0].properties.description;
        var url = e.features[0].properties.url;
        var email = e.features[0].properties.email;
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        new mapboxgl.Popup({ offset: 25 })
          .setLngLat(coordinates)
          .setHTML(
            `<h3>${title}</h3>${documentToHtmlString(JSON.parse(description))}
              <p><a href="${url}">${
              url ? url : ""
            }</a></p><p><a href="email:${email}">${email ? email : ""}</a></p>
            `
          )
          .addTo(map);
      });
    });
  }
});
