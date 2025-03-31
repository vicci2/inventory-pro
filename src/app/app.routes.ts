import { Routes } from '@angular/router';

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
      },
      {
        path: 'register',
        loadComponent: () => import('./components/register/register.component').then( m => m.RegisterComponent)
      },
      {
        path: 'login',
        loadComponent: () => import('./components/login/login.component').then( m => m.LoginComponent)
      },
    ]
  },
  {
    path: 'stock',
    children:[
      {
        path: '',            
        loadComponent: () => import('./stock/stock.page').then( m => m.StockPage)
      },
      {
        path: 'create',
        loadComponent: () => import('./components/addproduct/addproduct.component').then(m => m.AddproductComponent)
      },
      {
        path: 'update',
        loadComponent: () => import('./components/updatestock/updatestock.component').then(m => m.UpdatestockComponent)
      },
    ]
  },
  {
    path: 'product-details/:id',
    loadComponent: () => import('./product-details/product-details.page').then( m => m.ProductDetailsPage)
  },
  {
    path: 'inventory',
    loadComponent: () => import('./inventory/inventory.page').then( m => m.InventoryPage)
  },
  {
    path: 'sales',
    loadComponent: () => import('./sales/sales.page').then( m => m.SalesPage)
  },
  {
    path: 'team',
    children:[
      {
        path: '',            
        loadComponent: () => import('./team/team.page').then( m => m.TeamPage)
      },
      {
        path: 'create',
        loadComponent: () => import('./components/adduser/adduser.component').then(m => m.AdduserComponent)
      },
    ]
  },
  {
    path: 'suppliers',
    children:[
      {
        path: '',            
        loadComponent: () => import('./suppliers/suppliers.page').then( m => m.SuppliersPage)
      },
      {
        path: 'create',
        loadComponent: () => import('./components/addsupplier/addsupplier.component').then(m => m.AddsupplierComponent)
      },
    ]
  },
  {
    path: 'userEdit',
    loadComponent: () => import('./components/updateuser/updateuser.component').then(m => m.UpdateuserComponent)
  },
  {
    path: 'payments',
    loadComponent: () => import('./payments/payments.page').then( m => m.PaymentsPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then( m => m.DashboardPage)
  },
];
