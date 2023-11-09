<script>
  import {PUBLIC_MAP_KEY} from '$env/static/public'
  export let locations = [
    {
      latitude: 55.75361503443606,
      longitude: 37.620883000000006,
      name: 'Test point'
    }
  ];
  export let center = [55.75361503443606, 37.620883000000006];
  export let zoom = 17;

  let Loaded = false;

  function loadMap() {
    var myMap = new ymaps.Map('map', {
      center: center,
      zoom: zoom
    });
    // Создаем геообъект с типом геометрии "Точка".
    const points = myMap.geoObjects;
    locations.forEach((location) => {
      points.add(
        new ymaps.Placemark(
          [location.latitude, location.longitude],
          { balloonContent: location.name },
          {}
        )
      );
    });
    Loaded = true;
  }
</script>

<svelte:head>
  <script
    src="https://api-maps.yandex.ru/2.1/?apikey={PUBLIC_MAP_KEY}&lang=en_US"
    type="text/javascript"
    on:load={() => ymaps.ready(loadMap)}
  >
  </script>
</svelte:head>

<div class="mt-[100px]">
  {#if Loaded === false}
    <h1>Loading...</h1>
  {/if}
</div>

<div id="map"></div>

<style>
  #map {
    width: 720px;
    height: 540px;
  }
</style>
