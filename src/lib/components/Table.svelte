<script lang="ts">
  import type { Message } from '$lib/@types/api.ts'
  import { getCurrentBlock, getMessages } from '../utils'
  import { onMount } from 'svelte'

  let messages: Message[] = []
  let currentPage: number = 1
  const messagesPerPage: number = 10
  let currentBlock: string = '0x114C309'

  const fetchMessages = async (page: number) => {
    if (!currentBlock) {
      currentBlock = await getCurrentBlock()
      console.log('currentBlock', parseInt(currentBlock, 16))
    }
    const currentBlockNumber = parseInt(currentBlock, 16)
    const tenKBlocksBack = currentBlockNumber - 10000
    const tenKBlocksBackHex = '0x' + tenKBlocksBack.toString(16)
    console.log(tenKBlocksBack)
    messages = await getMessages(tenKBlocksBackHex, currentBlock)
    currentBlock = tenKBlocksBackHex
  }

  onMount(() => {
    fetchMessages(currentPage)
  })

  const nextPage = () => {
    currentPage++
    fetchMessages(currentPage)
  }

  const prevPage = () => {
    if (currentPage > 1) {
      currentPage--
      fetchMessages(currentPage)
    }
  }
</script>

<div class="">
  <div class="flex justify-center items-center space-x-4">
    <button on:click={prevPage} disabled={currentPage === 1} class="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50">Previous</button>
    <span>{currentPage * 10000} Blocks</span>
    <button on:click={nextPage} class="px-4 py-2 bg-gray-700 text-white rounded">Next 10k Blocks</button>
  </div>
  <div class="max-h-[84vh] overflow-x-auto my-5 bg-gray-800 rounded-lg p-4">
    <table class="w-full text-white">
      <thead>
        <tr class="bg-gray-700">
          <th class="px-4 py-2">Nonce</th>
          <th class="px-4 py-2">Message Hash</th>
          <th class="px-4 py-2 max-w-xs truncate">Message Bytes</th>
          <th class="px-4 py-2">Transaction Hash</th>
        </tr>
      </thead>
      <tbody>
        {#each messages as message}
          <tr class="border-b border-gray-600 even:bg-gray-700 hover:bg-gray-600">
            <td class="px-4 py-2">{parseInt(message.topics[1], 16)}</td>
            <td class="px-4 py-2">{message.topics[2]}</td>
            <td class="px-4 py-2 max-w-xs truncate">{message.data}</td>
            <td class="px-4 py-2">
              <a href={`https://etherscan.io/tx/${message.transactionHash}`} target="_blank" class="text-teal-400 hover:underline">
                {message.transactionHash}
              </a>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
