<script>
    import "../app.css";
    import { MagnifyingGlass, Bars3, User, Plus } from "svelte-heros-v2";
    import { setContext } from "svelte";

    import Composer from "$lib/components/Composer.svelte";
    import UserAvatar from "$lib/components/UserAvatar.svelte";

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

    const profileStore = (function () {
        let items = $state({});
        let loading = $state({});
        return {
            get items() {
                return items;
            },
            set items(value) {
                items = value;
            },
            get loading() {
                return loading;
            },
            set loading(value) {
                loading = value;
            },
        };
    })();

    setContext("composer", composer);
    setContext("instance", instance);
    setContext("session", session);
    setContext("profileStore", profileStore);
</script>

<svelte:head>
    <title>{instance.name}</title>
</svelte:head>

{#if composer.config}
    <Composer {composer} />
{/if}

<div class="w-full border-b bg-gray-100 sticky top-0 z-10">
    <div class="max-w-screen-lg mx-auto p-2 flex items-center">
        <div class="flex gap-2 ml-1 items-center">
            <div>
                <a href="/"
                    ><UserAvatar
                        actor={instance.did}
                        type="square"
                        size="w-8 h-8"
                    /></a
                >
            </div>
            <div class="text-2xl font-semibold text-blue-500">
                <a href="/">{instance.name}</a>
            </div>
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
                <UserAvatar actor={data.session.did} size="w-8 h-8" />
            {/if}
        </div>
    </div>
</div>

<div class="w-full">
    <div class="max-w-screen-lg mx-auto p-3 mt-2">
        <slot />

        <div class="mt-10 text-sm">
            Powered by <a
                href="https://github.com/burningtree/atpbb"
                class="underline hover:no-underline">@atcourse.app</a
            >
            (v{instance.version}) -
            <a href="/about" class="underline hover:no-underline"
                >About this forum</a
            >
        </div>
    </div>
</div>

<style lang="postcss">
    :global(html) {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Liberation Sans", Helvetica, Arial, sans-serif;
        /*background-color: theme(colors.gray.100);*/
        color: #222222;
    }
</style>
