<script>
  import { PUBLIC_MAP_KEY } from '$env/static/public';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { Moon } from 'svelte-loading-spinners';

  export let locations = [
    {
      latitude: 55.75361503443606,
      longitude: 37.620883000000006,
      name: 'Test point'
    }
  ];
  export let center = [55.75361503443606, 37.620883000000006];
  export let zoom = 17;

  let map;
  let loaded = false;

  function loadMap() {
    let map = new ymaps.Map('map', {
      center: center,
      zoom: zoom
    });
    // Создаем геообъект с типом геометрии "Точка".
    const points = map.geoObjects;
    locations.forEach((location) => {
      points.add(
        new ymaps.Placemark(
          [location.latitude, location.longitude],
          { balloonContent: location.name },
          {}
        )
      );
    });
    loaded = true;
  }

  function initYmaps() {
    ymaps.ready(loadMap);
  }
</script>

<svelte:head>
  {#if browser}
    <script
      src="https://api-maps.yandex.ru/2.1/?apikey={PUBLIC_MAP_KEY}&lang=en_US"
      type="text/javascript"
      on:load={initYmaps}
    ></script>
  {/if}
</svelte:head>

<div class="w-full h-full max-w-2xl">
  {#if !loaded}
    <div class="h-full grid place-content-center">
      <Moon />
    </div>
  {/if}
  <div id="map" class="w-full h-full" />
</div>
