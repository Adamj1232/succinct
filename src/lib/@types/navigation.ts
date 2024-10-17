export enum PaginationDirection {
  PAST = 'past',
  FUTURE = 'future'
}

export type MessageFetchProps = {
  direction?: PaginationDirection
  startBlock?: string
  endBlock?: string
}
