import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircle, addCircleOutline, alertCircleOutline, alertCircleSharp, analyticsOutline, appsOutline, arrowBackOutline, arrowDownCircleOutline, arrowForwardOutline, arrowUpCircleOutline, bagAddSharp, bagHandleOutline, bagHandleSharp, bagRemoveSharp, barcodeOutline, bookOutline, briefcaseOutline, business, businessOutline, calendarOutline, call, callOutline, cart, cartOutline, cash, cashOutline, chatboxEllipsesOutline, checkmarkCircleOutline, clipboardOutline, closeCircleOutline, cloudUploadOutline, createOutline, createSharp, cubeOutline, desktopOutline, documentLockOutline, documentTextOutline, downloadOutline, eyeOutline, eyeSharp, filterOutline, flashSharp, gitNetworkOutline, globeOutline, helpCircleOutline, home, homeOutline, homeSharp, imageOutline, informationCircleSharp, key, layersOutline, locateOutline, location, lockClosedOutline, lockOpenOutline, logInOutline, logInSharp, logoFacebook, logOutOutline, logoWhatsapp, mail, mailOutline, pencilSharp, peopleOutline, personAddOutline, personCircle, personOutline, personRemoveSharp, pricetagOutline, pricetagSharp, pricetagsOutline, pulseOutline, readerOutline, receiptOutline, refreshCircle, refreshCircleOutline, refreshOutline, settingsOutline, shieldCheckmarkOutline, sparklesOutline, statsChartOutline, terminalOutline, timeOutline, timerOutline, trashBin, trashBinOutline, trashBinSharp, trashOutline, trendingUpOutline, walletOutline, warningOutline,  } from 'ionicons/icons';
import { AuthService } from './services/auth.service';
// import { PopoverController} from '@ionic/angular';
import { UserDropdownComponent } from './components/user-dropdown/user-dropdown.component';
import { IonContent, IonTitle, IonToolbar, IonIcon, IonCardSubtitle, IonButtons, IonList, IonAvatar, IonBadge, IonTabButton, IonLabel, IonMenu, IonItem, IonHeader } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { PopoverController} from '@ionic/angular';
import { User } from './interface/user.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, CommonModule, IonContent, IonTitle, IonToolbar, IonIcon, IonCardSubtitle, IonButtons, IonList, IonAvatar, IonBadge, IonTabButton, IonLabel, IonMenu, IonItem, IonHeader, RouterLink, ],
})
export class AppComponent {
  currentuser!: User
  showNav = true;
  isLoggedIn = false;

  constructor(private router:Router, private authService:AuthService, private popoverCtrl: PopoverController) {
    addIcons({
      terminalOutline, desktopOutline, sparklesOutline, gitNetworkOutline, clipboardOutline, locateOutline, trendingUpOutline, layersOutline, analyticsOutline, shieldCheckmarkOutline, mail, call, business, checkmarkCircleOutline, refreshCircle, personOutline, businessOutline, home, homeOutline, homeSharp, flashSharp, informationCircleSharp, alertCircleSharp, personCircle, lockClosedOutline, lockOpenOutline, logInSharp, trashBin, addCircle, documentTextOutline, pricetagsOutline, cashOutline,cartOutline, barcodeOutline, cubeOutline, cloudUploadOutline, appsOutline, arrowBackOutline, timeOutline, addCircleOutline, refreshCircleOutline, filterOutline, personAddOutline, mailOutline, callOutline, trashOutline, createOutline, downloadOutline, timerOutline, closeCircleOutline, logInOutline, logOutOutline, createSharp, personRemoveSharp,logoWhatsapp, logoFacebook,globeOutline, readerOutline, documentLockOutline, briefcaseOutline, location, arrowDownCircleOutline, refreshOutline, arrowUpCircleOutline, settingsOutline, receiptOutline, statsChartOutline, arrowForwardOutline, walletOutline, peopleOutline, chatboxEllipsesOutline, bookOutline, alertCircleOutline, warningOutline, imageOutline, helpCircleOutline, pencilSharp,eyeSharp, bagHandleSharp,trashBinSharp, trashBinOutline, bagAddSharp, pricetagSharp, bagRemoveSharp, bagHandleOutline, eyeOutline, calendarOutline, pricetagOutline, pulseOutline, key, cash, cart
    });
    this.router.events.subscribe(() => {
      this.showNav = !(this.router.url.startsWith('/product-details/') || this.router.url.startsWith('/team/') || this.router.url.startsWith('/userEdit') || this.router.url.startsWith('/stock/') || this.router.url.startsWith('/suppliers/') || this.router.url.startsWith('/profile'));
    });      
  }

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe((status) => {
      this.isLoggedIn = status;
    });
    // this.authService.fetchCurrentUser().subscribe( (user) => {
    //   this.currentuser = user
    // });
  }

  menuItems = [
    { label: 'My Profile', icon: 'person-outline', action: 'profile' },
    { label: 'Inbox', icon: 'mail-outline', action: '' },
    { label: 'Help', icon: 'help-circle-outline', action: '' },
    { label: 'Sign Out', icon: 'log-out-outline',  action: 'logOut' , danger: true }
  ];

  isTabSelected(route: string): boolean {
    return this.router.url.includes(route); 
  }

  logOut(){
    this.authService.signOut()
  }

  async openPopover(ev: Event) {
    const popover = await this.popoverCtrl.create({
      component: UserDropdownComponent,
      event: ev,
      translucent: true,
      showBackdrop: false,
      componentProps: {
        menuItems: this.menuItems, 
        logOut: this.logOut.bind(this) 
      }
    });
    await popover.present();
  }

  closePopover() {
    this.popoverCtrl.dismiss();
  }
}
