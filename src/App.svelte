<script lang="ts">
  import "./tailwind.css";
  import Spinner from "./components/spinner.svelte";
  import { Input, Button } from "flowbite-svelte";
  let message = "";
  let loading = false;
  let success = false;
  let lambdaURL =
    "https://s84u3wjqhh.execute-api.us-east-1.amazonaws.com/default/kintoneChromeExtension";
  const postToKintone = async () => {
    loading = true;
    let body = {
      userMessage: message,
    };
    let lambdaResponse = await fetch(lambdaURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    console.log(lambdaResponse.json());
    loading = false;
  };
</script>

<svelte:head>
  <link rel="stylesheet" href="/build/bundle.css" />
</svelte:head>

<main class="text-base flex flex-col items-center p-14 m-5 w-72 justify-around">
  <div class="text-red-500 size-10 m-3">Hello</div>
  <div class="flex items-center flex-col">
    <label
      for="message"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >Your Message</label
    >
    <Input
      bind:value={message}
      type="text"
      id="message"
      class="m-3"
      placeholder="Hello"
      required
    />
  </div>
  {#if loading}
    <Spinner />
  {:else}
    <Button class="m-3" on:click={postToKintone}>Post to Kintone</Button>
  {/if}
  <Button
    class="m-3"
    on:click={() => {
      loading = !loading;
    }}>test</Button
  >
</main>
