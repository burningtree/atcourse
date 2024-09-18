<script>
    import "../app.css";
    import { MagnifyingGlass, Bars3, User } from "svelte-heros-v2";
</script>

<div class="w-full border-b">
    <div class="max-w-screen-xl mx-auto p-3 flex">
        <div class="text-2xl font-bold">
            <a href="/">AT Protocol Research</a>
        </div>
        <div class="grow"></div>
        <div class="flex gap-3 items-center">
            <a href="/login"
                ><button
                    class="bg-blue-500 text-white text-sm px-3 py-1 flex gap-1 items-center"
                    ><User variation="solid" size="1.2em" /> Log In</button
                ></a
            >
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
        </div>
    </div>
</div>

<div class="w-full">
    <div class="max-w-screen-xl mx-auto p-3 mt-2">
        <slot />
    </div>
</div>

<style lang="postcss">
    :global(html) {
        background-color: theme(colors.gray.100);

        @apply text-gray-700;
    }
</style>
