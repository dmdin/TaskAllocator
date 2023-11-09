<script>
  import {PUBLIC_MAP_KEY} from '$env/static/public'
  import { browser } from '$app/environment'; 
  import { onMount } from 'svelte';
  import {Moon} from 'svelte-loading-spinners';

  export let locations = [
    {
      latitude: 55.75361503443606,
      longitude: 37.620883000000006,
      name: 'Test point'
    }
  ];
  export let center = [55.75361503443606, 37.620883000000006];
  export let zoom = 17;

  let loaded = false;
  let map

  function loadMap() {
    let map = new ymaps.Map('map', {
      center: center,
      zoom: zoom
    });
    // Создаем геообъект с типом геометрии "Точка".
    const points = map.geoObjects;
    locations.forEach((location) => {
      points.add(
        new map.Placemark(
          [location.latitude, location.longitude],
          { balloonContent: location.name },
          {}
        )
      );
    });
  }

  // onMount(() => {
    // console.log(ymaps)
  // }) 
</script>

<svelte:head>
  {#if browser}
  <script
    src="https://api-maps.yandex.ru/2.1/?apikey={PUBLIC_MAP_KEY}&lang=en_US"
    type="text/javascript"
    on:load={() => {ymaps.ready(loadMap);}}
  />
  {/if}
</svelte:head>

<div class="">
  {#if !loaded}
    <Moon/>
  {/if}
</div>

<div id="map" class="w-[500px] h-[400px]"></div>


