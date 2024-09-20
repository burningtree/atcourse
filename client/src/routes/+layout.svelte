<script>
    import "../app.css";
    import Composer from "$lib/components/Composer.svelte";
    import { MagnifyingGlass, Bars3, User, Plus } from "svelte-heros-v2";
    import { setContext } from "svelte";
    const { data } = $props();
    const session = $derived(data.session);
    const instance = $derived(data.instance);

    const composer = (function () {
        let config = $state(false);
        return {
            get config() {
                return config;
            },
            set config(value) {
                config = value;
            },
        };
    })();
    setContext("composer", composer);
    setContext("instance", instance);
    setContext("session", session);
</script>

{#if composer.config}
    <Composer {composer} />
{/if}

<div class="w-full border-b">
    <div class="max-w-screen-xl mx-auto p-3 flex">
        <div class="text-2xl font-bold">
            <a href="/">{instance.name}</a>
        </div>
        <div class="grow"></div>
        <div class="flex gap-3 items-center">
            {#if !session}
                <a href="/login"
                    ><button
                        class="bg-blue-500 text-white text-sm px-3 py-1 flex gap-1 items-center text-nowrap"
                        ><User variation="solid" size="1.2em" /> Log In</button
                    ></a
                >
            {/if}
            <button
                ><MagnifyingGlass
                    size="1.8em"
                    color="rgb(156 163 175)"
                    strokeWidth="2.5"
                /></button
            >
            <button
                ><Bars3
                    size="1.8em"
                    color="rgb(156 163 175)"
                    strokeWidth="2.5"
                /></button
            >
            {#if session}
                <div class="shrink-0 w-8 h-8">
                    <img
                        src={data.session.profile.avatar}
                        class="aspect-square rounded-full"
                    />
                </div>
            {/if}
        </div>
    </div>
</div>

<div class="w-full">
    <div class="max-w-screen-xl mx-auto p-3 mt-2">
        <slot />

        <div class="mt-10 text-sm">
            Powered by <a
                href="https://github.com/burningtree/atpbb"
                class="underline hover:no-underline">atpbb</a
            >
            -
            <a href="/about" class="underline hover:no-underline"
                >About this forum</a
            >
        </div>
    </div>
</div>

<style lang="postcss">
    :global(html) {
        background-color: theme(colors.gray.100);

        @apply text-gray-700;
    }
</style>
