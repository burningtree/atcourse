<!--h1 class="text-3xl font-bold underline">Hello world!</h1-->
<script>
    import { categories } from "$lib/config.json";
    import Menu from "$lib/components/Menu.svelte";

    const { data } = $props();
    const topics = $derived(data.topics || []);
    const pageId = $state("latest");

    /*const topics = [
        {
            id: "xxxyyy1",
            title: "Decentralized Anti-MEV sequencer based on Order-Fairness Byzantine Fault-Tolerant (BFT) consensus",
            authors: [
                {
                    img: "https://cdn.bsky.app/img/avatar/plain/did:plc:524tuhdhh3m7li5gycdn6boe/bafkreicv3nbfw5bqg3uxm6nid4fghif3cp6ne4fu635bvxc4otusovd5vm@jpeg",
                },
                {
                    img: "https://cdn.bsky.app/img/avatar_thumbnail/plain/did:plc:oio4hkxaop4ao4wz2pp3f4cr/bafkreibsqivteivghabvdrwxfhrzbl4iqao24eneha53a4mu3g4k57f7py@jpeg",
                },
            ],
            repliesCount: 2,
            viewsCount: 50,
            lastActivity: "9h",
            categoryId: "layer2",
            tags: ["mev", "rollup"],
        },
        {
            id: "xxxyyy2",
            title: "Decentralized and Verifiable Cloud Service on Ethereum",
            authors: [
                {
                    img: "https://cdn.bsky.app/img/avatar/plain/did:plc:524tuhdhh3m7li5gycdn6boe/bafkreicv3nbfw5bqg3uxm6nid4fghif3cp6ne4fu635bvxc4otusovd5vm@jpeg",
                },
            ],
            repliesCount: 0,
            viewsCount: 31,
            lastActivity: "5d",
            categoryId: "sharding",
            tags: ["data-availability", "p2p", "scaling"],
        },
    ];*/
</script>

<Menu {pageId} />

{#if data}
    <table class="w-full table baseTable">
        <thead>
            <tr>
                <th>Topic</th>
                <th></th>
                <th class="center">Replies</th>
                <th class="center">Views</th>
                <th>Activity</th>
            </tr>
        </thead>
        <tbody>
            {#each data.topics.map((t) => {
                t.category = categories.find((c) => c.id === t.categoryId);
                return t;
            }) as topic}
                <tr>
                    <td>
                        <div class="text-lg">
                            <a href="/t/{topic.id}">{topic.title}</a>
                        </div>
                        <div class="flex gap-2 text-sm text-gray-500">
                            <div class="">
                                <a href="/c/{topic.categoryId}"
                                    ><span
                                        class="w-2.5 h-2.5 inline-block"
                                        style="background-color: {topic.category
                                            .color}"
                                    ></span>
                                    {topic.category.title}</a
                                >
                            </div>
                            <div class="flex gap-2">
                                {#each topic.tags as tag}
                                    <div>
                                        <span
                                            class="w-2.5 h-2.5 inline-block bg-gray-300"
                                        ></span>
                                        {tag}
                                    </div>
                                {/each}
                            </div>
                        </div>
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
                    <td class="text-gray-500 text-center">
                        {topic.viewCount}
                    </td>
                    <td class="text-gray-500 text-center">
                        {topic.lastActivity}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}

<style lang="postcss">
</style>
