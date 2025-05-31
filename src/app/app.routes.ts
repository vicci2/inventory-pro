import { Routes } from '@angular/router';
import { titleResolver } from './titleResolver';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    children:[
      {
        path: '',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
        title: 'Welcome To InventoryPro'
      },
      {
        path: 'register',
        loadComponent: () => import('./components/register/register.component').then( m => m.RegisterComponent),
        title: 'Sign Up'
      },
      {
        path: 'login',
        loadComponent: () => import('./components/login/login.component').then( m => m.LoginComponent),
        title: 'Login'
      },
    ]
  },
  {
    path: 'stock',
    children:[
      {
        path: '',            
        loadComponent: () => import('./stock/stock.page').then(m => m.StockPage),
        title: 'In Stock'
      },
      {
        path: 'create',
        loadComponent: () => import('./components/addproduct/addproduct.component').then(m => m.AddproductComponent),
        title: 'Add Product'
      },
      {
        path: 'update',
        loadComponent: () => import('./components/updatestock/updatestock.component').then(m => m.UpdatestockComponent),
        title: 'Update Stock'
      },
    ]
  },
  {
    path: 'product-details/:id',
    loadComponent: () => import('./product-details/product-details.page').then( m => m.ProductDetailsPage),
    title: titleResolver
  },
  {
    path: 'inventory',
    loadComponent: () => import('./inventory/inventory.page').then( m => m.InventoryPage),
    title: "Inventory"
  },
  {
    path: 'sales',
    loadComponent: () => import('./sales/sales.page').then( m => m.SalesPage),
    title: "Sales"
  },
  {
    path: 'team',
    children:[
      {
        path: '',            
        loadComponent: () => import('./team/team.page').then(m => m.TeamPage),
        title: 'Team Overview'
      },
      {
        path: 'create',
        loadComponent: () => import('./components/adduser/adduser.component').then(m => m.AdduserComponent),
        title: 'Add Team Member'
      },
    ]
  },
  {
    path: 'suppliers',
    children:[
      {
        path: '',            
        loadComponent: () => import('./suppliers/suppliers.page').then(m => m.SuppliersPage),
        title: 'Suppliers List'
      },
      {
        path: 'create',
        loadComponent: () => import('./components/addsupplier/addsupplier.component').then(m => m.AddsupplierComponent),
        title: 'Add Supplier'
      },
    ]
  },
  {
    path: 'userEdit',
    loadComponent: () => import('./components/updateuser/updateuser.component').then(m => m.UpdateuserComponent),
    title: 'Edit User'
  },
  {
    path: 'payments',
    loadComponent: () => import('./payments/payments.page').then(m => m.PaymentsPage),
    title: 'Payments'
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then(m => m.ProfilePage),
    title: 'Profile'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage),
    title: 'Dashboard'
  },  
];
