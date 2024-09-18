<script>
    import { ArrowRight } from "svelte-heros-v2";

    const { pageId } = $props();

    const menu = [
        ["latest", "Latest", "/"],
        ["categories", "Categories", "/categories"],
        ["top", "Top", "/top"],
    ];
</script>

<div class="flex gap-2 mb-4">
    <div class="flex gap-2">
        <div class="px-3 py-1 border border-gray-500 flex gap-2 items-center">
            categories <ArrowRight size="1em" />
        </div>
        <div class="px-3 py-1 border border-gray-500 flex gap-2 items-center">
            tags <ArrowRight size="1em" />
        </div>
    </div>
    <div class="flex gap-2">
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
</div>
