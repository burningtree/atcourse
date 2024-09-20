<script>
    import { apiCallPost } from "$lib/api.js";

    let handle = $state("");

    async function doLogin() {
        const res = await apiCallPost({ fetch }, "login", {
            handle,
        });
        if (res && res.url) {
            window.location.replace(res.url);
        }
    }
</script>

<div class="text-xl">Login</div>

<form>
    <div class="mt-2">
        <input
            class="input w-[350px]"
            type="text"
            name="handle"
            placeholder="Enter your handle (eg alice.bsky.social)"
            required
            bind:value={handle}
        />
    </div>
    <div class="mt-2">
        <button type="submit" class="button" onclick={doLogin}>Log in</button>
    </div>
</form>
