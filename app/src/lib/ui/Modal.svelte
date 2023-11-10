<script>
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  export let title = 'Hello!';
  export let id = 'my_modal_8';
  const dispatch = createEventDispatcher();
</script>

<!-- {#if show} -->
<dialog {id} class="modal modal-bottom sm:modal-middle">
  <div class="modal-box border border-primary">
    <h3 class="font-bold text-lg">{title}</h3>
    <slot />
  </div>
</dialog>
<!-- {/if} -->
