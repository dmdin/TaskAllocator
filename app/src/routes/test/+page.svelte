<script lang="ts">
  import {initClient} from '$lib/chord'
  import axios from 'axios'
  import {onMount} from 'svelte'
  import type {ITestRPC} from './types'

  onMount(async () => {
    const schema = await axios.get('/test').then(r => r.data)
    const client = initClient<ITestRPC>(schema)
    console.log(await client.dbReq(123))
  })

</script>

<h1 class="text-sm text-primary">Test Endpoint</h1>
<button class="btn btn-primary">Hello</button>