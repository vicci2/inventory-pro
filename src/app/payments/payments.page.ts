import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonGrid, IonRow, IonCol, IonCardTitle, IonCardSubtitle, IonButtons, IonButton, IonIcon, IonCard, IonSearchbar, IonPopover, IonList, IonItem, IonCheckbox, IonLabel, IonChip } from '@ionic/angular/standalone';
import { ColumnMode, DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SubscriptionService } from '../services/subscription.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
  standalone: true,
  imports: [IonContent, IonGrid, IonRow, IonCol, IonCardTitle, IonCardSubtitle, IonButtons, IonButton, IonIcon, IonCard, IonSearchbar, IonPopover, IonList, IonItem, IonCheckbox, IonLabel, IonChip,CommonModule, FormsModule, NgxDatatableModule]
})
export class PaymentsPage implements OnInit {

  segment_value = 'payments';
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  ColumnMode = ColumnMode;
  loadingIndicator = true;
  rows: any[] = [];
  selectedFilters: string[] = [];
  isFilterOpen = false;
  filterEvent: any;
  
  filterOptions = [
    { label: 'Bestselling', value: 'option1', selected: false },
    { label: 'Last30days', value: 'option2', selected: false }
  ];

  temp = [
    { id: 1001, name: 'Nike v22 Runnings', category: 'FITNESS', inStore: 25, online: 40, price: 'ksh99.99', sku: 'WH12345', supplier: 'SportyFeet', restockDate: '2024-07-20', image: 'assets/nike.png' },
    { id: 2077, name: 'Business Kit', category: 'ACCESSORY', inStore: 15, online: 17, price: 'ksh59.99', sku: 'BK12345', supplier: 'TechInnovate', restockDate: '2024-07-15', image: 'assets/business-kit.png' },
    { id: 7620, name: 'Black Chair', category: 'FURNITURE', inStore: 40, online: 132, price: 'ksh49.99', sku: 'BC2345', supplier: 'HomeEssentials', restockDate: '2024-07-22', image: 'assets/black-chair.png' },
    { id: 3501, name: 'Wireless Charger', category: 'ACCESSORY', inStore: 8, online: 80, price: 'ksh99.99', sku: 'WC12345', supplier: 'TechInnovate', restockDate: '2024-07-18', image: 'assets/wireless-charger.png' },
    { id: 8629, name: 'Mountain Trip Kit', category: 'TRAVEL', inStore: 5, online: 76, price: 'ksh149.99', sku: 'MTK12345', supplier: 'HomeEssentials', restockDate: '2024-07-25', image: 'assets/mountain-trip-kit.png' },
  ];

  constructor(private subscription: SubscriptionService,) {}

  ngOnInit() {
    setTimeout(() => {
      this.rows = [...this.temp];
      this.loadingIndicator = false;
    }, 1000);
  }

  changeSegment(event: any) {
    this.segment_value = event.detail.value;
  }

  updateFilter(event: any) {
    const val = event.detail.value.toLowerCase();
    this.rows = this.temp.filter(item => 
      item.name.toLowerCase().includes(val) ||
      item.sku.toLowerCase().includes(val) ||
      item.id.toString().includes(val)
    );
    this.table.offset = 0;
  }

  toggleFilter(filter: string) {
    if (this.selectedFilters.includes(filter)) {
      this.selectedFilters = this.selectedFilters.filter(f => f !== filter);
    } else {
      this.selectedFilters.push(filter);
    }
    this.applyFilters();
  }

  applyFilters() {
    this.selectedFilters = this.filterOptions
      .filter(option => option.selected)
      .map(option => option.value);
      let filteredData = [...this.temp];
  
    console.log('Selected Filters:', this.selectedFilters);
  
    if (this.selectedFilters.includes('option1')) {
        this.temp = this.temp.filter(item => item.category === 'Fitness');
    }
  
    if (this.selectedFilters.includes('option2')) {
      console.log('Applying filter logic for Option 2');
      // Do something for Option 2
    }
  
    if (this.selectedFilters.includes('option2')) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filteredData = filteredData.filter(item => new Date(item.restockDate) >= thirtyDaysAgo);
    }
      
    // if (this.filters.includes('bestselling')) {
    // }
  
    // if (this.filters.includes('last30days')) {
    //   const thirtyDaysAgo = new Date();
    //   thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    //   filteredData = filteredData.filter(item => new Date(item.restockDate) >= thirtyDaysAgo);
    // }
    this.isFilterOpen = false; // Close popover
  }

  clearFilters() {
    this.filterOptions.forEach(option => option.selected = false);
    this.selectedFilters = [];
    this.applyFilters();
  }

  getStockColor(quantity: number): string {
    return quantity <= 10 ? 'danger' : quantity <= 20 ? 'warning' : 'success';
  }

  handleImageError(event: any) {
    event.target.src = 'assets/images/default.jpg';
  }  

  openFilterPopover(event: Event) {
    this.filterEvent = event;
    this.isFilterOpen = true;
  }

  getFilterLabel(value: string): string {
    // Find the label corresponding to the value
    const option = this.filterOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  }

  search(searchQuery: string = '') {
    let filteredData = [...this.temp];

    if (searchQuery) {
      filteredData = filteredData.filter(item => 
        item.name.toLowerCase().includes(searchQuery) ||
        item.sku.toLowerCase().includes(searchQuery) ||
        item.id.toString().includes(searchQuery)
      );
    }
    this.rows = filteredData;
    this.table.offset = 0;
  }

}
