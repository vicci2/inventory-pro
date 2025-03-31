import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonGrid, IonRow, IonCol, IonButton, IonList, IonChip, IonSpinner, IonSearchbar, IonIcon, IonItem, IonCheckbox, IonButtons, IonPopover, IonCard, IonCardTitle, IonCardSubtitle, IonLabel  } from '@ionic/angular/standalone';
import { Sale } from '../interface/saleModel';
import { Metric, WidgitsComponent } from '../components/widgits/widgits.component';
import { ColumnMode, DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SalesService } from '../services/sales.service';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { CustomModalComponent } from '../components/custom-modal/custom-modal.component';
import { catchError, of, timeout } from 'rxjs';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss'],
  standalone: true,
  imports: [IonContent, IonGrid, IonRow, IonCol, IonButton, IonList, IonChip, IonSpinner, IonSearchbar, IonIcon, IonItem, IonCheckbox, IonButtons, IonPopover, IonCard, IonCardTitle, IonCardSubtitle, IonLabel, CommonModule, FormsModule, NgxDatatableModule, WidgitsComponent]
})
export class SalesPage implements OnInit {
  isLoading = false;
  isError = false;
  salesData: Sale[] = [];
  totalQuantity!: number;
  totalRevenue!: number;
  metrics: Metric[] = []
  
  isFilterOpen = false;
  filterEvent: any;
  selectedFilters: string[] = [];
  
  // ngx table 
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  ColumnMode = ColumnMode;
  rows: any[] = [];
  loadingIndicator = true;
  
  // Filter options
  filterOptions = [
    { label: 'Option 1', value: 'option1', selected: false },
    { label: 'Option 2', value: 'option2', selected: false },
    { label: 'Option 3', value: 'option3', selected: false },
    { label: 'Option 4', value: 'option4', selected: false }
  ];

  
  constructor(private saleService:SalesService, private alert:AlertController, private route:Router, private modalCtrl: ModalController,) { }

  ngOnInit() {
    setTimeout(() => {
      this.getSales()
      this.loadingIndicator = false;
    }, 1000);
  }
  
  getSales() {
    this.isLoading = true;
    const apiTimeout = 30000; 
    this.saleService.getSales().pipe(
      timeout(apiTimeout),
      catchError((error) => {
        this.isError = true;
        // console.error('Error or timeout occurred:', error);
        this.showAlert('Tmeout Error', 'Error or timeout occurred. Please try again later.', ['OK'], 'danger');
        return of([]); 
      })
    ).subscribe({
      next: (data: any) => {
        this.salesData = data;
        this.rows = data;
        this.calculateTotals();
        // this.filteredData = [...this.salesData];
        // console.log('Data:', this.filteredsalesData);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.showAlert('Error', 'Unable to load stock data. Please try again later.', ['OK'], 'danger');
      }
    });
  }

  calculateTotals() {
    this.totalQuantity = this.salesData.reduce((sum, sale) => sum + sale.quantity, 0);
    this.totalRevenue = this.salesData.reduce((sum, sale) => sum + sale.selling_price, 0);
    
    // Calculate Total Profit (assuming you have a 'cost' property in each sale)
    const totalCost = this.salesData.reduce((sum, sale) => sum + sale.base_price, 0);
    const totalProfit = this.totalRevenue - totalCost;
    
    // Calculate Avg Selling Price (if totalQuantity is not zero to avoid division by zero)
    const avgSellingPrice = this.totalQuantity > 0 ? this.totalRevenue / this.totalQuantity : 0;
  
    this.metrics = [
      { title: 'Total Sales', value: this.totalRevenue, growth: 30, icon: 'cash-outline', unit: '', backgroundColor:'' },
      { title: 'Total Profit', value: totalProfit, growth: -22, icon: 'trending-up-outline', unit: '', backgroundColor:'' },
      { title: 'Units Sold', value: this.totalQuantity, growth: 42, icon: 'cart-outline', unit: '', backgroundColor:'' },
      // { title: 'Avg Selling Price', value: avgSellingPrice, growth: 12, icon: 'pricetag-outline', unit: '', backgroundColor:'' },
      // You can uncomment the others if you have the data for them:
      // { title: 'Completed Sales', value: 1200, growth: 213, icon: 'checkmark-circle-outline', unit: '', backgroundColor:'' },
      // { title: 'Pending Sales', value: 1200, growth: 213, icon: 'time-outline', unit: '', backgroundColor:'' },
      // { title: 'Slowest Seller', value: 1388, growth: -11, icon: 'trending-down-outline' }
    ];
  }
  
  async showAlert(title: string, message: string, buttons: string[], color: string = '') {
      const alert = await this.alert.create({
        header: title,
        message: message,
        buttons: buttons,
        mode: 'ios',
      });
      await alert.present();
    }
  
  handleImageError(event: any) { 
      event.target.src = '../../assets/images/default.jpg';  
  }
    
  refreshData() {
    this.isLoading = true;
    this.saleService.getSales().subscribe({
      next: (data: any) => {
        this.salesData = data; 
        this.isLoading = false;
      },
    error: (error) => {
    this.isLoading = false;
    this.showAlert('Refresh Error', 'Failed to refresh sales data. Please try again.', ['OK'], 'danger');
    }
    });
  }

  itemDetails(id:any){
    // console.log(`Selected ID: ${id}`)
    this.route.navigate(['/product-details', id]);
    // [routerLink]="['./', stockItem.id]"
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: CustomModalComponent,
      componentProps: {
        title: 'delete record',
        content: 'Are you sure you want to remove sale record?',
        icon: 'trash-bin-sharp',
        backdropDismiss: false,
        button: {
          text: 'Confirm',
          handler: async (modalRef: HTMLIonModalElement) => {
            console.log('Action confirmed!');
            await this.modalCtrl.dismiss();
          }
        }
      },
      cssClass: 'custom-modal',
      backdropDismiss: false, 
    });
  
    await modal.present();
  }

  openFilterPopover(event: Event) {
    this.filterEvent = event;
    this.isFilterOpen = true;
  }

  applyFilters() {
    // Collect selected filters
    this.selectedFilters = this.filterOptions
      .filter(option => option.selected)
      .map(option => option.value);

    console.log('Selected Filters:', this.selectedFilters);
    this.isFilterOpen = false; // Close popover
  }

  clearFilters() {
    this.filterOptions.forEach(option => option.selected = false);
    this.selectedFilters = [];
  }

  removeFilter(filterValue: string) {
    // Uncheck the option
    const option = this.filterOptions.find(opt => opt.value === filterValue);
    if (option) {
      option.selected = false;
    }
    // Remove from selected filters
    this.selectedFilters = this.selectedFilters.filter(f => f !== filterValue);
  }

  getFilterLabel(value: string): string {
    // Find the label corresponding to the value
    const option = this.filterOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  }  
}
