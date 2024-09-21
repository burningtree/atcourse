<script>
    import { apiCallPost } from "$lib/api.js";
    import { Plus } from "svelte-heros-v2";
    import { Chasing } from "svelte-loading-spinners";
    import { goto } from "$app/navigation";

    let { composer } = $props();
    let sendInProcess = $state(false);
    const storedMsg = localStorage.getItem("compose_message");
    let message = $state(
        storedMsg
            ? JSON.parse(storedMsg)
            : {
                  title: "",
                  text: "",
              },
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
    class="fixed bottom-0 left-0 right-0 mx-auto w-full xl:w-3/4 bg-white shadow-lg p-4 border-t-[0.8em] border-blue-500 animate-slideUp"
>
    <form>
        {#if composer.config?.type === "reply"}
            <div class="font-bold flex gap-1 items-center">
                Reply to <a href={composer.config.topic.url}
                    >"{composer.config.topic.title}"</a
                >
                by @{composer.config.topic.author.handle}
            </div>
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
                ><Plus size="1em" />
                {#if composer.config.type === "reply"}
                    Create reply
                {:else}
                    Create topic
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
