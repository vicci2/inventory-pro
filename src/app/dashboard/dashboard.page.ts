import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonGrid, IonList, IonChip, IonRow, IonCol, IonButton, IonIcon, IonBadge, IonThumbnail, IonTitle, IonButtons, IonAvatar, IonCardHeader, IonCardSubtitle } from '@ionic/angular/standalone';
import { DatatableComponent, ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Metric, WidgitsComponent } from '../components/widgits/widgits.component';
import { SalesService } from '../services/sales.service';
import { StockService } from '../services/stock.service';
import { InventoryService } from '../services/inventory.service';
import { AlertController, ModalController} from '@ionic/angular';
import { CustomModalComponent } from '../components/custom-modal/custom-modal.component';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonContent, IonGrid, IonList, IonChip, IonRow, IonCol, IonButton, IonIcon, IonAvatar, IonCardHeader, IonCardSubtitle, CommonModule, FormsModule, WidgitsComponent, RouterLink, NgxPaginationModule, NgxDatatableModule]
})
export class DashboardPage implements OnInit {
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  ColumnMode = ColumnMode;
  loadingIndicator!: boolean;
  metrics: Metric[] = []
  top10Sales: any[] = []; 
  currentPage: number = 1; 
  itemsPerPage: number = 12;

  constructor(private alertController: AlertController, private modalCtrl: ModalController, private sales:SalesService, private stock:StockService, private inventory:InventoryService) { }

  ngOnInit() {
    this.calculateTotals()
    this.bestSales() 
  }

  calculateTotals() {
    // this.totalRevenue = this.bestSales.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    // this.totalItemsSold = this.bestSales.reduce((sum, item) => sum + item.quantity, 0);
    this.metrics = [
      {
        title: 'Total Stock',
        icon: 'stats-chart-outline',
        value: 890,
        growth: 43,
        // timePeriod: 'Last 30 days',
        unit: "string",
        backgroundColor: '#3cc099',
      },
      {
        title: 'Total Inventory',
        icon: 'layers-outline',
        value: 35,
        growth: 51,
        // timePeriod: 'Last 30 days',
        unit: "string",
        backgroundColor: '#eaf4ff',
      },
      {
        title: 'Total Orders',
        icon: 'receipt-outline',
        value: 12,
        growth: 41,
        // timePeriod: 'Last 30 days',
        unit: "string",
        backgroundColor: '#c2f33dc9',
      },
      {
        title: 'Total Value',
        icon: 'cash-outline',
        value: 112800,
        growth: 60,
        // timePeriod: 'Last 30 days',
        unit: "string",
        backgroundColor: '#eaffea',
      },
    ];
    
  }

  products = [
    {
      name: 'Nike v22 Runnings',
      id: 1001,
      category: 'FITNESS',
      inStore: 25,
      online: 40,
      price: 99.99,
      sku: 'WH12345',
      supplier: 'SportyFeet',
      restockDate: '2024-07-20',
      image: 'assets/nike.png',
    },
    {
      name: 'Business Kit',
      id: 2077,
      category: 'ACCESSORY',
      inStore: 15,
      online: 17,
      price: 59.99,
      sku: 'BK12345',
      supplier: 'TechInnovate',
      restockDate: '2024-07-15',
      image: 'assets/business-kit.png',
    },
    {
      name: 'Black Chair',
      id: 7620,
      category: 'FURNITURE',
      inStore: 40,
      online: 132,
      price: 49.99,
      sku: 'BC2345',
      supplier: 'HomeEssentials',
      restockDate: '2024-07-22',
      image: 'assets/black-chair.png',
    },
    {
      name: 'Wireless Charger',
      id: 3501,
      category: 'ACCESSORY',
      inStore: 8,
      online: 80,
      price: 99.99,
      sku: 'WC12345',
      supplier: 'TechInnovate',
      restockDate: '2024-07-18',
      image: 'assets/wireless-charger.png',
    },
    {
      name: 'Mountain Trip Kit',
      id: 8629,
      category: 'TRAVEL',
      inStore: 5,
      online: 76,
      price: 149.99,
      sku: 'MTK12345',
      supplier: 'HomeEssentials',
      restockDate: '2024-07-25',
      image: 'assets/mountain-trip-kit.png',
    },
  ];

  getAvailabilityColor(quantity: number): string {
    if (quantity > 20) {
      return 'success';
    } else if (quantity > 5) {
      return 'warning';
    } else {
      return 'danger';
    }
  }
  
  handleImageError(event: any) { 
    event.target.src = '../../assets/images/default.jpg';  
  }
  
  getStockClass(stock: number): string {
    if (stock > 30) return 'green';
    if (stock > 10) return 'yellow';
    return 'red';
  }

  async openDetailModal(item: any) {
    const alert = await this.alertController.create({
      header: item.product_name,
      subHeader: `Unit Price: ${item.selling_price}`,
      message: `Quantity Sold: ${item.total_sales}`,
      buttons: ['OK'],
      mode: 'ios',
    });
  
    alert.present(); 
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: CustomModalComponent,
      componentProps: {
        title: 'Confirm Action',
        content: 'Are you sure you want to proceed?',
        icon: 'help-circle-outline',
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

  // Helper methods to get the most and least stocked products
  bestSales() {
    this.stock.getStock().subscribe({
      next: (data: any) => {
        this.top10Sales = data
          .filter((item: { total_sales: number }) => item.total_sales > 0) // Filter out items with zero sales
          .sort((a: { total_sales: number }, b: { total_sales: number }) => b.total_sales - a.total_sales)
          .slice(0, 10);  
        // console.log(this.top10Sales); 
      },
      error: (err) => {
        console.error("Error fetching sales data", err);
      }
    });
  }
  
}
