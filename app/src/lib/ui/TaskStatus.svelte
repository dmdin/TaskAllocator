<script lang="ts">
  export let value = '';
  export let disabled = false;

  const status = {
    '0': { title: 'Назначена', colors: 'bg-info text-info-content' },
    '1': { title: 'В работе', colors: 'bg-warning text-warning-content' },
    '2': { title: 'Завершена', colors: 'bg-success text-success-content' }
  };
</script>

<select
  {disabled}
  class="{$$props.class} ml-2 font-bold rounded-xl px-3 py-1 pr-2 {status[value].colors}"
  bind:value
  on:change
>
  {#each Object.entries(status) as [index, s]}
    <option value={index}>{s.title}</option>
  {/each}
</select>
