<script>
  import { PUBLIC_MAP_KEY } from '$env/static/public';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { Moon } from 'svelte-loading-spinners';

  export let branches = [];
  export let center = [45.037165, 38.975636];
  export let zoom = 12;

  let loaded = false;
  
  function loadMap() {
    map = new ymaps.Map('map', {
      center: center,
      zoom: zoom
    });
    // Создаем геообъект с типом геометрии "Точка".

    branches.forEach((b, i) => {
      map.geoObjects.add(
        new ymaps.Placemark(
          [b.address.latitude, b.address.longitude],
          {
            balloonContentHeader: b.address.address,
          },
          { preset: b.is_office ? 'islands#greenIcon' : 'islands#blueIcon'}
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

<div class="w-full h-full max-w-5xl">
  {#if !loaded}
    <div class="h-full grid place-content-center">
      <Moon />
    </div>
  {/if}
  <div id="map" class="w-full h-full" />
</div>
