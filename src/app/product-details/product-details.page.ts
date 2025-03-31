import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonTitle, IonToolbar,  IonRow, IonCol, IonButtons, IonButton, IonIcon, IonCardSubtitle, IonCardContent, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonNote, IonGrid, IonSegment, IonSegmentButton, IonSpinner, IonTextarea  } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { StockService } from '../services/stock.service';
import { SalesService } from '../services/sales.service';
import { catchError, of, timeout } from 'rxjs';
import { AlertController, NavController } from '@ionic/angular';

interface Timeline {
  createdAt: string | null;
  updatedAt: string | null;
}

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
  standalone: true,
  imports: [IonContent, IonTitle, IonToolbar, IonRow, IonCol, IonButtons, IonButton, IonIcon, IonCardSubtitle, IonCardContent, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonNote,  CommonModule,  IonGrid, IonSegment, IonSegmentButton, IonSpinner, IonTextarea, FormsModule]
})
export class ProductDetailsPage implements OnInit {

  loadedItem: any | null = null;
  infoCards: any = {};
  segment_value = 'stock';
  displayedCards: any[] = [];
  isLoading = false;
  loading: boolean = true;
  defaultImagePath = '../../assets/images/default.jpg';
  selectedTimeline: Timeline = { createdAt: null, updatedAt: null };

  constructor(
    private navCtrl: NavController,
    private activeRoute: ActivatedRoute,
    private alert: AlertController,
    private router: Router,
    private itemService:StockService, private sale:SalesService
  ) {}

  ngOnInit() {
    this.activeRoute.paramMap.subscribe(paramMap => {
      const itemId = paramMap.get('id');
      if (!itemId) {
        this.navCtrl.back();
        return;
      }
      this.getItem(itemId);
    });
  }

  getItem(itemId: string) {
    this.isLoading = true;
    const apiTimeout = 30000;
    this.itemService.getItem(itemId).pipe(
      timeout(apiTimeout),
      catchError(error => {
        console.error('Error or timeout occurred:', error);
        this.isLoading = false;
        this.showItemNotFoundAlert();
        return of(null);
      })
    ).subscribe(data => {
      this.isLoading = false;
      if (!data) {
        this.showAlert('Error', 'Unable to load stock data. Please try again later.', ['OK'], 'danger');
        return;
      }
      this.loadedItem = data;     
      this.sale.getSales()
      this.updateInfoCards();
      this.updateDisplayedCards();
      // Update timeline based on selected segment
      if (this.segment_value === 'inventory') {
        this.selectedTimeline = {
          createdAt: this.loadedItem.inventory_created_at,
          updatedAt: this.loadedItem.inventory_last_updated
        };
      } else if (this.segment_value === 'stock') {
        this.selectedTimeline = {
          createdAt: this.loadedItem.date,
          updatedAt: this.loadedItem.last_updated
        };
      } else if (this.segment_value === 'sales') {
        this.selectedTimeline = {
          createdAt: this.loadedItem.sold_at,
          updatedAt: ''
        };
      console.log("Loaded item:", this.selectedTimeline)
    }else {
      // this.selectedTimeline = null; 
    }
    });
  }

  showItemNotFoundAlert() {
    this.alert.create({
      header: 'Item not found',
      message: 'The item you are looking for does not exist.',
      mode: 'ios',
      buttons: [{
        text: 'OK',
        handler: () => this.router.navigate(['/home'])
      }]
    }).then(alertEl => alertEl.present());
  }

  changeSegment(event: any) {
    this.segment_value = event.detail.value;
    this.updateDisplayedCards();
  }

  buildInfoCard(title: string, icon: string, value: any, unit: string = '', color: string,) {
    return { title, icon, value: value ?? 'N/A', unit, color };
  }

  updateInfoCards() {
    if (!this.loadedItem) return;
  
    const buyPrice = `KES ${this.loadedItem.b_p || 'N/A'}`;
    const sellPrice = `KES ${this.loadedItem.selling_price || 'N/A'}`;
    const totalValue = (this.loadedItem.quantity ?? 0) * (this.loadedItem.selling_price ?? 0);
    this.infoCards = {
      stock: [
        this.buildInfoCard('Stock', 'stats-chart-outline', this.loadedItem.quantity || 0, 'units', 'secondary'),
        this.buildInfoCard('Total Value', 'cash-outline', Number(totalValue.toFixed(2)), 'KES', 'primary')
      ],
      inventory: [
        this.buildInfoCard('Inventory', 'layers-outline', this.loadedItem.inventory_quantity || 0, 'units', 'secondary'),
        this.buildInfoCard('Buy Price', 'alert-circle-outline', buyPrice, 'per unit', 'primary'),
        this.buildInfoCard('Sell Price', 'cash-outline', sellPrice, 'per unit', 'success')
      ],
    };
    this.sale.getSales().subscribe(sales => {
      const filteredSales = sales.filter(sale => sale.inventory_id === this.loadedItem.inventory_id);
      // console.log(filteredSales);
    
      const salesQtty = filteredSales.reduce((sum, sale) => sum + (sale.quantity ?? 0), 0); 
      const revenue = salesQtty * (this.loadedItem.selling_price ?? 0);
    
      // Ensure `this.infoCards` exists before modifying it
      if (!this.infoCards) {
        this.infoCards = {};
      }
    
      this.infoCards.sales = [
        this.buildInfoCard('Total Sales', 'pricetags-outline', salesQtty, 'units', 'success'),
        this.buildInfoCard('Revenue', 'cash-outline', revenue, 'KES', 'primary')
      ];
    });
    
  }
  
  updateDisplayedCards() {
    this.displayedCards = this.infoCards[this.segment_value] || [];
  }

  handleImageError(event: any) {
    this.loading = false; 
    event.target.src = this.defaultImagePath;
  }

  async showAlert(title: string, message: string, buttons: string[], color: string = '') {
    const alert = await this.alert.create({
      header: title,
      message: message,
      buttons: buttons,
      mode: 'ios'
    });
    await alert.present();
  }

  goBack() {
    this.navCtrl.back();
  }

}
