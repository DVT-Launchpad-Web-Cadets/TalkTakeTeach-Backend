import { integer } from "@elastic/elasticsearch/lib/api/types";

export interface Result {
  took: number;
  timed_out: boolean;
  _shards: Shards;
  hits: Hits;
  suggest: Suggest;
}

export interface Shards {
  total: number;
  successful: number;
  skipped: number;
  failed: number;
}

export interface Hits {
  total: Total;
  max_score: any;
  hits: any[];
}

export interface Total {
  value: number;
  relation: string;
}

export interface Suggest {
  "product-suggest-fuzzy": ProductSuggestFuzzy[];
}

export interface ProductSuggestFuzzy {
  text: string;
  offset: number;
  length: number;
  options: Option[];
}

export interface Option {
  text: string;
  _index: string;
  _id: string;
  _score: number;
  _source: Source;
}

export interface Source {
  name: Name;
  price: number;
}

export interface Name {
  input: string[];
}

export interface Product {
  name: string;
  price: integer;
}
