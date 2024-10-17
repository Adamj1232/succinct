<script lang="ts">
  import type { Message } from '$lib/@types/api-res'
  import { removeLeadingZeros } from '../utils'

  // Array to hold fetched messages
  export let messages: Message[] // Type annotation for messages
  // Loading state for fetching messages
  export let isLoading: boolean // Type annotation for loading state
</script>

<!-- TODO: Optimize for a mobile experience if necessary -->
<!-- TODO: Research OOTB table components that come with UI component libs -->
<!-- TODO: Make this component more generic if other tables are required by product -->

<div>
  <div class="max-h-[70vh] max-w-[1400px] m-auto overflow-x-auto bg-gray-800 rounded-lg">
    {#if isLoading}
      <div class="flex justify-center items-center h-64">
        <!-- Loading indicator -->
        <div class="text-2xl text-white animate-pulse">Loading...</div>
      </div>
    {:else}
      <table class="w-full text-white table-auto" aria-labelledby="table-caption">
        <caption id="table-caption" class="sr-only">List of messages</caption>
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
              <td class="px-4 py-2 max-w-[16rem] truncate" title={message.topics[2]}>
                <!-- Display Message Hash -->
                {message.topics[2]}
              </td>
              <td
                class="px-4 py-2 max-w-[14rem] overflow-hidden truncate"
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
                  rel="noopener noreferrer"
                  aria-label={`View transaction ${message.transactionHash} on Etherscan`}
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
