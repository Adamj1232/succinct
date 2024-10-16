<script lang="ts">
  import type { Message } from '$lib/@types/api-res' // Importing the Message type
  import { getCurrentBlock, getMessages } from '../utils' // Importing utility functions
  import { onMount } from 'svelte' // Importing Svelte's lifecycle function

  const messagesPerPage: number = 10000 // Number of messages to display per page

  let messages: Message[] = [] // Array to hold fetched messages
  let currentPage: number = 1 // Current page number
  let blocksBackNumber: number // Number of blocks to go back
  let loading = true // Loading state for fetching messages

  // Current block in hexadecimal format - starting at this block as later blocks do not have many messages if at all
  // This could be held within the function although that makes the function less generic
  let currentBlock: string = '0x114C309'

  // Fetch messages when the component mounts
  onMount(() => {
    fetchMessages()
  })

  // Function to fetch messages from the blockchain
  const fetchMessages = async () => {
    loading = true
    if (!currentBlock) {
      currentBlock = await getCurrentBlock() // Get current block if not set
    }
    const currentBlockNumber = parseInt(currentBlock, 16) // Convert current block to decimal
    blocksBackNumber = currentBlockNumber - messagesPerPage // Calculate blocks to go back
    const tenKBlocksBackHex = '0x' + blocksBackNumber.toString(16) // Convert back to hex
    messages = await getMessages(tenKBlocksBackHex, currentBlock) // Fetch messages
    currentBlock = tenKBlocksBackHex // Update current block
    loading = false // Set loading state to false
  }

  // Function to go to the next page of messages
  const nextPage = () => {
    currentPage++
    fetchMessages()
  }

  // Function to go to the previous page of messages
  const prevPage = () => {
    if (currentPage > 1) {
      // Decrement current page if greater than 1
      currentPage--
      fetchMessages()
    }
  }

  // Function to remove leading zeros from hexadecimal data
  const removeLeadingZeros = (hexData: string) => {
    // Replace leading zeros
    return hexData.replace(/^0x0+/, '0x')
  }
</script>

<div class="flex flex-col gap-1 p-4">
  <!-- Actions container -->
  <div class="flex justify-center items-center space-x-4">
    <button on:click={nextPage} class="px-4 py-2 bg-gray-700 text-white rounded">
      Previous 10k Blocks
    </button>
    <!-- Display current block count -->
    <span>{currentPage * 10000} Blocks</span>
    <!-- Disable button if on the first page -->
    <button
      on:click={prevPage}
      disabled={currentPage === 1}
      class="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
    >
      Future Blocks
    </button>
  </div>

  <!-- Display number of messages -->
  <div class="flex justify-center items-center text-xl p-2">{messages.length} Messages</div>

  <div class="flex justify-center items-center text-xl p-2">
    <!-- Display block range -->
    Block #{blocksBackNumber} - #{parseInt(currentBlock, 16)}
  </div>

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
</div>
