<script lang="ts">
    import { useChat } from "ai/svelte";

    const { messages, handleSubmit, input} = useChat({
        api: "/chatbot",
    });
</script>

<ul>
    {#each $messages as message}
        <li>{message.role}: {message.content}</li>
    {/each}
</ul>

<form on:submit={handleSubmit}>
    <input bind:value={$input} />
    <button type="submit">Send</button>
</form>
