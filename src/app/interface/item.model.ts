export interface Item{
    id:String;
    company_id:String;
    product_id:String;
    product_name:String;
    image:String;
    desc:String;
    stkQuantity: number
    inQuantity: number
    salesQtty: number
    base_price:number;
    selling_price:number;
    serial_no: string;
    createdAt: string;
    last_updated: string;
}

export interface Inventory{
    id: number
    company_id: number
    product_id: number
    product_name: String
    image: String
    quantity: number
    base_price: number
    selling_price: number
    serial_no: String
    date: String
    last_updated: String
}