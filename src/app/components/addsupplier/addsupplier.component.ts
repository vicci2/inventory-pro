import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { ValidationService } from 'src/app/services/validation.service';
import { NavController } from '@ionic/angular';
import { IonTitle, IonContent, IonRow, IonCol, IonButtons, IonButton, IonIcon, IonCardSubtitle, IonInput, IonToolbar, IonGrid} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interface/user.model';

@Component({
  selector: 'app-addsupplier',
  templateUrl: './addsupplier.component.html',
  styleUrls: ['./addsupplier.component.scss'],
  imports:[IonTitle, IonContent, IonRow, IonCol, IonButtons, IonButton, IonIcon, IonCardSubtitle, IonInput, IonToolbar, IonGrid, ReactiveFormsModule]
})
export class AddsupplierComponent  implements OnInit {

  supplierForm!: FormGroup;
  toastType: string =''
  toastTitle: string = ''; 
  toastMessage: string = '';
  showToast: boolean = false;
  currentuser!: User

  constructor(private navCtrl: NavController, private fb: FormBuilder, private supplier:SuppliersService,  public validationService: ValidationService, private authservise:AuthService,) { }

  ngOnInit() {
    this.supplierForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9#.,\\-\\s]+$')]],
      tel_no: ['', [Validators.required, Validators.pattern('^[+]*[0-9]{1,3}[ -]*[0-9]+$')],],
    });
  }

  goBack() {
    this.navCtrl.back();
  }
  
  onSubmit() {
    if (this.supplierForm.valid) {
      this.authservise.currentUser$.subscribe(user =>{
        this.currentuser = user
      })

      const payload = {
        ...this.supplierForm.value,
        company_id: this.currentuser.company_id,
      };
      // console.log('Form Submitted!', payload);
      this.supplier.addSupplier(payload).subscribe({
        next:(response) =>{
          if (response) {
            this.goBack()
            this.showToastMessage('success','Supplier Added successfully!',  `Supplier ${this.supplierForm.value.name} Registered`);
          } else {
            this.showToastMessage('warning', 'Registration Failed', 'Please try again.');
          }
      },
      error: (error) => {
        this.showToastMessage('error', 'Error', error.message || 'An unexpected error occurred.');
      }
    })
    }  
    else{
      this.showToastMessage('warning', 'Invalid Input', 'Please fill all required fields.');
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

}
