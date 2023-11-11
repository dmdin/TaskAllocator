<script lang="ts">
  import { enhance, type SubmitFunction } from '$app/forms';
  import { supabaseClient } from '$lib/supabase';
  import type { PageData } from './$types';

  export let data: PageData;

  const submitLogout: SubmitFunction = async ({ cancel }) => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error(error);
    }
    cancel();
  };
</script>

<main>
  <div class="absolute left-0 top-0 flex h-screen w-screen items-center justify-center">
    <div
      class="absolute inset-0 flex items-center justify-center overflow-hidden blur-[10vw] saturate-150"
    >
      <div class="absolute h-full w-full animate-orbit">
        <div class="absolute left-[25%] top-[25%] w-[50%] rounded-full bg-sky-500 pb-[50%]" />
      </div>
      <div class="animate-orbit2 absolute h-1/2 w-full">
        <div class="absolute left-[25%] top-[20%] w-[40%] rounded-full bg-fuchsia-500 pb-[40%]" />
      </div>
      <div class="animate-orbit3 absolute h-full w-full">
        <div class="absolute left-[30%] top-[50%] w-[30%] rounded-full bg-cyan-400 pb-[30%]" />
      </div>
      <div class="animate-orbit4 absolute h-full w-1/2">
        <div class="absolute left-[25%] top-[25%] w-[30%] rounded-full bg-white pb-[30%]" />
      </div>
    </div>
    <div class="relative flex flex-col items-center">
      <h1 class="text-5xl font-bold ">Добро пожаловать в TaskAllocator</h1>
      <p class="mt-2 text-2xl">Разработано командой <u>AI Knowledge Club</u></p>
      <a class="btn btn-outline rounded-full px-10 mt-4 font-bold btn-xl" href="/tasks">Приступить</a>
    </div>
  </div>
</main>
