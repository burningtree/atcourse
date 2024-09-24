<script>
    import { getContext } from "svelte";
    import ProfileGetter from "./ProfileGetter.svelte";

    let { actor, size = "w-6 h-6", type } = $props();

    let rounding = $derived(type === "square" ? "rounded" : "rounded-full");
</script>

<ProfileGetter {actor} let:profile>
    <div
        class="{size} aspect-square bg-gray-300 {rounding} {!profile.loaded
            ? 'animate-pulse'
            : ''}"
        title="@{profile?.handle || actor}"
    >
        {#if profile.handle !== actor}
            {#if profile.avatar}
                <img src={profile.avatar} class="{rounding} {size}" />
            {:else}
                <div class="{rounding} {size}">
                    <svg
                        width="100%"
                        height="100%"
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
        {/if}
    </div>
</ProfileGetter>
