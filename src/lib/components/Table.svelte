<script lang="ts">
  import type { Message } from '$lib/@types/api.ts'
  import { getCurrentBlock, getMessages } from '../utils'
  import { onMount } from 'svelte'

  const messagesPerPage: number = 10000

  let messages: Message[] = []
  let currentPage: number = 1
  let currentBlock: string = '0x114C309'

  onMount(() => {
    fetchMessages()
  })

  const fetchMessages = async () => {
    if (!currentBlock) {
      currentBlock = await getCurrentBlock()
    }
    const currentBlockNumber = parseInt(currentBlock, 16)
    const tenKBlocksBack = currentBlockNumber - messagesPerPage
    const tenKBlocksBackHex = '0x' + tenKBlocksBack.toString(16)
    messages = await getMessages(tenKBlocksBackHex, currentBlock)
    currentBlock = tenKBlocksBackHex
  }

  const nextPage = () => {
    currentPage++
    fetchMessages()
  }

  const prevPage = () => {
    if (currentPage > 1) {
      currentPage--
      fetchMessages()
    }
  }
  const removeLeadingZeros = (hexData: string) => {
    return hexData.replace(/^0x0+/, '0x')
  }
</script>

<div class="flex flex-col gap-3">
  <div class="flex justify-center items-center space-x-4">
    <button
      on:click={prevPage}
      disabled={currentPage === 1}
      class="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50">Previous</button
    >
    <span>{currentPage * 10000} Blocks</span>
    <button on:click={nextPage} class="px-4 py-2 bg-gray-700 text-white rounded"
      >Next 10k Blocks</button
    >
  </div>
  <div class="flex justify-center items-center text-xl p-2">{messages.length} Messages</div>
  <div class="max-h-[84vh] overflow-x-auto bg-gray-800 rounded-lg">
    <table class="w-full text-white">
      <thead class="sticky top-0 bg-gray-700">
        <tr>
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
            <td class="px-4 py-2 max-w-xs overflow-scroll" title={removeLeadingZeros(message.data)}
              >{removeLeadingZeros(message.data)}</td
            >
            <td class="px-4 py-2">
              <a
                href={`https://etherscan.io/tx/${message.transactionHash}`}
                target="_blank"
                class="text-teal-400 hover:underline"
              >
                {message.transactionHash}
              </a>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
