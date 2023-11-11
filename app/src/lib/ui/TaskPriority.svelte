<script lang="ts">
  export let value = ''
  export let disabled = false;

  const priority = {
    '0': { title: 'Низкий', colors: 'bg-info text-info-content' },
    '1': { title: 'Средний', colors: 'bg-warning text-warning-content' },
    '2': { title: 'Высокий', colors: 'bg-error text-error-content' }
  };
</script>

<select
  {disabled}
  class="{$$props.class} ml-2 font-bold rounded-xl px-3 py-1 pr-2 {priority[value].colors}"
  bind:value
  on:change
>
  {#each Object.entries(priority) as [index, p]}
    <option value={index}>{p.title}</option>
  {/each}
</select>
