<script lang="ts">
  import "./tailwind.css";
  import Spinner from "./components/spinner.svelte";
  import { CheckCircleSolid, CloseSolid } from "flowbite-svelte-icons";
  import { Input, Button } from "flowbite-svelte";
  let message = "";
  let loading = false;
  let success = false;
  let error = false;
  let errorMessage = "Error: ";
  let lambdaURL =
    "https://s84u3wjqhh.execute-api.us-east-1.amazonaws.com/default/kintoneChromeExtension";
  const postToKintone = async () => {
    if (message == "") {
      error = true;
      errorMessage += "No text!";
      return;
    } else {
      error = false;
      errorMessage = 'Error: ';
    }
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
    loading = false;
    if (lambdaResponse.status == 200) {
      success = true;
    } else {
      error = true;
      errorMessage += "Fetch Request Error.";
    }
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
  {#if success}
    <div class="flex items-center">
      <CheckCircleSolid />
      <p class="text-green-400 m-3">Success</p>
    </div>
  {:else if error}
    <div class="flex items-center">
      <CloseSolid />
      <p class="text-red-500 m-3">{errorMessage}</p>
    </div>
  {/if}
</main>
