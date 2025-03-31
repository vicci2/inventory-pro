import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-custom-modal',
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class CustomModalComponent  implements OnInit {

  @Input() title: string = 'Confirm Action';
  @Input() content: string = 'Are you sure you want to proceed?';
  @Input() icon: string = 'information-circle-outline'; 
  @Input() backdropDismiss: boolean = true;
  @Input() button: { text: string; handler: () => void } | null = null;

  constructor(private modalCtrl: ModalController) {}

  closeModal() {
    this.modalCtrl.dismiss();
  }

  ngOnInit() {}

}
