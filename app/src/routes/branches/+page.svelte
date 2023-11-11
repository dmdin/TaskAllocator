<script lang="ts">
  import { initClient } from '$lib/chord';
  import { onMount } from 'svelte';
  import type { IBranchRPC, Wrapped } from './types';
  import Modal from '$lib/ui/Modal.svelte';
  import { ConnectionDate, type IBranchModel } from '$lib/models/IBranchModel';
  import type { BranchRPC } from './+server';
  import Icon from '@iconify/svelte';


  export let data;
  const { schema } = data;
  const rpc = initClient<Wrapped>(schema);

  onMount(async () => {
    // console.log(await rpc.TestRPC.dbReq(123))
    // console.log(await rpc.TestRPC2.dbReq3('dbreq3'))
    //   console.log(await rpc.dbReq(123))
    //   console.log(await rpc.dbReq2('world'))
    console.log(rpc);
    branches = await rpc.BranchRPC.getAll({ count: 100, offset: 0 });
    console.log(branches);
  });

  let branches: IBranchModel[] = [];

  let editingIndex = 0;

  let branchTemplate = {
    id: undefined,
    address: {
      latitude: 123,
      longitude: 321,
      address: ''
    },
    connectionDate: ConnectionDate.LongAgo,
    cardMaterialsDelivered: false,
    lastCardIssuanceDays: 0,
    approvedIssuesNumber: 0,
    issuanceCardCount: 0,
    is_office: false
  } as IBranchModel;
  let editing = { ...branchTemplate };

  async function saveEdited() {
    let updated ;
    console.log(editing);
    if (editing.id) {
      updated = await rpc.BranchRPC.update(editing);
      console.log(updated)
      branches[editingIndex] = updated;
    } else {
      updated = await rpc.BranchRPC.create(editing);
      console.log(updated)
      branches = branches.concat(updated);
    }
  }

  function startEditing(index) {
    console.log("startEditing", branches[index].cardMaterialsDelivered)
    create_modal?.show();
    editingIndex = index;
    editing = branches[index];
    editing.level = Number(editing.level);
  }

  function startCreating() {
    create_modal?.show();
    editing = { ...branchTemplate };
  }

  let deleteIndex;
  function deleteEmployee(index) {
    console.log("deleteEmployee", index)
    delete_modal?.show();
    deleteIndex = index;
  }

  async function confirmDelete() {
    await rpc.BranchRPC.delete(branches[deleteIndex].id);
    branches.splice(deleteIndex, 1);
    branches = branches;
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
      placeholder="Адрес"
      class="input input-bordered w-full max-w-xs"
      bind:value={editing.address.address}
    />

    <select class="select select-bordered w-full max-w-xs" bind:value={editing.is_office}>
      <option value={false}>Отделение</option>
      <option value={true}>Офис</option>
    </select>
    
    <select class="select select-bordered w-full max-w-xs" bind:value={editing.connectionDate}>
      <option value={0}>Вчера</option>
      <option value={1}>Давно</option>
    </select>

    <select class="select select-bordered w-full max-w-xs" bind:value={editing.cardMaterialsDelivered}>
      <option value={0}>Нет</option>
      <option value={1}>Да</option>
    </select>

    <input
      maxlength="30"
      type="text"
      placeholder="Дней с выдачи последней карты"
      class="input input-bordered w-full max-w-xs"
      bind:value={editing.lastCardIssuanceDays}
    />

    <input
      maxlength="30"
      type="text"
      placeholder="Одобренные заявки"
      class="input input-bordered w-full max-w-xs"
      bind:value={editing.approvedIssuesNumber}
    />

    <input
      maxlength="30"
      type="text"
      placeholder="Кол-во выданных карт"
      class="input input-bordered w-full max-w-xs"
      bind:value={editing.issuanceCardCount}
    />
  </form>
  <div class="modal-action">
    <form method="dialog">
      <button class="btn btn-primary mr-4" on:click={saveEdited}>Сохранить</button>
      <button class="btn">Отмена</button>
    </form>
  </div>
</Modal>

<div class="m-auto w-3/4 h-full flex flex-col items-center justify-center">
  <button on:click={startCreating} class="my-2 self-end btn btn-primary !font-bold">
     Создать</button
  >
  <div class="w-full overflow-x-auto">
    <table class="table table-md table-pin-rows table-pin-cols border-1">
      <thead class="text-xs">
        <tr>
          <th class="max-w-[120px] truncate" title=""/>
          <td class="max-w-[120px] truncate" title="Адрес">Адрес</td>
          <td class="max-w-[120px] truncate" title="Тип">Тип</td>
          <td class="max-w-[120px] truncate" title="Дата подключения">Дата подключения</td>
          <td class="max-w-[120px] truncate" title="Карты и материал имеются">Карты и материал имеются</td>
          <td class="max-w-[120px] truncate" title="Дней с выдачи последней карты">Дней с выдачи последней карты</td>
          <th class="max-w-[120px] truncate" title="Одобренные заявки">Одобренные заявки</th>
          <th class="max-w-[120px] truncate" title="Кол-во выданных карт">Кол-во выданных карт</th>
        </tr>
      </thead>
      <tbody>
        {#each branches as { address, connectionDate, cardMaterialsDelivered, lastCardIssuanceDays, approvedIssuesNumber, issuanceCardCount, is_office }, i}
          <tr
            class="cursor-pointer transition-color hover:bg-base-200"
            on:click={() => startEditing(i)}
          >
            <!-- <tr class="cursor-pointer transition-color hover:bg-base-200" on:click={() => showModal = true}> -->
            <th>{i + 1}</th>
            <td>{address.address}</td>
            <td>{['Отделение','Офис'][+is_office]}</td>
            <td>{['Вчера', 'Давно'][+connectionDate]}</td>
            <td>{['Нет', 'Да'][+cardMaterialsDelivered]}</td>
            <td>{lastCardIssuanceDays}</td>
            <td>{issuanceCardCount}</td>
            <td>{approvedIssuesNumber}</td>
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
