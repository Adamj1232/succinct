<script lang="ts">
  // Importing necessary types and utilities
  import type { Message } from '$lib/@types/api-res'
  import { getCurrentBlock, getMessages, numToHex } from '../utils'
  import { onMount } from 'svelte'
  import BlockNavigation from './BlockNavigation.svelte'
  import { MAX_BLOCK_PER_REQUEST } from '$lib/constants'
  import Table from './Table.svelte'
  import { type MessageFetchProps, PaginationDirection } from '$lib/@types/navigation'

  // State variables
  let messages: Message[] = [] // Array to hold fetched messages
  let blockEndHex: string // Hexadecimal representation of the end block
  let isLoading = true // Loading state for fetching messages
  let error: string = '' // Error message state
  let blockStartHex: string // Hexadecimal representation of the start block
  let mostRecentBlock: string // Most recent block in hexadecimal format

  // Fetch messages when the component mounts
  onMount(() => {
    fetchMessages({ direction: PaginationDirection.PAST })
  })

  // Enable demo range for testing purposes
  const enableDemoRange = async () => {
    blockEndHex = '0x114C3D5' // TODO: Replace with a constant or config value
    messages = await handleFetchBack()
  }

  // Fetch messages going forward
  const handleFetchFwds = async (): Promise<Message[]> => {
    const blocksFwdNumber = parseInt(blockStartHex, 16) + MAX_BLOCK_PER_REQUEST
    const futureBlockEndHex = numToHex(blocksFwdNumber)
    const res = await getMessages(blockStartHex, futureBlockEndHex)

    // Update block range for display
    blockEndHex = blockStartHex
    blockStartHex = futureBlockEndHex
    return res
  }

  // Fetch messages going backward
  const handleFetchBack = async (): Promise<Message[]> => {
    if (blockEndHex) blockStartHex = blockEndHex
    const blockStartHexNumber = parseInt(blockStartHex, 16)
    const blocksBackNumber = blockStartHexNumber - MAX_BLOCK_PER_REQUEST

    blockEndHex = numToHex(blocksBackNumber)
    return await getMessages(blockEndHex, blockStartHex)
  }

  // Fetch messages within a specified range
  const handleFetchRange = async (startBlock: string, endBlock: string): Promise<Message[]> => {
    const res = await getMessages(endBlock, startBlock)
    blockEndHex = endBlock
    return res
  }

  // Function to fetch messages from the blockchain
  const fetchMessages = async (props?: MessageFetchProps) => {
    isLoading = true // Set loading state to true
    try {
      error = '' // Reset error message
      mostRecentBlock = await getCurrentBlock() // Get current block if not set
      if (!blockStartHex) {
        blockStartHex = mostRecentBlock // Initialize start block if not set
      }
      messages = [] // Reset message list

      // Fetch messages based on provided start and end blocks
      if (props?.startBlock && props?.endBlock) {
        const { startBlock, endBlock } = props
        messages = await handleFetchRange(startBlock, endBlock)
      }

      // Fetch messages based on pagination direction
      if (props?.direction) {
        messages =
          props.direction === PaginationDirection.PAST
            ? await handleFetchBack()
            : await handleFetchFwds()
      }
    } catch (e: any) {
      const errorMsg = `Error fetching messages: ${e}`
      console.error(errorMsg)
      error = errorMsg // Set error message
    } finally {
      isLoading = false // Set loading state to false
    }
  }
</script>

<div class="flex flex-col gap-1 p-4">
  <BlockNavigation
    {fetchMessages}
    {enableDemoRange}
    {blockStartHex}
    {blockEndHex}
    messageCount={messages.length}
    {isLoading}
    mostRecentBlock={parseInt(mostRecentBlock, 16)}
    {error}
  />

  <Table {messages} {isLoading} />
</div>
