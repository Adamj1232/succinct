import { Message } from './@types/api-res' // Importing the Message type from the specified path

// TODO: ENH - use viem for these action to bring in further utils

// Function to fetch the current block number from the Ethereum blockchain
export async function getCurrentBlock(): Promise<string> {
  try {
    // Sending a POST request to the Ethereum node - can be swapped for Infura or other node providers
    const res = await fetch('https://docs-demo.quiknode.pro/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        method: 'eth_blockNumber', // JSON-RPC method to get the current block number
        params: [],
        id: 1,
        jsonrpc: '2.0'
      })
    })

    // Check if the response is OK (status in the range 200-299)
    if (!res.ok) {
      throw new Error(`Network response was not ok: ${res.statusText}`)
    }

    // Parse the JSON response
    const data: { result?: string; error?: unknown } = await res.json()

    // Check for errors in the API response
    if (data.error) {
      throw new Error(`Error from API: ${JSON.stringify(data.error)}`)
    }

    // Return the block number if available
    if (data.result) {
      return data.result
    } else {
      throw new Error('No result found in the response')
    }
  } catch (error) {
    // Log any errors that occur during the fetch
    console.error('Failed to fetch the current block:', error)
    throw error
  }
}

// Function to fetch message logs between specified blocks from the Ethereum blockchain
export async function getMessages(
  fromBlock: string,
  toBlock: string,
  address: string = '0x41EA857C32c8Cb42EEFa00AF67862eCFf4eB795a' // Default address to filter logs
): Promise<Message[]> {
  try {
    // Sending a POST request to the Ethereum node to get logs - can be swapped for Infura or other node providers
    const res = await fetch('https://docs-demo.quiknode.pro/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        method: 'eth_getLogs', // JSON-RPC method to get logs
        params: [
          {
            fromBlock,
            toBlock,
            address,
            topics: ['0xe5944a34d67c652e0ebf2304b48432aae0b55e40f79ba8a21a4d7054c169ffac'] // Filter by specific topics
          }
        ],
        id: 1,
        jsonrpc: '2.0'
      })
    })

    // Check if the response is OK
    if (!res.ok) {
      throw new Error(`Network response was not ok: ${res.statusText}`)
    }

    // Parse the JSON response
    const data: { result?: Message[]; error?: unknown } = await res.json()

    // Check for errors in the API response
    if (data.error) {
      throw new Error(`Error from API: ${JSON.stringify(data.error)}`)
    }

    // Return the message logs if available
    if (data.result) {
      return data.result
    } else {
      throw new Error('No result found in the response')
    }
  } catch (error) {
    // Log any errors that occur during the fetch
    console.error('Failed to fetch the message logs:', error)
    throw error
  }
}
