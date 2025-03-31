import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StockService } from 'src/app/services/stock.service';
import { NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../toast/toast.component';
import { IonTitle, IonContent, IonRow, IonCol, IonButtons, IonButton, IonIcon, IonCardSubtitle, IonSelectOption, IonInput, IonTextarea, IonToolbar, IonSelect, IonGrid} from '@ionic/angular/standalone';

@Component({
  selector: 'app-updatestock',
  templateUrl: './updatestock.component.html',
  styleUrls: ['./updatestock.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, ToastComponent, IonTitle, IonContent, IonRow, IonCol, IonButtons, IonButton, IonIcon, IonCardSubtitle, IonSelectOption, IonInput, IonTextarea, IonToolbar, IonSelect, IonGrid],
})
export class UpdatestockComponent  implements OnInit {

  selectedItem: any = null;
  productForm!: FormGroup;
  toastType: string =''
  toastTitle: string = ''; 
  toastMessage: string = '';
  showToast: boolean = false;

  constructor(
    private navCtrl: NavController,
    private fb: FormBuilder,
    private stockService: StockService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      product_name: ['', Validators.required],
      category: ['', Validators.required],
      desc: [''],
      quantity: [0, [Validators.required, Validators.min(1)]],
      b_p: [0, [Validators.required, Validators.min(0)]]
    });

    this.route.queryParams.subscribe(params => {
      const itemId = +params['itemId'];
      if (!itemId) return;

      this.stockService.getItem(itemId).subscribe(
        (data) => {
          if (!data) {
            console.error("Error: Item not found.");
            return;
          }
          this.selectedItem = data;
          // console.log("Fetched Item:", this.selectedItem);

          this.productForm.patchValue({
            product_name: data.product_name,
            category: data.category,
            desc: data.desc,
            quantity: data.quantity,
            b_p: data.b_p
          });
        },
        (error) => {
          console.error("Error fetching item:", error);
        }
      );
    });
  }
  
  onSubmit() {
    if (this.productForm.valid) {
      // console.log('Updated Product Details:', this.productForm.value);
      this.stockService.updateStockItem(this.selectedItem.id, this.productForm.value).subscribe(
        (response) => {
          // console.log("Product updated successfully", response);
          this.goBack(); 
        },
        (error) => {
          console.error("Error updating product:", error);
          this.showToastMessage(
            'error', 
            'Error', 
            error || "An unexpected error occurred. Please try again."
          );
        }
      );
    }
  }
  
  goBack() {
    this.navCtrl.back();
  }

  showToastMessage(type: 'success' | 'error' | 'warning', title: string, message: string) {
    this.toastType = type;
    this.toastTitle = title;
    this.toastMessage = message;
    this.showToast = true;

    // Hide toast after 3 seconds
    setTimeout(() => {
      this.showToast = false;
    }, 5000);
  }

}
