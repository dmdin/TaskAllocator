<script lang="ts">
  import { initClient } from '$lib/chord';
  import axios from 'axios';
  import { onMount } from 'svelte';
  import type { Wrapped, Unwrapped } from './types';
    import { writable } from 'svelte/store';

  export let data;

  const { schema } = data;
  const error = writable()

  function catchError(e, m) {
    $error = e.message
  }

  onMount(async () => {
    const client = initClient<Wrapped>(schema);
    console.log('TestRPC2', await client.TestRPC2.dbReq(123));
    console.log('TestRPC', await client.TestRPC.dbReq(123));
  });
</script>

<h1 class="text-sm text-primary">Test Endpoint</h1>
<button class="btn btn-primary">Hello</button>
<span class="bg-error">{$error}</span>