<script lang="ts">
  import { goto, invalidateAll } from '$app/navigation';
  import { supabaseClient } from '$lib/supabase';
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import Logo from '$lib/ui/Logo.svelte';
  import { theme } from '$lib/stores';

  import '../app.postcss';
  export let data;

  onMount(async () => {
    // console.log('session', await supabaseClient.auth.getUser())
    
    const {
      data: { subscription }
    } = supabaseClient.auth.onAuthStateChange(() => {
      invalidateAll();
    });

    // console.log('auth', subscription);
    return () => {
      subscription.unsubscribe();
    };
  });

</script>

<div class="w-full h-full bg-base-100" data-theme={$theme}>
  <header class="navbar bg-base-100 sticky z-10 top-0">
    
      <div class="navbar-start">
        {#if !data.email && data.session}
          <div class="dropdown">
            <label tabindex="0" class="btn btn-ghost lg:hidden w-[70px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                /></svg
              >
            </label>
            <ul
              tabindex="0"
              class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li><a data-sveltekit-preload-data="hover" href="/specialists">Сотрудники</a></li>
              <li><a data-sveltekit-preload-data="hover" href="/tasks">Задачи</a></li>
              <li><a data-sveltekit-preload-data="hover" href="/branches">Офисы</a></li>
              <li><a data-sveltekit-preload-data="hover" href="/taskAssigns">Текущие задачи</a></li>
            </ul>
          </div>
        {/if}
        <a class="btn-ghost w-auto normal-case text-xl">
          <Logo class="w-[70px] md:w-[150px]" />
        </a>
      </div>
      {#if !data.email && data.session}
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <li><a data-sveltekit-preload-data="hover" href="/specialists">Сотрудники</a></li>
          <li><a data-sveltekit-preload-data="hover" href="/tasks">Задачи</a></li>
          <li><a data-sveltekit-preload-data="hover" href="/branches">Офисы</a></li>
          <li><a data-sveltekit-preload-data="hover" href="/taskAssigns">Текущие задачи</a></li>
        </ul>
      </div>
      {/if}
    <div class="navbar-end">
      <button
        class="btn btn-sm btn-circle mr-4"
        on:click={() => ($theme = $theme === 'light' ? 'dark' : 'light')}
      >
        {#if $theme === 'light'}
          <Icon icon="ph:sun-fill" />
        {:else}
          <Icon icon="ph:moon-fill" />
        {/if}
      </button>
      {#if data.session || data.email}
        <button on:click={() => {goto('/logout')}} class="btn btn-sm mr-2"
          ><Icon icon="mingcute:exit-line" />
          Выйти
        </button>
      {:else}
        <button on:click={() => goto('/login')} class="btn btn-sm mr-2"
          ><Icon icon="mingcute:exit-line" />
          Войти
        </button>
      {/if}
    </div>
  </header>

  <main class="bg-base-100 w-full min-h-[90%] p-2 md:mt-[40px]">
    <slot />
  </main>
</div>
