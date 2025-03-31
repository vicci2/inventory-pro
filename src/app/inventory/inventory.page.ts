import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonGrid, IonRow, IonCol, IonIcon, IonCard, IonCardTitle, IonChip, IonButton, IonSpinner, IonCardContent, IonPopover, IonInput } from '@ionic/angular/standalone';
import { catchError, of, take, timeout } from 'rxjs';
import { Inventory } from '../interface/item.model';
import { Metric, WidgitsComponent } from '../components/widgits/widgits.component';
import { InventoryService } from '../services/inventory.service';
import { Router, RouterLink } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { SearchFilterComponent } from "../components/search-filter/search-filter.component";
import { ValidationService } from '../services/validation.service';
import { AuthService } from '../services/auth.service';
import { SalesService } from '../services/sales.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
  standalone: true,
  imports: [IonPopover, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonCard, IonCardTitle, IonChip, IonButton, IonSpinner, IonCardContent, CommonModule, FormsModule, SearchFilterComponent, WidgitsComponent, RouterLink, ReactiveFormsModule, IonInput]
})
export class InventoryPage implements OnInit {
  
  openAddInventoryModal() {
    throw new Error('Method not implemented.');
  }
  
  isError = false;
  isPopoverOpen: boolean = false
  inventoryData: Inventory[] = [];
  filteredData: Inventory[] = [];
  metrics: Metric[] = [];
  searchQuery: string = '';
  isLoading = false;
  defaultImagePath = '../../assets/images/default.jpg';
  sellForm!: FormGroup
  currentuser:any
  selectedItem: any = null;
  errorText: string =''
    
  constructor(private alertController: AlertController, private inventoryService: InventoryService, private router: Router, private toastController: ToastController, public validationService:ValidationService, private fb: FormBuilder, private authservice:AuthService, private saleservice:SalesService) { }

  ngOnInit() {
    this.getItems();
    this.initForm()
  }

  initForm() {
    this.sellForm = this.fb.group({
      quantity: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      selling_price: ['', [Validators.required, Validators.min(1), Validators.max(900000)]]
    });
  }  
  
  getItems() {
    this.isLoading = true;
    const apiTimeout = 30000; 
    this.inventoryService.getItems().pipe(
      timeout(apiTimeout),
      catchError(() => {
        this.isError = true;
        this.showAlert('Timeout Error', 'Error or timeout occurred. Please try again later.', ['OK'], 'danger');
        this.isLoading = false;
        return of([]); 
      })
    ).subscribe(data => {
      this.inventoryData = data;
      this.calculateTotals()
      this.filteredData = [...this.inventoryData];
      this.isLoading = false;
    });
  }

  calculateTotals() {
    let totalInventory = 0;
    let totalInventoryValue = 0;
    let lowInventoryProducts = 0;

    this.inventoryData.forEach((item) => {
      totalInventory += item.quantity;
      totalInventoryValue += item.quantity * item.base_price;

      if (item.quantity < 10) {lowInventoryProducts++;}
    });
        // Example growth calculation (for inventory value)
        let previousInventoryValue = totalInventoryValue * 0.95;  // Assuming a 5% increase in inventory value
        let inventoryGrowth = ((totalInventoryValue - previousInventoryValue) / previousInventoryValue) * 100;
    
        // Define the metrics array
        this.metrics = [
          { title: 'Total Inventory', value: totalInventory, growth: 0, icon: 'cube-outline', unit: '', backgroundColor:'' },
          { title: 'Total Inventory Value', value: totalInventoryValue, growth: Math.round(inventoryGrowth), icon: 'cash-outline', unit: '', backgroundColor:'' },
          { title: 'Low Inventory Alerts', value: lowInventoryProducts, growth: 0, icon: 'alert-circle-outline', unit: '', backgroundColor:'' },
        ];
  }

  async showAlert(title: string, message: string, buttons: string[], color: string = '') {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: buttons,
      mode: 'ios',
    });
    await alert.present();
  }

  handleImageError(event: any) {
    event.target.src = this.defaultImagePath;
  }
  
  filterData() {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredData = query ? 
      this.inventoryData.filter(item => item.product_name.toLowerCase().includes(query)) : 
      [...this.inventoryData];
  }
  
  refreshData() {
    this.isLoading = true;
    this.inventoryService.getItems().pipe(
      catchError(() => {
        this.showAlert('Refresh Error', 'Failed to refresh sales data. Please try again.', ['OK'], 'danger');
        this.isLoading = false;
        return of([]);
      })
    ).subscribe(data => {
      this.inventoryData = data;
      this.filteredData = [...this.inventoryData];
      this.isLoading = false;
    });
  }

  itemDetails(id: any) {
    this.router.navigate(['/product-details', id]);
  }

  async adjustInventory(inventoryId: number, action: string) {
    let adjustment = action === 'increase' ? 1 : -1;   
    try {
      const response = await this.inventoryService.updateInventory(inventoryId, adjustment, action).toPromise();
      this.refreshData()
      this.showToast(`${action.toUpperCase()} successful! New stock: ${response.quantity}`);
      this.refreshData()
    } catch (error) {
      this.showToast(`Failed to ${action} stock.`);
      console.error(error);
    }
  }
  
  viewInventory() {
    // console.log('View inventory clicked');
    // Implement inventory details logic here (e.g., open a modal)
  }

  openPopover(item: any) {
    this.selectedItem = item;
    this.isPopoverOpen = true;
  }

  sell(item: any, form: FormGroup) {
    if (!item) {
      console.error("No item selected for sale");
      return;
    }
  
    // Get current user safely (only once)
    this.authservice.currentUser$.pipe(take(1)).subscribe(user => {
      if (!user) {
        console.error("No user found");
        return;
      }
  
      const payload = {
        company_id: user.company_id, 
        inventory_id: item.id,  
        ...form.value,
        base_price: item.base_price,
        status: "Pending"
      };
  
      // console.log("Sale Payload:", payload);
  
      const apiTimeout = 30000; 
  
      this.saleservice.postSale(payload).pipe(
        timeout(apiTimeout),
        catchError((error) => {
          // console.error("Sale request failed:", error);
          this.isError = true;
          this.errorText = error
          return of(null); 
        })
      ).subscribe(response => {
        if (response) {
          this.isError = false;
          // console.log("Sale successful:", response);
          this.showToast(`Sale successful! Sold: ${payload.quantity} items at Ksh${payload.selling_price}`);
          this.refreshData()
          this.closePopover(); 
        }
      });
    });
  }
  
  closePopover() {
    this.isPopoverOpen = false;
    this.sellForm.reset(); 
  }
  
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

}
  
/* 
async itemDetails(id: number) {
  try {
    console.log("Fetching details for product ID:", id);

    // Ensure inventoryData is loaded
    if (!this.inventoryData || this.inventoryData.length === 0) {
      console.error("Inventory data is empty or not loaded.");
      return;
    }

    // Find the product in inventory
    const product = this.inventoryData.find(item => item.id === id);
    if (!product) {
      this.showAlert('Item Not Found', `No matching item in inventory for ID ${id}.`, ['OK'], 'warning');
      return;
    }

    console.log("Found product in inventory:", product);

    // Fetch item details from stockService
    const selectedItem = await firstValueFrom(this.stockService.getItem(product.id));

    console.log("Fetched item from stockService:", selectedItem);

    if (selectedItem) {
      this.router.navigate(['/product-details', selectedItem.id]);
    } else {
      this.showAlert('Item Not Found', `No item matches the given product ID ${id}.`, ['OK'], 'warning');
    }
  } catch (error) {
    console.error("Error fetching item details:", error);
    this.showAlert('Error', 'Failed to fetch item details. Please try again.', ['OK'], 'danger');
  }
}

*/