export interface Percolation {
    took: number
    timed_out: boolean
    _shards: Shards
    hits: Hits
  }
  
  export interface Shards {
    total: number
    successful: number
    skipped: number
    failed: number
  }
  
  export interface Hits {
    total: Total
    max_score: number
    hits: Hit[]
  }
  
  export interface Total {
    value: number
    relation: string
  }
  
  export interface Hit {
    _index: string
    _id: string
    _score: number
    _source: Source
  }
  
  export interface Source {
    name: Name
    price: number
  }
  
  export interface Name {
    input: string[]
  }
  