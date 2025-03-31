import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ValidationService } from 'src/app/services/validation.service';
import { NavController } from '@ionic/angular';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { IonTitle, IonContent, IonRow, IonCol, IonButtons, IonButton, IonIcon, IonCardSubtitle, IonInput, IonToolbar, IonGrid, IonItem, IonLabel, IonImg, IonSelectOption, IonText, IonSelect} from '@ionic/angular/standalone';
import { ToastComponent } from "../toast/toast.component";
import { User } from 'src/app/interface/user.model';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss'],
  imports: [
    ReactiveFormsModule, IonTitle, IonContent, IonRow, IonCol, IonButtons, IonButton, IonIcon, IonCardSubtitle, IonInput, IonToolbar, IonGrid, IonItem, IonLabel, IonImg, IonSelectOption, IonText, IonSelect, ToastComponent, CommonModule
]
})
export class AdduserComponent  implements OnInit {

  userForm: FormGroup;
  imageUrl: string | null = null;
  selectedFile: File | null = null;
  toastType: string =''
  toastTitle: string = ''; 
  toastMessage: string = '';
  showToast: boolean = false;
  currentuser!: User

  constructor(private fb: FormBuilder, private navCtrl: NavController, private authservise:AuthService, public validationService: ValidationService) {
    this.userForm = this.fb.group({
      fullName: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      tel_no: new FormControl('', [Validators.required,  Validators.pattern(/^\+?\d{10,15}$/)]),
      role: new FormControl('user', [Validators.required]),
      avatar: new FormControl('', [])
    });
  }

  ngOnInit() {}

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
      this.userForm.patchValue({ avatar: file });
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.authservise.currentUser$.subscribe(user =>{
        this.currentuser = user
      })
      // console.log("user", this.currentuser)
      const payload = {
        ...this.userForm.value,
        company_id: this.currentuser.company_id,
        password: `${this.userForm.value.email.split('@')[0]}@${Math.floor(Math.random() * 10000)}`
      };
      // console.log('User Created:', payload);
      this.authservise.register(payload).subscribe({
        next: (response) => {
          if (response) {
            this.goBack()
            this.showToastMessage('success','User registered successfully!',  `User ${this.userForm.value.email.split('@')[0] || UpperCasePipe} Registered`);
            // this.presentToast(`User ${this.userForm.value.email.split('@')[0]} registered successfully!`, 'success', 'top');
          } else {
            this.showToastMessage('warning', 'Registration Failed', 'Please try again.');
          }
        },
        error: (error) => {
          this.showToastMessage('error', 'Registration Error', error.message || 'An unexpected error occurred.');
        }
      })
    }
    else{
      this.showToastMessage('warning', 'Invalid Input', 'Please fill all required fields.');
    }
  }

  bulkCreateUsers() {
    console.log("Bulk user creation initiated");
    // Implement logic for bulk user upload (e.g., open file picker, API call, etc.)
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
