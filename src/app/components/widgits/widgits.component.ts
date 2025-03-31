import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

export interface Metric {
  title: string;
  icon: string;
  value: number;
  growth: number;
  unit?: string;
  backgroundColor: string;
}

@Component({
  selector: 'app-widgits',
  templateUrl: './widgits.component.html',
  styleUrls: ['./widgits.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule],
})
export class WidgitsComponent  implements OnInit {

  @Input() metric!: Metric;

  constructor() {}

  ngOnInit() {}

  getIcon(growth: number, defaultIcon: string): string {
    if (growth < 1) return 'alert-circle-outline';
    if (growth >= 10 && growth <= 40) return 'warning-outline';
    return defaultIcon;
  }

  getGrowthLabel(growth: number): string {
    if (growth < 1) return 'Alert';
    if (growth >= 10 && growth <= 40) return 'Low';
    return 'Optimal';
  }

  isSpecialTitle(title: string): boolean {
    const specialKeywords = ['Sales', 'Stock Value', 'Inventory Value', 'Total Value'];
    return specialKeywords.some(keyword => title.includes(keyword));
  }  

  getFormattedValue(title: string, value: number): string | number {
    if (!this.isSpecialTitle(title)) return value;
    if (value < 1) return 'No Value';
    if (value >= 1 && value <= 10) return 'Low Value';
    return value; 
  }

  getGrowthClass(growth: number): string {
    return growth > 40 ? 'optimal' : growth < 0 ? 'negative' : 'low'  
  }

}
