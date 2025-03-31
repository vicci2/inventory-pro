import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonTitle, IonToolbar, IonRow, IonIcon, IonCol, IonGrid, IonCard, IonCardSubtitle, IonCardTitle, IonButtons, IonButton, IonList, IonChip, IonAvatar, IonCardHeader } from '@ionic/angular/standalone';
import { switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';
import { NavController } from '@ionic/angular';
import { SubscriptionComponent } from "../components/subscription/subscription.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonCol, IonIcon, IonRow, IonContent, IonTitle, IonToolbar, IonGrid, IonCard, IonCardSubtitle, IonCardTitle, IonButtons, IonButton, IonList, IonChip, IonAvatar, CommonModule, FormsModule, SubscriptionComponent]
})
export class ProfilePage implements OnInit {

  companyData:any
  userData:any
  section: string = 'company'

  constructor(private navCtrl: NavController, private profile:ProfileService, private user:AuthService) { }

  ngOnInit() {
    this.loadProfile()
  }

 /*  = {
    name: "Emma Roberts",
    username: "EmmaRob",
    role: "Admin",
    address: "123 Main St, Springfield"
  }; */

/*   = {
    name: "TechCorp",
    phone: "+1 234 567 890",
    email: "info@techcorp.com",
    location: "123 Main St, Springfield",
    logo: "https://example.com/logo.png",
    socials: {
        whatsapp: "https://wa.me/1234567890",
        facebook: "https://facebook.com/techcorp",
        website: "https://techcorp.com",
        phone: "+1 234 567 890",
        email: "info@techcorp.com"
    }
}; */

  branches = [
    { name: "Branch A", manager: "John Doe", location: "New York", contact: "+1 234 567 890" },
    { name: "Branch B", manager: "Jane Smith", location: "Los Angeles", contact: "+1 987 654 321" }
  ];
  
  goBack() {
    this.navCtrl.back();
  }

  loadProfile() {
    this.user.fetchCurrentUser().pipe(
      tap((user: any) => this.userData = user),  
      switchMap(user => this.profile.getCompany(user.id)) 
    ).subscribe(co => {
      // console.log(`Company`, co);
      this.companyData = co;
    });
  }
  

  
  onSegmentChange(segment: string) {
    // Swap the selected segment with the clicked one
   this.section = segment;
 }

}
