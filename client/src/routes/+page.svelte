<!--h1 class="text-3xl font-bold underline">Hello world!</h1-->
<script>
    import Menu from "$lib/components/Menu.svelte";
    import TopicInfoLine from "$lib/components/TopicInfoLine.svelte";
    import { timeDifference, timeFormat } from "$lib/utils.js";
    import { getContext } from "svelte";

    const instance = getContext("instance");
    const { data } = $props();
    const topics = $derived(data.topics || []);
    const pageId = $state("latest");
</script>

<Menu {pageId} session={data.session} />

{#if data}
    <table class="w-full table baseTable">
        <thead>
            <tr>
                <th>Topic</th>
                <th></th>
                <th class="center">Replies</th>
                <th class="center hidden md:table-cell">Views</th>
                <th class="center">Activity</th>
            </tr>
        </thead>
        <tbody>
            {#each data.topics.map((t) => {
                t.category = instance.categories.find((c) => c.id === t.categoryId);
                return t;
            }) as topic}
                <tr>
                    <td>
                        <div class="text-lg">
                            <a href="/t/{topic.id}">{topic.title}</a>
                        </div>
                        <TopicInfoLine {topic} />
                    </td>
                    <td>
                        <div class="flex gap-1">
                            {#if topic.author}
                                <div class="w-6 h-6 aspect-square">
                                    <img
                                        src={topic.author.avatar}
                                        class="rounded-full"
                                    />
                                </div>
                            {/if}
                            {#if topic.authors}
                                {#each topic.authors as author}
                                    <div class="w-6 h-6 aspect-square">
                                        <img
                                            src={author.img}
                                            class="rounded-full"
                                        />
                                    </div>
                                {/each}
                            {/if}
                        </div>
                    </td>
                    <td class="font-semibold text-gray-500 text-center">
                        {topic.repliesCount}
                    </td>
                    <td class="text-gray-500 text-center hidden md:table-cell">
                        {topic.viewCount}
                    </td>
                    <td
                        class="text-gray-500 text-center"
                        title={timeFormat(topic.lastActivity)}
                    >
                        {timeDifference(topic.lastActivity)}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}

<style lang="postcss">
</style>
