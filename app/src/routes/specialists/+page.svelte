<script lang="ts">
  import { initClient } from '$lib/chord';
  import Icon from '@iconify/svelte';

  import { onMount } from 'svelte';
  import type { ISpecialistRPC, ISpecialistModel, Wrapped } from './types';
  import Modal from '$lib/ui/Modal.svelte';

  export let data;
  const { schema } = data;

  const rpc = initClient<Wrapped>(schema);
  onMount(async () => {
    employees = await rpc.SpecialistRPC.getAll({ count: 100, offset: 0 });
    branches = await rpc.BranchRPC.getAll({ count: 100, offset: 0 });
  });

  let employees = [];
  let branches = [];
  const grades = ['Jun 🐣', 'Mid 🧑‍💻', ' Sen 🧙‍♂️'];

  let editingIndex = 0;

  let employeeTemplate = {
    id: undefined,
    email: '',
    firstName: '',
    lastName: '',
    fatherName: '',
    level: 0,
    address: '654aa113bff6a11489a510f5'
  } as ISpecialistModel;
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
  <form class="flex flex-col items-center gap-3 mt-5">
    <input
      maxlength="30"
      type="text"
      placeholder="Имя"
      class="input input-bordered w-full max-w-xs"
      bind:value={editing.firstName}
    />
    <input
      maxlength="30"
      type="text"
      placeholder="Фамилия"
      class="input input-bordered w-full max-w-xs"
      bind:value={editing.lastName}
    />
    <input
      maxlength="30"
      type="text"
      placeholder="Отчество"
      class="input input-bordered w-full max-w-xs"
      bind:value={editing.fatherName}
    />
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

    <select class="select select-bordered w-full max-w-xs" bind:value={editing.address}>
      {#each branches as office, i}
        <option value={office.id}>{office.address.address}</option>
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
  <h2 class="font-bold text-2xl">Сотрудники</h2>
  <button on:click={startCreating} class="my-2 self-end btn btn-primary !font-bold">
    <Icon icon="ph:user" width="20" /> Создать</button
  >
  </div>
  <div class="w-full overflow-x-auto">
    <table class="table table-xs md:table-md table-pin-rows table-pin-cols border-1">
      <thead class="text-xl">
        <tr>
          <th />
          <td>Адрес</td>
          <td>Почта</td>
          <td>Имя</td>
          <td>Фамилия</td>
          <td>Отчество</td>
          <th>Грейд</th>
        </tr>
      </thead>
      <tbody>
        {#each employees as { address, email, fatherName, firstName, id, lastName, level }, i}
          <tr
            class="cursor-pointer transition-color hover:bg-base-200"
            on:click={() => startEditing(i)}
          >
            <!-- <tr class="cursor-pointer transition-color hover:bg-base-200" on:click={() => showModal = true}> -->
            <th>{i + 1}</th>
            <td>{address}</td>
            <td>{email}</td>
            <td>{firstName}</td>
            <td>{lastName}</td>
            <td>{fatherName}</td>
            <td class="font-bold">{grades[level]}</td>
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
