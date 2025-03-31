import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonCardContent, IonGrid, IonRow, IonCol, IonButton, IonCard, IonCardSubtitle, IonNote, IonButtons,  } from '@ionic/angular/standalone';
import { catchError, of, timeout } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { User } from '../interface/user.model';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.page.html',
  styleUrls: ['./team.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonIcon, IonContent, IonGrid, IonRow, IonCol, IonButton, IonCard, IonCardSubtitle, IonNote, IonButtons,CommonModule, FormsModule, RouterLink]
})
export class TeamPage implements OnInit {

  userData!:User[]
  isLoading = false;

  constructor(private userService:UsersService, private router: Router) { }

  ngOnInit() {
    this.getUsers()
  }
  
  getUsers(){
    this.isLoading = true;
    const apiTimeout = 30000; 
    this.userService.getUsers().pipe(
      timeout(apiTimeout),
      catchError((error) => {
        // console.error('Error or timeout occurred:', error);
        // this.showAlert('Tmeout Error', 'Error or timeout occurred. Please try again later.', ['OK'], 'danger');
        return of([]); 
      })
    ).subscribe({
      next: (data:any) => {
        this.userData = data
        // console.log(`User data: ${this.userData}`)
        this.isLoading = false
      },
      error: (error) => {
        this.isLoading = false;
        // this.showAlert('Error', 'Unable to load stock data. Please try again later.', ['OK'], 'danger');
      }
    })
  }
  
  handleImageError(event: any) {
    event.target.src = '../../assets/images/user.jpg';  
  }

  refreshData() {
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
  }

  async updateDetails(userId: any) {
    try {
      this.router.navigate(['/userEdit'], { queryParams: { userId: userId } });
    } catch (error) {
      // this.showAlert('Error', 'Failed to fetch items. Please try again.', ['OK'], 'danger');
    }
  }

  roleIcons: { [key: string]: { icon: string; tooltip: string } } = {
    admin: { icon: 'shield-checkmark-outline', tooltip: 'Has full control and manages platform settings' },
    manager: { icon: 'briefcase-outline', tooltip: 'Oversees staff and content moderation' },
    staff: { icon: 'people-outline', tooltip: 'Assists with user support and content management' },
    user: { icon: 'person-outline', tooltip: 'Regular user with basic access' }
  };

  getRoleInfo(role: string) {
    return this.roleIcons[role.toLowerCase()] || this.roleIcons['user'];
  }

}
