<script>
    import { marked } from "marked";
    import { Heart, Link, Bookmark, ArrowUturnLeft, Trash, Pencil } from "svelte-heros-v2";
    import { getContext, onMount } from "svelte";
    import { goto } from "$app/navigation";
    import markdownit from 'markdown-it'
    import markdownitFootnote from 'markdown-it-footnote'

    import { timeDifference, timeFormat } from "$lib/utils.js";
    import { apiCallPost } from "$lib/api.js";
    import TopicInfoLine from "$lib/components/TopicInfoLine.svelte";
    import UserAvatar from "$lib/components/UserAvatar.svelte";
    import ProfileGetter from "$lib/components/ProfileGetter.svelte";

    const md = markdownit({
        html: true,
        linkify: true,
        typographer: true
    })
    md.use(markdownitFootnote)

    const { record: { categories }, admins, name: instanceName } = getContext('instance');
    const session = getContext('session');
    const composer = getContext('composer');
    const profileStore = getContext('profileStore');

    const { data } = $props();
    const topic = $derived(data.topic);
    topic.category = categories?.find((c) => c.id === topic.categoryId)

    function reply () {
        composer.config = { enabled: true, type: 'reply', topic };
    }

    async function remove (item) {
        let resp;
        if (item.title) {
            resp = await apiCallPost({ fetch }, 'deleteTopic', {
                id: item.id
            })
        } else {
            resp = await apiCallPost({ fetch }, 'deleteReply', {
                id: item.id
            })
        }
        if (resp.error) {
            alert(resp.error)
        }
        goto(resp.url, { invalidateAll: true })
    }
    
    async function edit (item) {
        const type = item.title ? 'edit:topic' : 'edit:reply'
        composer.config = { enabled: true, type, item, message: { text: item.text, title: item.title } };
    }

    function canRemove(post) {
        if (session.did === post.authorDid) {
            return true
        }
        return false
    }

    let scrollY = $state(0)
    let pageHeight = $state(0)
    let scrollSize = $state(0)

    const updateScroll = () => { scrollY = window.scrollY }
    const updateResize = () => {
        pageHeight = document.documentElement.scrollHeight - window.innerHeight
        scrollSize = Math.round(window.innerHeight/(document.documentElement.scrollHeight/100))
    }

    onMount(() => {
        updateScroll()
        updateResize()
        window.addEventListener('scroll', updateScroll);
        window.addEventListener('resize', updateResize);
        window.addEventListener('load', updateResize);

        
        return () => {
            window.removeEventListener('scroll', updateScroll)
            window.removeEventListener('resize', updateResize)
            window.removeEventListener('load', updateResize)

        }
    })

</script>

<svelte:head>
    <title>{topic.title} #{topic.id} | {instanceName}</title>
</svelte:head>

{#snippet post(p)}
    <div class="pt-4 border-t max-w-[70ch] bg-white">
        <div class="flex gap-2 items-start">
            <div class="sticky top-[4.5em] pb-4">
                <UserAvatar actor={p.authorDid} size="w-12 h-12" />
            </div>
            <div class="w-full pr-2">
                <div class="flex w-full gap-2">
                    <div class="font-bold mb-3.5 text-gray-600 grow">
                        <ProfileGetter actor={p.authorDid} let:profile>
                            <a href="https://bsky.app/profile/{profile.handle}">{profile.displayName || profile.handle}</a>
                            <span class="text-gray-400 font-normal">@{profile.handle}</span>
                        </ProfileGetter>
                    </div>
                    <div class="text-gray-500" title={timeFormat(p.createdAt)}>{timeDifference(p.createdAt)}</div>
                </div>
                <div class="prose prose-a:text-blue-500" style="color: #222222; line-height: 1.5rem;">
                    {@html md.render(p.text)}
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
                                <button class="button transparent" onclick={() => edit(p)}><Pencil color="rgb(156 163 175)" size="1.3em" strokeWidth="0.12em" /></button>
                                <button class="button transparent" onclick={() => remove(p)}><Trash color="rgb(156 163 175)" size="1.3em" strokeWidth="0.12em" /></button>
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
    <h1 class="text-2xl font-bold">{topic.title} <span class="font-normal text-gray-500 text-lg">#{topic.id}</span></h1>
    <div class="mt-1">
        <TopicInfoLine {topic} />
    </div>
    <div class="flex gap-2 pt-2 w-full">
        <div class="w-3/4">
            {@render post(topic)}
            {#each topic.replies as reply}
                {@render post(reply)}
            {/each}
        </div>
        <div class="w-1/4 justify-right pl-10">
            <div class="sticky top-[7em] w-[150px]">
                <div class="mb-2 text-gray-500">{timeDifference(topic.createdAt)}</div>
                <div class="border-l-[2px] border-gray-200 ml-2" style="height: 300px;">
                    <div style="width: 100%; height: {Math.round(scrollY/(pageHeight/100)*((300-(300*(scrollSize/100)))/100))}px;"></div>
                    <div class="-ml-[4px] border-l-[6px] border-blue-500 pl-2 flex items-center" style="height: {300*(scrollSize/100)}px;">
                        <div>xx</div>
                    </div>
                    <div></div>
                </div>
                {#if topic.replies && topic.replies.length > 0}
                    <div class="mt-2 text-gray-500">{timeDifference(topic.replies[topic.replies.length-1].createdAt)}</div>
                {/if}
                <div class="mt-10 text-gray-400 mb-10">y: {scrollY}<br/>full: {pageHeight}<br/>size: {scrollSize}</div>
            </div>
        </div>
    </div>

    <div class="border-t pt-4">
        <button class="button text-lg" onclick={reply}><ArrowUturnLeft size="1em" color="white" strokeWidth="0.15em"/> Reply</button>
    </div>
</div>