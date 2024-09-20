<script>
    let { topic } = $props();
</script>

<div class="flex flex-wrap gap-2 text-sm text-gray-500">
    <div class="text-nowrap">
        <a href="/c/{topic.categoryId}"
            ><span
                class="w-2.5 h-2.5 inline-block"
                style="background-color: {topic.category?.color || '#d1d5db'}"
            ></span>
            {topic.category?.title || "Uncategorized"}</a
        >
    </div>
    <div class="flex flex-wrap gap-2">
        {#each topic.tags as tag}
            <div class="text-nowrap">
                <span class="w-2.5 h-2.5 inline-block bg-gray-300"></span>
                {tag}
            </div>
        {/each}
    </div>
</div>
