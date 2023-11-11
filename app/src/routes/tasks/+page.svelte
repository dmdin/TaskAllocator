<script lang="ts">
  import { initClient } from '$lib/chord';
  import Icon from '@iconify/svelte';

  import { onMount } from 'svelte';
  import type { Wrapped } from './types';
  import Modal from '$lib/ui/Modal.svelte';

  export let data;
  const { schema } = data;

  const rpc = initClient<Wrapped>(schema);
  onMount(async () => {
    let tasks = await rpc.TaskAssignRPC.getForManager(false);
    console.log(tasks)
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

