<script>
    import { getContext } from "svelte";
    import { UserGroup } from "svelte-heros-v2";
    const { id } = $props();
    const instance = getContext("instance");

    const menu = [
        ["about", "About"],
        ["faq", "FAQ"],
        ["tos", "Terms of Service"],
        ["privacy", "Privacy"],
    ];
</script>

<div class="flex gap-2 mb-10">
    {#each menu as [mid, title]}
        <div>
            <a
                href="/{mid}"
                class="px-3 py-2 {mid === id
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : ''}">{title}</a
            >
        </div>
    {/each}
</div>

{#snippet actorList(title, actors)}
    {#if actors.length > 0}
        <div class="mt-8">
            <h3 class="text-xl font-bold flex gap-1 items-center">
                <UserGroup variation="solid" size="1em" /> {title}
            </h3>
            <div class="mt-4">
                {#each actors as actor}
                    <div class="flex gap-2 items-center mb-4">
                        <div class="w-12 h-12 shrink-0">
                            <img
                                src={actor.avatar}
                                class="aspect-square rounded-full"
                            />
                        </div>
                        <div>
                            <div class="font-bold">{actor.displayName}</div>
                            <div class="text-sm">@{actor.handle}</div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
{/snippet}

<div class="mx-2">
    {#if id === "about"}
        <h2 class="text-2xl font-bold">About {instance.name}</h2>
        <div class="mt-2">{instance.record.description}</div>

        {@render actorList("Our Admins", instance.admins)}
        {@render actorList("Our Moderators", instance.moderators)}
    {/if}
</div>