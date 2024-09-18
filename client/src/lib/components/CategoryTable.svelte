<script>
    const { categories } = $props();
</script>

<div>
    <table class="table baseTable w-full">
        <thead>
            <tr>
                <th>Category</th>
                <th class="right">Topics</th>
            </tr>
        </thead>
        <tbody>
            {#each categories as cat}
                <tr>
                    <td class="border-l-4" style="border-color: {cat.color}">
                        <div class="text-xl font-bold mb-1">
                            <a href="/c/{cat.id}">{cat.title}</a>
                        </div>
                        <div>{cat.description}</div>
                    </td>
                    <td class="text-right text-lg font-bold text-gray-500"
                        >55</td
                    >
                </tr>
            {/each}
        </tbody>
    </table>
</div>
