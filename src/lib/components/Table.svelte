<script lang="ts">
  import type { Message } from '$lib/@types/api.ts'
  import { getCurrentBlock, getMessages } from '../utils'
  import { onMount } from 'svelte'

  let messages: Message[] = []
  let currentPage: number = 1
  const messagesPerPage: number = 10
  // Start at demo block as messages are very spare recently
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


<div class="pagination">
  <button on:click={prevPage} disabled={currentPage === 1}>Previous</button>
  <span>{currentPage * 10000} Blocks</span>
  <button on:click={nextPage}>Next 10k Blocks</button>
</div>
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Nonce</th>
        <th>Message Hash</th>
        <th>Message Bytes</th>
        <th>Transaction Hash</th>
      </tr>
    </thead>
    <tbody>
      {#each messages as message}
        <tr>
          <td>{parseInt(message.topics[1], 16)}</td>
          <td>{message.topics[2]}</td>
          <td>{message.data}</td>
          <td>
            <a href={`https://etherscan.io/tx/${message.transactionHash}`} target="_blank">
              {message.transactionHash}
            </a>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>


<style>
  .table-container {
    width: 100%;
    overflow-x: auto; /* Allows horizontal scrolling if needed */
    margin: 20px 0;
    height: 80vh;
    overflow-y: scroll;
    border: 1px solid gray;
  }

  table {
    width: 100%;
    max-width: 100%; /* Ensures the table doesn't exceed the container's width */
    border-collapse: collapse;
    font-size: 1em;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  }

  thead tr {
    background-color: #009879;
    color: #ffffff;
    text-align: left;
  }

  th, td {
    padding: 12px 15px;
    border: 1px solid #dddddd;
    white-space: nowrap; /* Prevents text from wrapping */
  }

  /* Specific max-width for the Message Bytes column */
  td:nth-child(3), th:nth-child(3) {
    max-width: 340px;
    overflow: hidden;
    text-overflow: ellipsis; /* Adds ellipsis for overflowed text */
  }
  /* Specific max-width for the Message Bytes column */
  td:nth-child(1), th:nth-child(1) {
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis; /* Adds ellipsis for overflowed text */
  }

  tbody tr {
    border-bottom: 1px solid #dddddd;
  }

  tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
  }

  tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
  }

  tbody tr:hover {
    background-color: #f1f1f1;
  }

  @media (max-width: 600px) {
    th, td {
      padding: 8px 10px;
    }

    th {
      font-size: 0.9em;
    }
  }
</style>
