import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StockService } from 'src/app/services/stock.service';
import { ValidationService } from 'src/app/services/validation.service';
import { NavController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../toast/toast.component';
import { IonTitle, IonContent, IonRow, IonCol, IonButtons, IonButton, IonIcon, IonCardSubtitle, IonItem, IonSelectOption, IonInput, IonText, IonTextarea, IonToolbar, IonGrid, IonSelect} from '@ionic/angular/standalone';
import { SupplierResponse } from 'src/app/interface/supplier.model';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interface/user.model';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ToastComponent, IonContent, IonTitle, IonContent, IonRow, IonCol, IonButtons, IonButton, IonIcon, IonCardSubtitle, IonItem, IonSelectOption, IonInput, IonText, IonTextarea, IonToolbar, IonGrid, IonSelect]
})
export class AddproductComponent  implements OnInit {

  productForm!: FormGroup;
  imageUrl: string | null = null;
  selectedFile: File | null = null;
  toastType: string =''
  toastTitle: string = ''; 
  toastMessage: string = '';
  showToast: boolean = false;
  categories = ['Electronics', 'Furniture', 'Clothing', 'Food', 'Sports']; 
  vendors:SupplierResponse[] = [];
  currentuser!: User

  constructor(private fb: FormBuilder, private navCtrl: NavController, private stockService:StockService, public validationService: ValidationService, private suppliers:SuppliersService, private toastController: ToastController, private authservise:AuthService,) {
  }

  async showToaste(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
  
  ngOnInit() {
    this.initForm();
    this.suppliers.getSuppliers().subscribe({
      next: (response) => {
        // console.log('Suppliers available:', response);
        if (response.length === 0) {
          this.showToaste('No suppliers found! Redirecting...');
          this.goBack()
        } else {
          this.vendors = response;
        }
      },
      error: (error) => {
        this.showToaste('Error fetching suppliers: ' + error.message);
        console.error('Error fetching suppliers:', error);
        this.navCtrl.navigateForward('/suppliers');
      }
    });
  }
  
  initForm(){
    this.productForm = this.fb.group({
      vendor_id: ['', Validators.required],
      category: ['', Validators.required],
      product_name: ['', Validators.required],
      serial_no: ['', Validators.required],
      quantity: ['', Validators.required],
      b_p: ['', Validators.required],
      desc: ['', Validators.required],
      image: ['']
    });
  }  

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;

      // Preview Image
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);

      // Store file in form
      this.productForm.patchValue({ image: file });
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.authservise.currentUser$.subscribe(user =>{
        this.currentuser = user
      })
      const payload = {
        company_id: this.currentuser.company_id,
        vendor_id: this.productForm.value.vendor_id,
        serial_no: this.productForm.value.serial_no,
        product_name: this.productForm.value.product_name,
        category: this.productForm.value.category,
        quantity: this.productForm.value.quantity,
        desc: this.productForm.value.desc,
        b_p: this.productForm.value.b_p,
        image: this.productForm.value.image,
      };
      // console.log(`Payload: `, payload)
      this.stockService.postStock(payload).subscribe({
        next: (response: any) => {
          // console.log("Product created successfully:", response);
          this.goBack()
          this.showToastMessage('success', 'Success', `${response.product_name} has been successfully added!`);
        },
        error: (error: any) => {
          // console.error("Error creating product:", error);
          
          this.showToastMessage(
            'error', 
            'Error', 
            error || "An unexpected error occurred. Please try again."
          );
        }
      });      
    } else {
      this.showToastMessage('warning', 'Warning', 'Please fill in all required fields correctly before submitting.');
    }
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
  
  goBack() {
    this.navCtrl.back();
  }

}
