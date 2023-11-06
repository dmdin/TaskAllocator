<script lang="ts">
  import {initClient} from '$lib/chord'
  import axios from 'axios'
  import {onMount} from 'svelte'
  import type {Wrapped, Unwrapped} from './types'

  export let data;
  const {schema} = data;

  onMount(async () => {
    const rpc = initClient<Unwrapped>(schema)
    // console.log(await rpc.TestRPC.dbReq(123))
    // console.log(await rpc.TestRPC2.dbReq3('dbreq3'))
  //   console.log(await rpc.dbReq(123))
  //   console.log(await rpc.dbReq2('world'))
    console.log(await rpc.dbReq3('third', 123))
    console.log(await rpc.dbReq(123))
  })

</script>
