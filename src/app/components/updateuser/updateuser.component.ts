import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { NavController } from '@ionic/angular';
import { IonTitle, IonContent, IonRow, IonCol, IonButtons, IonButton, IonIcon, IonCardSubtitle, IonInput, IonToolbar, IonGrid, IonItem, IonLabel, IonImg, } from '@ionic/angular/standalone';
import { ToastComponent } from "../toast/toast.component";
import { CommonModule, TitleCasePipe } from '@angular/common';


@Component({
  selector: 'app-updateuser',
  templateUrl: './updateuser.component.html',
  styleUrls: ['./updateuser.component.scss'],
  imports: [
    IonTitle, IonContent, IonRow, IonCol, IonButtons, IonButton, IonIcon, IonCardSubtitle, IonInput, IonToolbar, IonGrid, IonItem, IonLabel, IonImg, ReactiveFormsModule,
    ToastComponent, TitleCasePipe, CommonModule
]
})
export class UpdateuserComponent  implements OnInit {

  userData!: any
  userForm!: FormGroup;
  toastType: string =''
  toastTitle: string = ''; 
  toastMessage: string = '';
  showToast: boolean = false;
  imageUrl: string | ArrayBuffer | null = null;

  constructor(private navCtrl: NavController, private fb: FormBuilder, private route: ActivatedRoute, private userService:UsersService) { }

  ngOnInit() {
    this.initForms();
    this.route.queryParams.subscribe(params => {
      const userId = params['userId'];
      if (!userId) {
        this.goBack()
        return;
      }
      this.userService.getUser(userId).subscribe((data) => {
        if (!data) return;
        this.userData = data;
        this.userForm.patchValue({
          fullName: data.fullName,
          username: data.username,
          email: data.email,
          tel_no: data.tel_no,
          role: data.role,
          avatar: data.avatar,
        })
        // console.log(`User data:`, this.userForm.value);
      });
    }); 
  }
  
  initForms(){
    // Initialize the form with existing supplier data
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      // address: [this.userData.address],
      tel_no: ['', [Validators.required]],
      role: ['', [Validators.required]],
      avatar: [''],
    })
  }
  
  goBack() {
    this.navCtrl.back();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      // console.log('Updated Supplier Details:', this.userForm.value);
    }
    if (this.userForm.valid) {
      this.userService.updateUser(this.userData.id, this.userForm.value).subscribe(
        (response) => {
          console.log("User updated successfully", response);
          this.goBack(); 
        },
        (error) => {
          console.error("Error updating user:", error);
          this.showToastMessage(
            'error', 
            'Error', 
            error || "An unexpected error occurred. Please try again."
          );
        }
      );
    }
  }

  showToastMessage(type: 'success' | 'error' | 'warning', title: string, message: string) {
    this.toastType = type;
    this.toastTitle = title;
    this.toastMessage = message;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 5000);
  }

}
