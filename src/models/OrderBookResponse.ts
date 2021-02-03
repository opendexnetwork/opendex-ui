export type OrderBookResponse = {
  buckets: { [key: string]: Buckets };
};

export type Bucket = {
  price: number;
  quantity: number;
};

type Buckets = {
  buyBuckets: Bucket[];
  sellBuckets: Bucket[];
};
