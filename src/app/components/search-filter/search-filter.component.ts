import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class SearchFilterComponent  implements OnInit {

  @Input() data: any[] = []; 
  @Input() entityType: string = 'item';
  @Input() searchKey: string = 'name'; 
  @Input() displayKey: string = 'name';
  @Output() filteredResults = new EventEmitter<any[]>(); 
  @Output() addEntity = new EventEmitter<void>();
  
  searchQuery: string = '';
  filteredData: any[] = [];
  relatedResults: any[] = [];

  constructor() {
  }

  ngOnInit() {
    this.filteredData = [...this.data];
  }

  filterData() {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      this.filteredData = [...this.data];
    } else {
      this.filteredData = this.data.filter(item =>
        item[this.searchKey]?.toString().toLowerCase().includes(query)
      );
    }

    // Emit the filtered data back to the parent
    this.filteredResults.emit(this.filteredData);
  }

  clearSearch() {
    this.searchQuery = '';
    this.filterData();
  }

  selectSuggestion(item: any) {
    this.searchQuery = item[this.displayKey];
    this.filterData();
  }

  addNewEntity() {
    this.addEntity.emit();
  }

}
