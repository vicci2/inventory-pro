export enum UserRole {
    admin = "admin",
    manager = "manager",
    supplier = "supplier",
    user = "user",
    staff = "staff"
  }
  
export interface User {
  fullName: string;    
  username: string;    
  email: string;         
  company_id: number;           
  avatar: string;  
  tel_no: string;   
  id: number;           
  role: UserRole;        
  // lastLogin: Date;    
  }
  
  // user-profile.model.ts
export interface UserProfile {
  id: string; 
  name: string;
  bio: string;
  profilePicture?: string; 
  designation: string;
}
