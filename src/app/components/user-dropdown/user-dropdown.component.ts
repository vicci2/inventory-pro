import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  styleUrls: ['./user-dropdown.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, IonicModule ]
})
export class UserDropdownComponent  implements OnInit {

  @Input() menuItems: any[] = [];
  @Input() logOut: () => void = () => {};

  constructor(private popoverCtrl: PopoverController, private router: Router,) {}
  ngOnInit() {}

  closePopover() {
    this.popoverCtrl.dismiss();
  }

  handleAction(action: string) {
    switch (action) {
      case 'logOut':
        this.logOut();        
        break;

      case 'profile':
        this.router.navigate(['/profile'], );
          // { queryParams: { userId: userId } }
        break;

      case 'Inbox':
        
        break;

      case 'Help':
        
        break;
    
      default:
        break;
    }
    this.closePopover();
  }

}
