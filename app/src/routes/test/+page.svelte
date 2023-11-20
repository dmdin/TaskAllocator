<script lang="ts">
  import { initClient } from '$lib/chord';
  import axios from 'axios';
  import { onMount } from 'svelte';
  import type { Wrapped, Unwrapped } from './types';
  import { writable } from 'svelte/store';

  export let data;

  const { schema } = data;
  const error = writable();

  function catchError(e, m) {
    $error = e.message;
  }

  onMount(async () => {
    const rpc = initClient<Wrapped>(schema, { onError: catchError });

    // console.log('TestRPC2', await rpc.TestRPC2.dbReq(123));
    // console.log('TestRPC', await rpc.TestRPC.dbReq(123));
    // console.log(
    //   'Batch execution',
    //   await rpc.batch(
    //     rpc.b.TestRPC2.dbReq(123),
    //     rpc.b.TestRPC.dbReq(123)
    //   )
    // );

    rpc.batch(
      rpc.b.TestRPC2.dbReq(123), 
      rpc.b.TestRPC.dbReq(123)
    ); // Batch запрос
    
    rpc.TestRPC2.dbReq(123) // просто запрос

    // ------------- или --------------------

    rpc.batch(
      rpc.TestRPC2.dbReq(123), 
      rpc.TestRPC.dbReq(123)
    ); // Batch запрос
    
    rpc.TestRPC2.dbReq(123)() // просто запрос

    
  });
</script>

<h1 class="text-sm text-primary">Test Endpoint</h1>
<button class="btn btn-primary">Hello</button>
<span class="bg-error">{$error}</span>
