<script>
    let { actor, size = "w-6 h-6" } = $props();
</script>

<div class="{size} aspect-square" title="@{actor.handle}">
    {#if actor.avatar}
        <img src={actor.avatar} class="rounded-full {size} bg-gray-200" />
    {:else}
        <div class="rounded-full {size}">
            <svg
                width="1.5rem"
                height="1.5rem"
                viewBox="0 0 24 24"
                fill="none"
                stroke="none"
                data-testid="userAvatarFallback"
                ><circle cx="12" cy="12" r="12" fill="rgb(156 163 175)"
                ></circle><circle cx="12" cy="9.5" r="3.5" fill="#fff"
                ></circle><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    fill="#fff"
                    d="M 12.058 22.784 C 9.422 22.784 7.007 21.836 5.137 20.262 C 5.667 17.988 8.534 16.25 11.99 16.25 C 15.494 16.25 18.391 18.036 18.864 20.357 C 17.01 21.874 14.64 22.784 12.058 22.784 Z"
                ></path></svg
            >
        </div>
    {/if}
</div>
