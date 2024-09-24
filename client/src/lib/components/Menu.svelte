<script>
    import { ArrowRight, Plus } from "svelte-heros-v2";
    import { getContext } from "svelte";

    const { pageId, session } = $props();
    const composer = getContext("composer");

    const menu = [
        ["latest", "Latest", "/"],
        ["categories", "Categories", "/categories"],
        ["top", "Top", "/top"],
    ];

    function openComposer() {
        composer.config = { enabled: true };
        console.log($state.snapshot(composer.config));
    }
</script>

<div class="flex flex-wrap gap-2 mb-4">
    <div class="flex gap-2">
        <div class="px-3 py-1 border border-gray-500 flex gap-2 items-center">
            categories <ArrowRight size="1em" />
        </div>
        <div class="px-3 py-1 border border-gray-500 flex gap-2 items-center">
            tags <ArrowRight size="1em" />
        </div>
    </div>
    <div class="flex gap-2 grow">
        {#each menu as [catId, title, url]}
            <div
                class={pageId === catId
                    ? "border-b-2 border-b-blue-500 text-blue-500"
                    : ""}
            >
                <a class="px-3 py-1 block" href={url}>{title}</a>
            </div>
        {/each}
    </div>
    {#if session}
        <div>
            <button class="button" onclick={openComposer}
                ><Plus size="1em" /> Create topic</button
            >
        </div>
    {/if}
</div>
