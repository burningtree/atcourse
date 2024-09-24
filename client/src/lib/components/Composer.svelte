<script>
    import { apiCallPost } from "$lib/api.js";
    import { Plus, Pencil } from "svelte-heros-v2";
    import { Chasing } from "svelte-loading-spinners";
    import { goto } from "$app/navigation";
    import ProfileGetter from "./ProfileGetter.svelte";

    let { composer } = $props();
    let sendInProcess = $state(false);
    const storedMsg = localStorage.getItem("compose_message");
    let message = $derived(
        composer.config?.message ||
            (storedMsg
                ? JSON.parse(storedMsg)
                : {
                      title: "",
                      text: "",
                  }),
    );

    async function send() {
        sendInProcess = true;
        const msg = {
            ...message,
        };

        let resp;
        if (composer.config.type === "reply") {
            // reply
            resp = await apiCallPost({ fetch }, "createReply", {
                text: message.text,
                topic: composer.config.topic.id,
            });
        } else if (composer.config.type === "edit:topic") {
            resp = await apiCallPost({ fetch }, "updateTopic", {
                ...message,
                id: composer.config.item.id,
            });
        } else if (composer.config.type === "edit:reply") {
            resp = await apiCallPost({ fetch }, "updateReply", {
                ...message,
                id: composer.config.item.id,
            });
        } else {
            // its topic
            resp = await apiCallPost({ fetch }, "createTopic", message);
        }
        if (resp.error) {
            alert(resp.error);
        } else {
            goto(resp.url, { invalidateAll: true });
            //window.location.replace(resp.url);
        }
        sendInProcess = false;
        composer.config = false;
    }

    function save() {
        localStorage.setItem("compose_message", JSON.stringify(message));
    }

    function close() {
        save();
        composer.config = false;
    }
</script>

<div
    class="z-10 fixed bottom-0 left-0 right-0 mx-auto w-full xl:w-3/4 bg-white shadow-lg p-4 border-t-[0.8em] border-blue-500 animate-slideUp"
>
    <form>
        {#if composer.config?.type === "reply"}
            <ProfileGetter actor={composer.config.topic.authorDid} let:profile>
                <div class="font-bold flex gap-1 items-center">
                    Reply to <a href={composer.config.topic.url}
                        >"{composer.config.topic.title}"</a
                    >
                    by @{profile.handle}
                </div>
            </ProfileGetter>
        {:else if composer.config?.type === "edit:topic"}
            <div class="font-bold flex gap-1 items-center">
                Edit topic: {composer.config.item.title} #{composer.config.item
                    ?.id}
            </div>
            <div class="mt-2">
                <input
                    type="input"
                    name="title"
                    class="w-full p-2 border"
                    placeholder="Topic name"
                    autocomplete="off"
                    bind:value={message.title}
                    disabled={sendInProcess}
                />
            </div>
        {:else if composer.config?.type === "edit:reply"}
            <div class="font-bold flex gap-1 items-center">Edit reply</div>
        {:else}
            <div class="font-bold flex gap-1 items-center">
                Create new topic
            </div>
            <div class="mt-2">
                <input
                    type="input"
                    name="title"
                    class="w-full p-2 border"
                    placeholder="Topic name"
                    autocomplete="off"
                    bind:value={message.title}
                    disabled={sendInProcess}
                />
            </div>
        {/if}
        <div class="mt-2">
            <textarea
                name="description"
                class="p-2 border w-full h-64"
                placeholder="Topic description (text)"
                bind:value={message.text}
                disabled={sendInProcess}
            ></textarea>
        </div>
        <div class="mt-2 flex gap-2">
            <button
                class="button flex gap-1 items-center"
                onclick={send}
                disabled={sendInProcess}
            >
                {#if composer.config.type === "reply"}
                    <Plus size="1em" /> Create reply
                {:else if composer.config.type === "edit:topic"}
                    <Pencil size="1em" /> Edit topic
                {:else if composer.config.type === "edit:reply"}
                    <Pencil size="1em" /> Edit reply
                {:else}
                    <Plus size="1em" /> Create topic
                {/if}
            </button>
            <button
                class="button transparent"
                onclick={close}
                disabled={sendInProcess}>Close</button
            >
            {#if sendInProcess}
                <div class="grow"></div>
                <div class="flex gap-2 items-center">
                    <div class="w-[28px] h-[28px]">
                        <Chasing size="28" color="blue" />
                    </div>
                    Publishing ..
                </div>
            {/if}
        </div>
    </form>
</div>
