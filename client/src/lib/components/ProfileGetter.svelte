<script>
    import { getContext, onMount } from "svelte";
    import { apiCall } from "$lib/api.js";

    let { actor, size = "w-6 h-6" } = $props();

    const profileStore = getContext("profileStore");
    const profile = $derived(
        profileStore.items[actor] || {
            dislayName: actor,
            handle: actor,
        },
    );

    onMount(async () => {
        if (!profileStore.items[actor] && !profileStore.loading[actor]) {
            profileStore.loading[actor] = true;
            const profile = await apiCall(
                { fetch },
                "getProfile?actor=" + actor,
            );
            profileStore.items[actor] = { ...profile, loaded: true };
            delete profileStore.loading[actor];
        }
    });
</script>

<slot {profile} />
