import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonButton, IonIcon, IonSpinner,IonChip } from '@ionic/angular/standalone';
import { Stock } from '../interface/stockModel';
import { Router, RouterLink } from '@angular/router';
import { timeout, catchError, of, firstValueFrom } from 'rxjs';
import { Metric, WidgitsComponent } from '../components/widgits/widgits.component';
import { StockService } from '../services/stock.service';
import { InventoryService } from '../services/inventory.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Inventory } from '../interface/item.model';
import { CustomModalComponent } from '../components/custom-modal/custom-modal.component';
import { SearchFilterComponent } from "../components/search-filter/search-filter.component";

@Component({
  selector: 'app-stock',
  templateUrl: './stock.page.html',
  styleUrls: ['./stock.page.scss'],
  standalone: true,
  imports: [IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonButton, IonIcon, IonSpinner, IonChip, IonContent, CommonModule, FormsModule, RouterLink, SearchFilterComponent, WidgitsComponent]
})
export class StockPage implements OnInit {
openAddInventoryModal() {
throw new Error('Method not implemented.');
}
  isError = false;
  stockData: any[] = [];
  filteredData: Stock[] = [];
  searchQuery: string = '';
  isLoading = false;
  metrics: Metric[] = []
  inventoryData: any;

  constructor(private alertController: AlertController, private stockService:StockService, private router: Router, private item:InventoryService, private modalCtrl: ModalController) { 
  }

  ngOnInit() {
    this.getStock();
  }
  
  getStock() {
    this.isLoading = true;
    const apiTimeout = 30000; 
    this.stockService.getStock().pipe(
      timeout(apiTimeout),
      catchError((error) => {
        this.isError = true;
        // console.error('Error or timeout occurred:', error);
        this.showAlert('Tmeout Error', 'Error or timeout occurred. Please try again later.', ['OK'], 'danger');
        return of([]); 
      })
    ).subscribe({
      next: (data: any) => {
        this.stockData = data;
        this.calculateTotals()
        this.filteredData = [...this.stockData];
        // console.log('Data:', this.filteredStockData);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.showAlert('Error', 'Unable to load stock data. Please try again later.', ['OK'], 'danger');
      }
    });
  }

  calculateTotals() {
    let totalStock = 0;
    let totalStockValue = 0;
    let lowStockProducts: number = 0;

    this.stockData.forEach(stock => {
      totalStock += stock.quantity;
      totalStockValue += stock.quantity * stock.b_p;

      if (stock.quantity < 10) {lowStockProducts++;}
    });
    
    // Example growth calculation for stock value (assuming previous stock value for comparison)
    let previousStockValue = totalStockValue * 0.95; 
    let stockGrowth = ((totalStockValue - previousStockValue) / previousStockValue) * 100;
//     let totalStockGrowth = previousStock ? 
//     ((totalStock - previousStock.totalStock) / previousStock.totalStock) * 100 : 0;

// let lowStockGrowth = previousStock ? 
//     ((lowStockProducts - previousStock.lowStockProducts) / previousStock.lowStockProducts) * 100 : 0;

    
    this.metrics = [
      { title: 'Total Stock', value: totalStock, growth: 0, icon: 'cube-outline', unit: '', backgroundColor:'' },
      { title: 'Total Stock Value', value: totalStockValue, growth: Math.round(stockGrowth), icon: 'cash-outline', unit: '', backgroundColor:'' },
      { title: 'Low Stock Alerts', value: lowStockProducts, growth: 0, icon: 'alert-circle-outline', unit: '', backgroundColor:'' },
      // { title: 'Most Stocked Product', value: this.getMostStockedProduct(), growth: 0, icon: 'star-outline', unit: '', backgroundColor:'' },
      // { title: 'Least Stocked Product', value: this.getLeastStockedProduct(), growth: 0, icon: 'trending-down-outline', unit: '', backgroundColor:'' }
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
    // event.target.src = 'https://fakeimg.pl/120x120?text=Image+Not+Available&font=museo&font_size=10';  
    event.target.src = '../../assets/images/default.jpg';  
  }

  filterData() {
    const query = this.searchQuery.trim().toLowerCase();
    if (query === '') {
      // Return all stockData when no search query
      this.filteredData = [...this.stockData];
    } else {
      // Filter stockData based on the query
      this.filteredData = this.stockData.filter((item: Stock) =>
        item.product_name.toLowerCase().includes(query)
      );
    }
  }

  refreshData() {
    this.isLoading = true;
    this.stockService.getStock().pipe(
      catchError(() => {
        this.showAlert('Refresh Error', 'Failed to refresh Stock data. Please try again.', ['OK'], 'danger');
        this.isLoading = false;
        return of([]);
      })
    ).subscribe(data => {
      this.inventoryData = data;
      this.filteredData = [...this.inventoryData];
      this.isLoading = false;
    });
  }

  async itemDetails(productId: any) {
    try {
      // Fetch the item using stockService
      const selectedItem = await firstValueFrom(this.stockService.getItem(productId));
  
      if (selectedItem) {
        this.router.navigate(['/product-details', selectedItem.id]);
      } else {
        this.showAlert('Item Not Found', 'No item matches the given product ID.', ['OK'], 'warning');
      }
    } catch (error) {
      this.showAlert('Error', 'Failed to fetch item details. Please try again.', ['OK'], 'danger');
    }
  }  

  async updateDetails(productId: any) {
    try {
      this.router.navigate(['/stock/update'], { queryParams: { itemId: productId } });
    } catch (error) {
      this.showAlert('Error', 'Failed to fetch items. Please try again.', ['OK'], 'danger');
    }
  }

  // Helper methods to get the most and least stocked products
  getMostStockedProduct() {
    let mostStocked = this.stockData.reduce((max, current) => (current.quantity > max.quantity ? current : max), this.stockData[0]);
    return mostStocked.product_name;
  }

  getLeastStockedProduct() {
    let leastStocked = this.stockData.reduce((min, current) => (current.quantity < min.quantity ? current : min), this.stockData[0]);
    return leastStocked.product_name;
  }
  
  async openModal(title: string, itemId?: number) {
    const componentProps =
      title === 'avail'
        ? {
            title: 'Avail Item',
            content: 'Are you sure you want to avail this item?',
            icon: 'checkmark-circle-outline',
            backdropDismiss: false,
            button: {
              text: 'Confirm',
              handler: async (modalRef: HTMLIonModalElement) => {
                // console.log('Item availed!');
                if (itemId) {  
                  await this.avail(itemId);
                }
                await modal.dismiss();
              }
            }
          }
        : {
            title: 'Delete Stock',
            content: 'Are you sure you want to permanently remove this item?',
            icon: 'trash-bin-outline',
            backdropDismiss: false,
            button: {
              text: 'Confirm',
              handler: async (modalRef: HTMLIonModalElement) => {
                if (title === 'delete' && itemId) {
                  await this.deleteItem(itemId);
                }
                await modal.dismiss();
              }
            }
          };
  
    const modal = await this.modalCtrl.create({
      component: CustomModalComponent,
      componentProps,
      cssClass: 'custom-modal',
      backdropDismiss: false
    });
  
    await modal.present();
  }

  async avail(id: number) {
    const stockItem = this.stockData.find(item => item.id === id);

    if (!stockItem) {
      console.error("Stock item not found");
      return;
    }
    const payload = {
      company_id: stockItem.company_id,
      quantity: 1,
      base_price: Number(stockItem.b_p), 
      serial_no: stockItem.serial_no
    };        

    // console.log("Sending payload:", payload); 
    this.stockService.availStock(id, payload).subscribe(
      async (response) => {
        // console.log("Item availed successfully:", response);
        this.refreshData()
      },
      (error) => {
        // console.error("Error availing item:", error);
      }
    );
  } 

  async deleteItem(id: number) {
    this.stockService.deleteStockItem(id).subscribe(
      async (response) => {
        // console.log("Item deleted successfully:", response);
        this.refreshData()
      },
      (error) => {
        // console.error("Error deleting item:", error);
      }
    );
  }  

}
