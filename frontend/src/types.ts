export  interface Match {
  similarity: number;
  image_url: string;
  bbox: [number, number, number, number];
}