<script lang="ts">
  import { FetchDirection } from '$lib/@types/navigation'
  import { BLOCK_PER_PAGE_DEFAULT } from '$lib/constants'

  // Called when pagination is triggered to further fetch messages
  export let fetchMessages: (direction?: FetchDirection) => void
  export let blockStartHex: string
  export let blockEndHex: string
  export let messageCount: number
  export let loading: boolean

  let currentPage: number = 1 // Current page number

  // Function to go to the next page of messages
  const previousData = () => {
    currentPage++
    fetchMessages()
  }

  // Function to go to the previous page of messages
  const futureData = () => {
    if (currentPage > 1) {
      // Decrement current page if greater than 1
      currentPage--
      fetchMessages(FetchDirection.FUTURE)
    }
  }
</script>

<!-- Actions container -->
<div class="flex flex-col gap-3">
  <div class="flex justify-center items-center space-x-4">
    <button on:click={previousData} class="px-4 py-2 bg-gray-700 text-white rounded">
      Previous 10k Blocks
    </button>
    <!-- Display current block count -->
    <span>{currentPage * BLOCK_PER_PAGE_DEFAULT} Blocks</span>
    <!-- Disable button if on the first page -->
    <button
      on:click={futureData}
      disabled={currentPage === 1}
      class="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
    >
      Future Blocks
    </button>
  </div>
  {#if blockEndHex && blockStartHex}
    <div class="flex justify-center items-center text-xl">
      <!-- Display block range -->
      Block #{parseInt(blockEndHex, 16)} - #{parseInt(blockStartHex, 16)}
    </div>
  {/if}

  {#if !loading}
    <!-- Display number of messages -->
    <div class="flex justify-center items-center text-xl pb-2">{messageCount} Messages</div>
  {/if}
</div>
