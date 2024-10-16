<script lang="ts">
  import type { Message } from '$lib/@types/api-res'
  import { getCurrentBlock, getMessages } from '../utils'
  import { onMount } from 'svelte'
  import BlockNavigation from './BlockNavigation.svelte'
  import { BLOCK_PER_PAGE_DEFAULT } from '$lib/constants'
  import Table from './Table.svelte'
  import { PaginationDirection } from '$lib/@types/navigation'

  let messages: Message[] = [] // Array to hold fetched messages
  let blockEndHex: string // Number of blocks to go back
  let loading = true // Loading state for fetching messages

  // Current block in hexadecimal format - starting at this block as later blocks do not have many messages if at all
  // This could be held within the function although that makes the function less generic
  let blockStartHex: string = '0x114C309'

  // Fetch messages when the component mounts
  onMount(() => {
    fetchMessages()
  })

  const handleFetchFwds = async () => {
    // Calculate blocks to go forward
    const blocksFwdNumber = parseInt(blockStartHex, 16) + BLOCK_PER_PAGE_DEFAULT
    // Convert back to hex
    const futureBlockEndHex = '0x' + blocksFwdNumber.toString(16)

    messages = await getMessages(blockStartHex, futureBlockEndHex)

    // Reset variables for use in displaying block ranges
    blockEndHex = blockStartHex
    blockStartHex = futureBlockEndHex
  }

  const handleFetchBack = async () => {
    if (blockEndHex) blockStartHex = blockEndHex
    const blockStartHexNumber = parseInt(blockStartHex, 16) // Convert current block to decimal
    // Calculate blocks to go back
    const blocksBackNumber = blockStartHexNumber - BLOCK_PER_PAGE_DEFAULT

    blockEndHex = '0x' + blocksBackNumber.toString(16) // Convert back to hex

    messages = await getMessages(blockEndHex, blockStartHex)
  }

  // Function to fetch messages from the blockchain
  const fetchMessages = async (direction: PaginationDirection = PaginationDirection.PREVIOUS) => {
    loading = true

    if (!blockStartHex) {
      blockStartHex = await getCurrentBlock() // Get current block if not set
    }

    // Fetch based on pagination direction
    direction === PaginationDirection.PREVIOUS ? handleFetchBack() : handleFetchFwds()

    loading = false // Set loading state to false
  }
</script>

<div class="flex flex-col gap-1 p-4">
  <BlockNavigation
    {blockStartHex}
    {fetchMessages}
    {blockEndHex}
    messageCount={messages.length}
    {loading}
  />

  <Table {messages} {loading} />
</div>
