<script>
  export let value = "0";
  export let disabled = false;
  const grades = ['Jun 🐣', 'Mid 🧑‍💻', ' Sen 🧙‍♂️'];
</script>

<select {disabled} class="{$$props.class} select select-sm select-bordered w-[90px] max-w-xs" bind:value={value}>
  {#each Object.entries(grades) as [i, grade]}
    <option value={i}>{grade}</option>
  {/each}
</select>