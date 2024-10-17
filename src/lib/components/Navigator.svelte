<script lang="ts">
  import type { Message } from '$lib/@types/api-res'
  import { getCurrentBlock, getMessages, numToHex } from '../utils'
  import { onMount } from 'svelte'
  import BlockNavigation from './BlockNavigation.svelte'
  import { BLOCK_PER_PAGE_DEFAULT } from '$lib/constants'
  import Table from './Table.svelte'
  import { type MessageFetchProps, PaginationDirection } from '$lib/@types/navigation'

  let messages: Message[] = [] // Array to hold fetched messages
  let blockEndHex: string // Number of blocks to go back
  let loading = true // Loading state for fetching messages
  let error: string

  // Current block in hexadecimal format - starting at this block as later blocks do not have many messages if at all
  // This could be held within the function although that makes the function less generic
  let blockStartHex: string
  let mostRecentBlock: string

  // Fetch messages when the component mounts
  onMount(() => {
    fetchMessages({ direction: PaginationDirection.PAST })
  })

  const enableDemoRange = async () => {
    blockEndHex = '0x114C3D5'
    messages = await handleFetchBack()
  }

  const handleFetchFwds = async (): Promise<Message[]> => {
    // Calculate blocks to go forward
    const blocksFwdNumber = parseInt(blockStartHex, 16) + BLOCK_PER_PAGE_DEFAULT
    // Convert back to hex
    const futureBlockEndHex = numToHex(blocksFwdNumber)

    const res = await getMessages(blockStartHex, futureBlockEndHex)

    // Reset variables for use in displaying block ranges
    blockEndHex = blockStartHex
    blockStartHex = futureBlockEndHex
    return res
  }

  const handleFetchBack = async (): Promise<Message[]> => {
    if (blockEndHex) blockStartHex = blockEndHex
    const blockStartHexNumber = parseInt(blockStartHex, 16) // Convert current block to decimal
    // Calculate blocks to go back
    const blocksBackNumber = blockStartHexNumber - BLOCK_PER_PAGE_DEFAULT

    blockEndHex = numToHex(blocksBackNumber)

    return await getMessages(blockEndHex, blockStartHex)
  }

  const handleFetchRange = async (startBlock: string, endBlock: string): Promise<Message[]> => {
    // TODO: Allow for only one input and imply back or fwds 10k within scope ot 0 and latest block height
    // This could be set in the range controls
    const res = await getMessages(endBlock, startBlock)
    blockEndHex = endBlock
    return res
  }

  // Function to fetch messages from the blockchain
  const fetchMessages = async (props?: MessageFetchProps) => {
    loading = true
    try {
      error = ''
      mostRecentBlock = await getCurrentBlock() // Get current block if not set
      if (!blockStartHex) {
        blockStartHex = mostRecentBlock // Get current block if not set
      }
      // reset message list
      messages = []

      if (props?.startBlock && props?.endBlock) {
        const { startBlock, endBlock } = props

        messages = await handleFetchRange(startBlock, endBlock)
      }
      // Fetch based on pagination direction
      if (props?.direction) {
        messages =
          props.direction === PaginationDirection.PAST
            ? await handleFetchBack()
            : await handleFetchFwds()
      }
    } catch (e: any) {
      const errorMsg = `There was an error fetching messages - Error: ${e}`
      console.error(errorMsg)
      error = errorMsg
    }

    loading = false // Set loading state to false
  }
</script>

<div class="flex flex-col gap-1 p-4">
  <BlockNavigation
    {fetchMessages}
    {enableDemoRange}
    {blockStartHex}
    {blockEndHex}
    messageCount={messages.length}
    {loading}
    mostRecentBlock={parseInt(mostRecentBlock, 16)}
    {error}
  />

  <Table {messages} {loading} />
</div>
