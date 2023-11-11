<script lang="ts">
  import { onMount } from 'svelte';
  import Map from '$lib/ui/Map.svelte';
  import type { ITaskAssignRPC } from './types';
  import { initClient } from '$lib/chord';
  import Icon from '@iconify/svelte';
  import Modal from '$lib/ui/Modal.svelte';

  import { Wave } from 'svelte-loading-spinners';
  import * as dayjs from 'dayjs';

  import { taskPriority, taskStatus } from '$lib/contants';
  export let data;
  const { schema } = data;

  const rpc = initClient<ITaskAssignRPC>(schema);
  let tasks = [];
  let loaded = false;
  onMount(async () => {
    tasks = await rpc.getBySpecialistEmail({ email: 'd@d', onlyActive: false });
    loaded = true;
    // points = [];

    console.log('tasks', tasks);
  });
</script>

<div class="h-full w-full flex flex-col items-center">
  <div class="w-full md:w-3/4 h-[400px]">
    <Map />
  </div>
  <div class="flex flex-col mt-4 items-center w-full">
    {#if !loaded}
      <Wave />
    {:else}
      {#each tasks as task}
        {@const {title: pTitle, colors: pColors} = taskPriority[task.priority]}
        {@const {title: sTitle, colors: sColors} = taskStatus[task.status]}

        <div class="my-2 text-xs px-4 py-4 shadow-md rounded-xl w-full">
          <div class="flex justify-between">
            <div class="flex items-center gap-1">
              <Icon icon="mdi:location" />
              <span>{task.branch.address}</span>
            </div>
            <div class="flex gap-1 items-center pl-2 border-l-2">
              <span class="justify-end">{dayjs(task.created).format('HH:mm DD/MM/YY')}</span>
              <Icon icon="tdesign:time" />
            </div>
          </div>

          <div class="flex mt-1 justify-between">
            <span class="font-bold">{task.task.name}</span>
            <span class="font-bold rounded-xl px-3 py-1 {pColors}">{pTitle}</span>  
          </div>
          <div class="flex mt-1 gap-1 items-continer">
            <span class="mt-1">Статус:</span>
            <span class="font-bold rounded-xl px-3 py-1 {sColors}">{sTitle}</span>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>
