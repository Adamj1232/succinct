<script lang="ts">
  import type { Message } from '$lib/@types/api-res' // Importing the Message type
  import { removeLeadingZeros } from '../utils' // Importing utility functions

  export let messages: Message[] = [] // Array to hold fetched messages
  export let loading = true // Loading state for fetching messages
</script>

<!-- TODO: Optimize for a mobile experience -->
<div>
  <div class="max-h-[70vh] max-w-[1400px] m-auto overflow-x-auto bg-gray-800 rounded-lg">
    {#if loading}
      <div class="flex justify-center items-center h-64">
        <!-- Loading indicator -->
        <div class="text-2xl text-white animate-pulse">Loading...</div>
      </div>
    {:else}
      <table class="w-full text-white table-auto">
        <thead class="sticky top-0 bg-gray-700">
          <tr>
            <!-- Column for Nonce -->
            <th class="px-4 py-2">Nonce</th>
            <!-- Column for Message Hash -->
            <th class="px-4 py-2">Message Hash</th>
            <!-- Column for Message Bytes -->
            <th class="px-4 py-2">Message Bytes</th>
            <!-- Column for Transaction Hash -->
            <th class="px-4 py-2">Transaction Hash</th>
          </tr>
        </thead>

        <tbody>
          <!-- Loop through messages -->
          {#each messages as message}
            <tr class="border-b border-gray-600 even:bg-gray-700 hover:bg-gray-600">
              <!-- Display Nonce -->
              <td class="px-4 py-2">{parseInt(message.topics[1], 16)}</td>
              <td class="px-4 py-2 max-w-[18rem] truncate" title={message.topics[2]}>
                <!-- Display Message Hash -->
                {message.topics[2]}
              </td>
              <td
                class="px-4 py-2 max-w-[18rem] overflow-hidden truncate"
                title={removeLeadingZeros(message.data)}
              >
                <!-- Display Message Bytes -->
                {removeLeadingZeros(message.data)}
              </td>
              <td class="px-4 py-2 max-w-2xl">
                <!-- Link to transaction on Etherscan -->
                <a
                  href={`https://etherscan.io/tx/${message.transactionHash}`}
                  target="_blank"
                  class="text-teal-400 hover:underline"
                >
                  <!-- Display Transaction Hash -->
                  {message.transactionHash}
                </a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>
