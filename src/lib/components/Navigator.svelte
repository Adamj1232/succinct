<script lang="ts">
  import type { Message } from '$lib/@types/api-res' // Importing the Message type
  import { getCurrentBlock, getMessages } from '../utils' // Importing utility functions
  import { onMount } from 'svelte' // Importing Svelte's lifecycle function
  import BlockNavigation from './BlockNavigation.svelte'
  import { BLOCK_PER_PAGE_DEFAULT } from '$lib/constants'
  import Table from './Table.svelte'

  let messages: Message[] = [] // Array to hold fetched messages
  let blocksBackHex: string // Number of blocks to go back
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
    if (blocksBackHex) currentBlock = blocksBackHex

    const currentBlockNumber = parseInt(currentBlock, 16) // Convert current block to decimal

    const blocksBackNumber = currentBlockNumber - BLOCK_PER_PAGE_DEFAULT // Calculate blocks to go back

    blocksBackHex = '0x' + blocksBackNumber.toString(16) // Convert back to hex

    messages = await getMessages(blocksBackHex, currentBlock) // Fetch messages

    loading = false // Set loading state to false
  }
</script>

<div class="flex flex-col gap-1 p-4">
  <BlockNavigation
    {currentBlock}
    {fetchMessages}
    {blocksBackHex}
    messageCount={messages.length}
    {loading}
  />

  <Table {messages} {loading}/>
</div>
