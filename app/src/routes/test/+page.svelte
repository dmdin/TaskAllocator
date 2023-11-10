<script lang="ts">
  import { initClient } from '$lib/chord/dev';
  import axios from 'axios';
  import { onMount } from 'svelte';
  import type { Wrapped, Unwrapped } from './types';

  export let data;

  const { schema } = data;
  onMount(async () => {
    const client = initClient<Wrapped>(schema);
    console.log('TestRPC2', await client.TestRPC2.dbReq(123));
    console.log('TestRPC', await client.TestRPC.dbReq(123));
  });
</script>

<h1 class="text-sm text-primary">Test Endpoint</h1>
<button class="btn btn-primary">Hello</button>
