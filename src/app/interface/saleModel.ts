export interface Sale {
    inventory_id: number;
    quantity: number;
    base_price: number
    selling_price: number;
    sale_date: string;
    status: string;
    product_name?: string;
    image?: string; 
  }
export interface SaleCreate{
  company_id: number,
  inventory_id: number,
  quantity: number,
  selling_price: number,
  base_price: null,
  status: string
}