<script>
    import { marked } from "marked";
    import TopicInfoLine from "$lib/components/TopicInfoLine.svelte";
    import { getContext } from "svelte";
    import { timeDifference, timeFormat } from "$lib/utils.js";
    import { Heart, Link, Bookmark, ArrowUturnLeft, Trash } from "svelte-heros-v2";
    import { apiCallPost } from "$lib/api.js";
    import { goto } from "$app/navigation";

    const { categories, admins } = getContext('instance');
    const session = getContext('session');
    const composer = getContext('composer');

    const { data } = $props();
    const topic = $derived(data.topic);
    const category = $derived(
        categories.find((c) => c.id === topic.categoryId),
    );

    function reply () {
        composer.config = { enabled: true, type: 'reply', topic };
        console.log(composer.config);
    }

    async function removePost (post) {
        let resp;
        if (post.title) {
            // topic
        } else {
            resp = await apiCallPost({ fetch }, 'deleteReply', {
                id: post.id
            })
        }
        if (resp) {
            goto(resp.url, { invalidateAll: true })
        }
    }

    function canRemove(post) {
        if (session.did === post.authorDid) {
            return true
        }
        return false
    }

</script>

{#snippet post(p)}
    <div class="mt-4 pt-4 border-t w-full">
        <div class="flex gap-2">
            <div class="w-12 shrink-0">
                <img class="rounded-full aspect-square" src="{p.author?.avatar}" />
            </div>
            <div class="w-full pr-2">
                <div class="flex w-full gap-2">
                    <div class="font-bold mb-3 text-gray-600 grow"><a href="https://bsky.app/profile/{p.author?.handle}">{p.author?.displayName}</a> <span class="text-gray-400 font-normal">@{p.author.handle}</span></div>
                    <div class="text-gray-500" title={timeFormat(p.createdAt)}>{timeDifference(p.createdAt)}</div>
                </div>
                <div class="">
                    {@html marked.parse(p.text)}
                </div>
                <div class="mt-6 flex gap-2">
                    <div class="grow"></div>
                    <div class="flex gap-2 items-center">
                        {#if session}
                            <button class="button transparent"><Heart color="rgb(156 163 175)" size="1.3em" strokeWidth="0.12em" /></button>
                            <a href={p.url}><button class="button transparent"><Link color="rgb(156 163 175)" size="1.3em" strokeWidth="0.12em"  /></button></a>
                            <button class="button transparent"><Bookmark color="rgb(156 163 175)" size="1.3em" strokeWidth="0.12em" /></button>
                            {#if canRemove(p)}
                                <button class="button transparent" onclick={() => removePost(p)}><Trash color="rgb(156 163 175)" size="1.3em" strokeWidth="0.12em" /></button>
                            {/if}
                            <button class="button transparent text-lg" onclick={reply}><ArrowUturnLeft size="1em" color="rgb(156 163 175)" strokeWidth="0.15em"/> Reply</button>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
{/snippet}

<div>
    <h1 class="text-2xl font-bold">{topic.title}</h1>
    <div class="mt-1">
        <TopicInfoLine {topic} />
    </div>
    <div>
        {@render post(topic)}
        {#each topic.replies as reply}
            {@render post(reply)}
        {/each}
    </div>
</div>
