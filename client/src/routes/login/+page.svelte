<div class="text-xl">Login</div>

<form action="/login" method="post" class="login-form">
    <div class="mt-2">
        <input
            class="input w-[350px]"
            type="text"
            name="handle"
            placeholder="Enter your handle (eg alice.bsky.social)"
            required
        />
    </div>
    <div class="mt-2">
        <button type="submit" class="button">Log in</button>
    </div>
</form>
