<script lang="ts">
  import { initClient } from '$lib/chord';
  import Icon from '@iconify/svelte';
  import dayjs from 'dayjs';
  import { taskPriority, taskStatus } from '$lib/contants';

  import type { Wrapped } from './types';
  import MapTasks from '$lib/ui/MapTasks.svelte';
  export let data;

  let { schema, tasks, employees, email } = data;
  const rpc = initClient<Wrapped>(schema);

  // TODO remove it after demo

  const DEFAULT_EMAIL = 'bobip@yandex.ru';
  async function updateTasks() {
    console.log('update tasks', selectedEmail);
    tasks = await rpc.TaskAssignRPC.getBySpecialistEmail({
      email: selectedEmail,
      onlyActive: false
    });
    console.log(tasks);
  }
  let selectedEmail = DEFAULT_EMAIL;

  // -----------------------------
  async function updateStatus(i) {
    const { status, id } = tasks[i];
    const res = await rpc.TaskAssignRPC.updateStatus({ newStatus: status, id });
  }

  let moveToTask;
</script>

<div class="h-full w-full flex flex-col items-center bg-base-100">
  <div class="my-5 flex flex-col items-center">
    {#if data.email}
      <h2>Мои задачи</h2>
    {:else}
      <h2>Выбор исполнителя</h2>
      <select
        placeholder="Сотрудник"
        class="select select-bordered w-full max-w-xs"
        bind:value={selectedEmail}
        on:change={updateTasks}
      >
        {#each employees as { email, id }, i}
          <option value={email}>{email}</option>
        {/each}
      </select>
    {/if}
  </div>
  <div class="w-full md:w-3/4 h-[400px] flex items-center justify-center">
    {#key tasks}
      <MapTasks {tasks} bind:moveToTask />
    {/key}
  </div>
  <div class="flex flex-col mt-4 px-4 items-center w-full md:w-3/4">
    {#if !tasks.length}
      <h2>На сегодня задач нет 🙃</h2>
    {/if}
    {#each tasks as task, i}
      {@const { title: pTitle, colors: pColors } = taskPriority[task.priority]}
      {@const { title: sTitle, colors: sColors } = taskStatus[task.status]}

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
          <span class="font-bold">{i + 1}. {task.task.name}</span>
          <span class="font-bold rounded-xl px-3 py-1 {pColors}">{pTitle}</span>
        </div>
        <div class="flex mt-1 gap-2 items-center justify-between">
          <div>
            <span>Статус:</span>
            <select
              class="ml-2 font-bold rounded-xl px-3 py-1 {sColors}"
              bind:value={tasks[i].status}
              on:change={() => updateStatus(i)}
            >
              {#each Object.entries(taskStatus) as [index, status]}
                <option value={index}>{status.title}</option>
              {/each}
            </select>
          </div>
          <button class="flex btn btn-xs" on:click={() => moveToTask(i)}>
            <Icon icon="material-symbols-light:map-outline" />
            Найти
          </button>
        </div>
      </div>
    {/each}
  </div>
</div>
