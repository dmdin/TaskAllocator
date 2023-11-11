<script>
  import { PUBLIC_MAP_KEY } from '$env/static/public';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { Moon } from 'svelte-loading-spinners';

  export let tasks = [];
  export let center = [45.037165, 38.975636];
  export let zoom = 10;  

  let map;
  let loaded = false;

  const priorityPresets = {
    "0": "islands#blueIcon",
    "1": "islands#yellowIcon",
    "2": "islands#redIcon",
  }

  function loadMap() {
    let map = new ymaps.Map('map', {
      center: center,
      zoom: zoom
    });
    // Создаем геообъект с типом геометрии "Точка".
    const points = map.geoObjects;
    console.log(tasks)
    tasks.forEach((task) => {
      points.add(
        new ymaps.Placemark(
          [task.branch.latitude, task.branch.longitude],
          { balloonContentHeader: task.branch.address, balloonContentBody: task.task.name},
          { preset: priorityPresets[task.priority]}
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
