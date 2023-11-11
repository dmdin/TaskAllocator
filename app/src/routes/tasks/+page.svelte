<script lang="ts">
  import { initClient } from '$lib/chord';
  import Icon from '@iconify/svelte';
  import * as dayjs from 'dayjs';
  import { onMount } from 'svelte';
  import type { Wrapped } from './types';
  import Modal from '$lib/ui/Modal.svelte';

  import TaskPriority from '$lib/ui/TaskPriority.svelte';
  import TaskStatus from '$lib/ui/TaskStatus.svelte';

  export let data;
  const { schema } = data;

  const rpc = initClient<Wrapped>(schema);

  let tasks = [];
  let branches = [];
  let employees = [];

  onMount(async () => {
    tasks = await rpc.TaskAssignRPC.getForManager(false);
    branches = await rpc.BranchRPC.getAll({ count: 100, offset: 0 });
  });

  const grades = ['Jun 🐣', 'Mid 🧑‍💻', ' Sen 🧙‍♂️'];

  let editingIndex = 0;

  let employeeTemplate = {
    id: undefined,
    address: '654aa113bff6a11489a510f5',
    priority: '0',
    status: '0',

    email: '',
    firstName: '',
    lastName: '',
    fatherName: '',
    level: 0
  };
  let editing = { ...employeeTemplate };

  async function saveEdited() {
    let entity, validation;
    console.log(editing);
    if (editing.id) {
      ({ entity, validation } = await rpc.SpecialistRPC.update(editing));
      employees[editingIndex] = entity;
    } else {
      ({ entity, validation } = await rpc.SpecialistRPC.create(editing));
      employees = employees.concat(entity);
    }
  }

  function startEditing(index) {
    create_modal?.show();
    editingIndex = index;
    editing = employees[index];
    editing.level = Number(editing.level);
  }

  function startCreating() {
    create_modal?.show();
    editing = { ...employeeTemplate };
  }

  let deleteIndex;
  function deleteEmployee(index) {
    delete_modal?.show();
    deleteIndex = index;
  }

  async function confirmDelete() {
    await rpc.SpecialistRPC.delete(employees[deleteIndex].id);
    employees.splice(deleteIndex, 1);
    employees = employees;
  }
</script>

<Modal id="delete_modal" title="Удаление пользователя">
  <h3 class="mt-4 text-xl font-bold text-center">Вы уверены?</h3>
  <form method="dialog" class="mt-5 m-auto flex gap-2 items-center justify-center">
    <button class="btn btn-error btn-sm" on:click={confirmDelete}>Удалить</button>
    <button class="btn btn-outline btn-sm">Отмена</button>
  </form>
</Modal>

<Modal
  title={editing.id ? 'Редактирование сотрудника' : 'Создание сотрудника'}
  on:save={saveEdited}
  id="create_modal"
>
  <form class="m-auto max-w-[320px] flex flex-col items-center gap-3 mt-5">
    <input
      maxlength="30"
      type="text"
      placeholder="Название задачи"
      class="input input-bordered w-full max-w-xs"
      bind:value={editing.firstName}
    />
    <select class="select select-bordered w-full max-w-xs" bind:value={editing.address}>
      {#each branches as office, i}
        <option value={office.id}>{office.address.address}</option>
      {/each}
    </select>
    <div class=" w-full flex justify-between">
      <span>Приоритет:</span>
      <TaskPriority class="font-medium" value={editing.priority} disabled />
    </div>
    <div class=" w-full flex justify-between">
      <span>Статус:</span>
      <TaskStatus class="font-medium" value={editing.status} disabled />
    </div>
    <input
      maxlength="30"
      type="text"
      placeholder="Email"
      class="input input-bordered w-full max-w-xs"
      bind:value={editing.email}
    />
    <select class="select select-bordered w-full max-w-xs" bind:value={editing.level}>
      {#each grades as grade, i}
        <option value={i}>{grade}</option>
      {/each}
    </select>
  </form>
  <div class="modal-action">
    <form method="dialog">
      <!-- if there is a button in form, it will close the modal -->
      <button class="btn btn-primary mr-4" on:click={saveEdited}>Сохранить</button>
      <button class="btn">Отмена</button>
    </form>
  </div>
</Modal>

<div class="m-auto w-full xl:w-3/4 h-full flex flex-col items-center">
  <div class="flex w-full justify-between items-center px-3">
    <h2 class="font-bold text-2xl">Задачи</h2>
    <button on:click={startCreating} class="my-2 self-end btn btn-primary !font-bold">
      <Icon icon="ph:user" width="20" /> Создать</button
    >
  </div>
  <div class="w-full overflow-x-auto">
    <table class="table table-xs md:table-md table-pin-rows table-pin-cols border-1">
      <thead class="text-md">
        <tr>
          <th />
          <td>Название задачи</td>
          <td>Офис</td>
          <td>Приоритет</td>
          <td>Статус</td>
          <td>Дата создания</td>
          <th>Грейд</th>
        </tr>
      </thead>
      <tbody>
        {#each tasks as task, i}
          <tr
            class="cursor-pointer transition-color hover:bg-base-200"
            on:click={() => startEditing(i)}
          >
            <!-- <tr class="cursor-pointer transition-color hover:bg-base-200" on:click={() => showModal = true}> -->
            <th>{i + 1}</th>
            <td>{task.task.name}</td>
            <td>{task.branch.address}</td>
            <td><TaskPriority class="font-medium" value={task.priority} disabled /></td>
            <td><TaskStatus class="font-medium" value={task.status} disabled /></td>
            <td>
              <span class="justify-end">{dayjs(task.created).format('HH:mm DD/MM/YY')}</span>
            </td>
            <!-- <td>{address}</td>
            <td>{email}</td>
            <td>{firstName}</td>
            <td>{lastName}</td>
            <td>{fatherName}</td>
            <td class="font-bold">{grades[level]}</td> -->
            <td>
              <button class="w-[16px]">
                <Icon icon="ph:pencil-line" width="15" />
              </button>
            </td>
            <td>
              <button
                class="w-[16px] text-error hover:text-error/60"
                on:click|stopPropagation={() => deleteEmployee(i)}
              >
                <Icon icon="ph:trash" width="15" />
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
