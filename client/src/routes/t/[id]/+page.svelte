<script>
    import { categories } from "$lib/config.json";
    import { marked } from "marked";

    const { data } = $props();
    const topic = $derived(data.topic);
    const category = $derived(
        categories.find((c) => c.id === topic.categoryId),
    );
</script>

{#snippet post(p)}
    <div class="mt-4 pt-4 border-t w-full">
        <div class="flex gap-2">
            <div class="w-12 shrink-0">
                <img class="rounded-full aspect-square" src="{p.author?.avatar}" />
            </div>
            <div class="w-full pr-2">
                <div class="flex w-full gap-2">
                    <div class="font-bold mb-3 text-gray-600 grow"><a href="https://bsky.app/profile/{p.author?.handle}">{p.author?.displayName}</a></div>
                    <div class="text-gray-500">{p.createdAt}</div>
                </div>
                <div class="">
                    {@html marked.parse(p.text)}
                </div>
            </div>
        </div>
    </div>
{/snippet}

<div>
    <h1 class="text-2xl font-bold">{topic.title}</h1>
    <div class="mt-1">
        <a href="/c/{topic.categoryId}"
            ><span
                class="w-2.5 h-2.5 inline-block"
                style="background-color: {category.color}"
            ></span>
            {category.title}</a
        >
    </div>
    <div>
        {@render post(topic)}
        {#each topic.replies as reply}
            {@render post(reply)}
        {/each}
    </div>
</div>
