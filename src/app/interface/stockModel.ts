export interface StockCreate {
  company_id: number
  vendor_id: number
  serial_no: string;
  product_name: string;
  category?: string;
  desc: string;
  quantity: number;
  b_p: number;
  avatar?: string;
}
export interface Stock {
  serial_no: string;
  product_name: string;
  supplier: string;
  image?: string;
  category?: string;
  desc: string;
  quantity: number;
  id: number;
  b_p: number;
  }

  export interface Restock { 
    name:string,
    id: number;
    quantity: number;
  }