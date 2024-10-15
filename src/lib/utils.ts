import { Message } from './@types/api-res'

export async function getCurrentBlock(): Promise<string> {
  try {
    const res = await fetch('https://docs-demo.quiknode.pro/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        method: 'eth_blockNumber',
        params: [],
        id: 1,
        jsonrpc: '2.0'
      })
    })

    if (!res.ok) {
      throw new Error(`Network response was not ok: ${res.statusText}`)
    }

    const data: { result?: string; error?: unknown } = await res.json()
    console.log('data', data)

    if (data.error) {
      throw new Error(`Error from API: ${JSON.stringify(data.error)}`)
    }

    if (data.result) {
      return data.result
    } else {
      throw new Error('No result found in the response')
    }
  } catch (error) {
    console.error('Failed to fetch the current block:', error)
    throw error
  }
}

export async function getMessages(
  fromBlock: string = '0x114C309',
  toBlock: string = '0x114C3D5',
  address: string = '0x41EA857C32c8Cb42EEFa00AF67862eCFf4eB795a'
): Promise<Message[]> {
  console.log('fromBlock', parseInt(fromBlock,16))
  console.log('toBlock', parseInt(toBlock, 16))
  try {
    const res = await fetch('https://docs-demo.quiknode.pro/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        method: 'eth_getLogs',
        params: [
          {
            fromBlock,
            toBlock,
            address,
            topics: ['0xe5944a34d67c652e0ebf2304b48432aae0b55e40f79ba8a21a4d7054c169ffac']
          }
        ],
        id: 1,
        jsonrpc: '2.0'
      })
    })

    if (!res.ok) {
      throw new Error(`Network response was not ok: ${res.statusText}`)
    }

    const data: { result?: Message[]; error?: unknown } = await res.json()
    console.log('data', data)

    if (data.error) {
      throw new Error(`Error from API: ${JSON.stringify(data.error)}`)
    }

    if (data.result) {
      return data.result
    } else {
      throw new Error('No result found in the response')
    }
  } catch (error) {
    console.error('Failed to fetch the message logs:', error)
    throw error
  }
}
