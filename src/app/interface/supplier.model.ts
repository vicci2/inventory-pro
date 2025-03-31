export interface SupplierBase {
  company_id: number;
  name: string;
  email: string;
  address: string;
  tel_no: string;
}

export interface UpdateSupplier {
  name: string;
  email: string;
  address: string;
  tel_no: string;
}

export interface SupplierResponse extends SupplierBase {
  id:number
  last_update: string;
  createdAt: string;
}
