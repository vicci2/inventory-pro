import { CommonModule } from '@angular/common';
import { Component, Input, OnInit  } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  standalone: true,
  imports: [IonicModule,  CommonModule, ],
})
export class ToastComponent  implements OnInit {

  @Input() type: string = ''; 
  @Input() message: string = '';
  @Input() title: string = '';
 
  visible: boolean = false;

  constructor() { }

  ngOnInit() {}

  get iconName(): string {
    return this.type === 'success' ? 'information-circle-sharp' :
           this.type === 'error' ? 'flash-sharp' :
           this.type === 'warning' ? 'alert-circle-sharp' : 'information-circle-sharp';
  }

  get bgColor(): string {
    return this.type === 'success' ? 'var(--ion-color-success)' :
           this.type === 'error' ? 'var(--ion-color-danger)' :
           this.type === 'warning' ? 'var(--ion-color-warning)' : 'var(--ion-color-primary)';
  }

  get textColor(): string {
    return this.type === 'success' ? 'var(--ion-color-success)' :
           this.type === 'error' ? 'var(--ion-color-danger)' :
           this.type === 'warning' ? 'var(--ion-color-warning)' : 'var(--ion-color-primary)';
  }

  showToast() {
    this.visible = true;
    setTimeout(() => {
      this.visible = false;
    }, 8000); 
  }

}
