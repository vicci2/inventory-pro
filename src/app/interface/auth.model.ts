 
export interface RegisterRequest {
  name: string;        
  last_name: string;        
  email: string;        
  company_id: number;        
  password: string;        
  tel_no: string;        
  avatar: string;        
  role: string;        
}
export interface LoginRequest {
  username: string;        
  password: string;   
}     

export interface TokenResponse {
  access_token: string;        
  token_type: string;   
}     
  
  // user-profile.model.ts
export interface CompanyCreate {
  name: string; 
  phone: string; 
  email: string; 
}
