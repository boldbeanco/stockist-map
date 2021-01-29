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
    console.log(documentToHtmlString);
    client.getEntries().then(function (entries) {
      entries.items.forEach(function (entry) {
        var el = document.createElement("div");
        el.className = "marker";
        new mapboxgl.Marker(el, {
          anchor: "bottom",
        })
          .setLngLat([entry.fields.location.lon, entry.fields.location.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }) // add popups
              .setHTML(
                `<h3>${entry.fields.name}</h3><div>${documentToHtmlString(
                  entry.fields.description
                )}</div><p><a href="${entry.fields.url}">${
                  entry.fields.url ? entry.fields.url : ""
                }</a></p><p><a href="email:${entry.fields.email}">${
                  entry.fields.email ? entry.fields.email : ""
                }</a></p>`
              )
          )
          .addTo(map);
      });
    });
  }
});
