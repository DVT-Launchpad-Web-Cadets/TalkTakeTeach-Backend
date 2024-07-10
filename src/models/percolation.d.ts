export interface Percolation {
    took: number
    timed_out: boolean
    _shards: PShards
    hits: PHits
  }
  
  export interface PShards {
    total: number
    successful: number
    skipped: number
    failed: number
  }
  
  export interface PHits {
    total: PTotal
    max_score: number
    hits: PHit[]
  }
  
  export interface PTotal {
    value: number
    relation: string
  }
  
  export interface PHit {
    _index: string
    _id: string
    _score: number
    _source: PSource
  }
  
  export interface PSource {
    name: PName;
    imageUrl: string;
    brand?: string;
    brandLink?: string;
    productLink: string;
    rating?: number;
    numberOfReviews?: number;
    price: number;
    salePrice?: number;
  }
  
  export interface PName {
    input: string[]
  }
  