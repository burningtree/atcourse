<script>
    import { marked } from "marked";
    import { Heart, Link, Bookmark, ArrowUturnLeft, Trash } from "svelte-heros-v2";
    import { getContext } from "svelte";
    import { goto } from "$app/navigation";

    import { timeDifference, timeFormat } from "$lib/utils.js";
    import { apiCallPost } from "$lib/api.js";
    import TopicInfoLine from "$lib/components/TopicInfoLine.svelte";
    import UserAvatar from "$lib/components/UserAvatar.svelte";

    const { record: { categories }, admins, name: instanceName } = getContext('instance');
    const session = getContext('session');
    const composer = getContext('composer');

    const { data } = $props();
    const topic = $derived(data.topic);
    topic.category = categories?.find((c) => c.id === topic.categoryId)

    function reply () {
        composer.config = { enabled: true, type: 'reply', topic };
        console.log(composer.config);
    }

    async function removePost (post) {
        let resp;
        if (post.title) {
            resp = await apiCallPost({ fetch }, 'deleteTopic', {
                id: post.id
            })
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

<svelte:head>
    <title>{topic.title} #{topic.id} | {instanceName}</title>
</svelte:head>

{#snippet post(p)}
    <div class="pt-4 border-t w-full">
        <div class="flex gap-2">
            <UserAvatar actor={p.author} size="w-12 h-12" />
            <div class="w-full pr-2">
                <div class="flex w-full gap-2">
                    <div class="font-bold mb-3 text-gray-600 grow">
                        <a href="https://bsky.app/profile/{p.author?.handle}">{p.author?.displayName || p.author.handle}</a>
                        <span class="text-gray-400 font-normal">@{p.author.handle}</span>
                    </div>
                    <div class="text-gray-500" title={timeFormat(p.createdAt)}>{timeDifference(p.createdAt)}</div>
                </div>
                <div class="">
                    {@html marked.parse(p.text)}
                </div>
                <div class="mt-4 mb-4 flex gap-2 items-center">
                    <a target="_blank" href="https://atproto-browser.vercel.app/at/{p.recordUri.replace("at://", '')}" class="text-gray-400 text-sm font-normal">[{p.rkey || 'n/a'}]</a>
                    <div class="grow"></div>
                    <div class="flex gap-2 items-center">
                        {#if session}
                            <button class="button transparent"><Heart color="rgb(156 163 175)" size="1.3em" strokeWidth="0.12em" /></button>
                            <a href={p.url}><button class="button transparent"><Link color="rgb(156 163 175)" size="1.3em" strokeWidth="0.12em"  /></button></a>
                            <button class="button transparent"><Bookmark color="rgb(156 163 175)" size="1.3em" strokeWidth="0.12em" /></button>
                            {#if canRemove(p)}
                                <button class="button transparent" onclick={() => removePost(p)}><Trash color="rgb(156 163 175)" size="1.3em" strokeWidth="0.12em" /></button>
                            {/if}
                            <!--<button class="button transparent text-lg" onclick={reply}><ArrowUturnLeft size="1em" color="rgb(156 163 175)" strokeWidth="0.15em"/> Reply</button>-->
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
{/snippet}

<div>
    <h1 class="text-2xl font-bold">{topic.title} <span class="font-normal text-gray-500 text-lg">#{topic.id.toString(16)}</span></h1>
    <div class="mt-1">
        <TopicInfoLine {topic} />
    </div>
    <div class="pt-2">
        {@render post(topic)}
        {#each topic.replies as reply}
            {@render post(reply)}
        {/each}
    </div>
    <div class="border-t pt-4">
        <button class="button text-lg" onclick={reply}><ArrowUturnLeft size="1em" color="white" strokeWidth="0.15em"/> Reply</button>
    </div>
</div>
