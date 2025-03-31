import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonCard, IonCardContent, IonCardSubtitle, IonNote, IonButtons } from '@ionic/angular/standalone';
import { CustomModalComponent } from '../components/custom-modal/custom-modal.component';
import { catchError, of, timeout } from 'rxjs';
import { SuppliersService } from '../services/suppliers.service';
import { Router, RouterLink } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ModalController } from '@ionic/angular';
import { SearchFilterComponent } from "../components/search-filter/search-filter.component";

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.page.html',
  styleUrls: ['./suppliers.page.scss'],
  standalone: true,
  imports: [IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonCard, IonCardContent, IonCardSubtitle, IonNote, IonButtons, CommonModule, FormsModule, SearchFilterComponent, RouterLink]
})
export class SuppliersPage implements OnInit {

  @ViewChild(DatatableComponent) table!: DatatableComponent;
  ColumnMode = ColumnMode;
  loadingIndicator!: boolean;
  rows: any[] = [];
  userData!:any[]
  isLoading = false;

  constructor(private modalCtrl: ModalController, private router: Router, private team:SuppliersService) { }

  ngOnInit() {
    this.getTeam()
  }

  getTeam(){
    this.isLoading = true;
    const apiTimeout = 30000; 
    this.team.getSuppliers().pipe(
      timeout(apiTimeout),
      catchError((error) => {
        // console.error('Error or timeout occurred:', error);
        // this.showAlert('Tmeout Error', 'Error or timeout occurred. Please try again later.', ['OK'], 'danger');
        return of([]); 
      })
    ).subscribe({
      next: (data:any) => {
        this.userData = data
        // console.log(`User data:}`, this.userData)
        this.isLoading = false
      },
      error: (error) => {
        this.isLoading = false;
        // this.showAlert('Error', 'Unable to load stock data. Please try again later.', ['OK'], 'danger');
      }
    })
  }
  
  teams = [
    { name: 'Ryan Samuel', role: 'FINANCIAL EXAMINER', image: 'assets/images/bg_2.jpg', email:'myemail@mil.kom' },
    { name: 'Jordan Michael', role: 'FRONT END DEVELOPER', image: 'assets/images/bg_3.jpg', email:'myemail@mil.kom' }
  ];
  
  async openModal() {
    const modal = await this.modalCtrl.create({
      component: CustomModalComponent,
      componentProps: {
        title: 'remove User',
        content: 'Are you sure you want to remove user?',
        icon: 'person-remove-sharp',
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


  handleImageError(event: any) {
    event.target.src = '../../assets/images/user.jpg';  
  }

/*   refreshData() {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (data: any) => {
        this.userData = data; 
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        // this.showAlert('Refresh Error', 'Failed to refresh sales data. Please try again.', ['OK'], 'danger');
      }
    });
  } */

  async updateDetails(userId: any) {
    try {
      this.router.navigate(['/userEdit'], { queryParams: { userId: userId } });
    } catch (error) {
      // this.showAlert('Error', 'Failed to fetch items. Please try again.', ['OK'], 'danger');
    }
  }

  /* 
  Failed to register user: (psycopg2.errors.oreign key constraint "users_company_id_fkey" DETAIL: Key (company_ForeignKeyViolation) insert or update on table "users" violates fid)=(2) is not present in table "companies". [SQL: INSERT INTO users (id, company_id, "fullName", username, email, tel_no, avatar, password_hash, role) VALUES (%(id)s, %(company_id)s, %(fullName)s, %(username)s, %(email)s, %(tel_no)s, %(avatar)s, %(password_hash)s, %(role)s) RETURNING users.last_login, users.created_at] [parameters: {'id': '3f251216-d124-4c60-a87b-ec77f5b6c47f', 'company_id': 2, 'fullName': 'manager1', 'username': 'manager1', 'email': 'manager1@mail.kom', 'tel_no': '0923828393', 'avatar': '', 'password_hash': '$2b$12$dJabn1SML8bbcJHqb0JnWuSZOMBvsl.Sc9yONzgAQupvSVxNX.IIm', 'role': 'manager'}] (Background on this error at: https://sqlalche.me/e/20/gkpj)
  */
}
