<script lang="ts">
  import { type MessageFetchProps, PaginationDirection } from '$lib/@types/navigation'
  import { numToHex } from '$lib/utils'

  export let fetchMessages: (props?: MessageFetchProps) => void
  export let enableDemoRange: () => Promise<void>
  export let blockStartHex: string
  export let blockEndHex: string
  export let error: string
  export let messageCount: number
  export let loading: boolean
  export let mostRecentBlock: number // New prop for the latest block

  let currentPage: number = 1 // Current page number
  let errorMessage: string = '' // Error message for validation

  $: startBlock = parseInt(blockStartHex, 16) // Initialize start block
  $: endBlock = parseInt(blockEndHex, 16) // Initialize end block

  // Function to validate and update block range
  const updateBlockRange = () => {
    errorMessage = '' // Reset error message

    // Validate input values
    if (startBlock <= 0 || endBlock <= 0) {
      errorMessage = 'Block numbers must be positive.'
      return
    }
    if (startBlock > mostRecentBlock) {
      errorMessage = `End block cannot be greater than the latest block (${mostRecentBlock}).`
      return
    }
    if (startBlock - endBlock > 10000) {
      errorMessage = 'The range between start and end blocks cannot exceed 10,000.'
      return
    }
    // If validation passes, fetch messages with the new block range
    fetchMessages({ startBlock: numToHex(startBlock), endBlock: numToHex(endBlock) })
  }

  const handleDemo = async () => {
    await enableDemoRange(); // Wait for the demo range to be enabled
    // Calculate the current page based on the most recent block and the end block
    currentPage = Math.floor((mostRecentBlock - endBlock) / 10000);
  }

  // Function to go to the next page of messages
  const previousData = () => {
    currentPage++
    fetchMessages({ direction: PaginationDirection.PAST })
  }

  // Function to go to the previous page of messages
  const futureData = () => {
    if (currentPage > 1) {
      // Decrement current page if greater than 1
      currentPage--
      fetchMessages({ direction: PaginationDirection.FUTURE })
    }
  }

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement // Type assertion
    const value = parseInt(target.value) || 0 // Parse and default to 0
    return value
  }
</script>

<!-- Actions container -->
<div class="flex flex-col gap-3">
  {#if endBlock && startBlock}
    <!-- Input boxes for defining block range -->
    <div class="flex justify-center items-center gap-1">
      Block # <input
        type="number"
        bind:value={endBlock}
        min="1"
        class="px-1 border rounded text-slate-700 w-28"
        placeholder="Start Block"
        on:input={(e) => (endBlock = handleInput(e))}
      />
      - #<input
        type="number"
        bind:value={startBlock}
        min="1"
        class="px-1 border rounded text-slate-700 w-28"
        placeholder="End Block"
        on:input={(e) => (startBlock = handleInput(e))}
      />
      <!-- TODO: Execute on enter click after inputs -->
      <button on:click={updateBlockRange} class="px-4 py-2 mx-2 bg-gray-700 text-white rounded">
        Update Block Range
      </button>
    </div>
  {/if}

  {#if errorMessage || error}
    <div class="text-red-500 text-center">{errorMessage || error}</div>
    <!-- Display error message -->
  {/if}

  <div class="flex justify-center items-center space-x-4">
    <button on:click={previousData} class="px-4 py-2 bg-gray-700 text-white rounded">
      Previous 10k Blocks
    </button>
    <!-- Disable button if on the first page -->
    <button
      on:click={futureData}
      disabled={currentPage === 1}
      class="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
    >
      Future Blocks
    </button>
  </div>
  <div class="flex justify-center items-center space-x-4">

    <button
      on:click={handleDemo}
      class="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
    >
      Jump to Blocks with Messages
    </button>
  </div>

  {#if !loading}
    <!-- Display number of messages -->
    <div class="flex justify-center items-center text-xl pb-2">{messageCount} Messages</div>
  {/if}
</div>
