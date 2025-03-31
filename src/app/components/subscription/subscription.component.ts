import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map, tap, filter, switchMap } from 'rxjs';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { TierService } from 'src/app/services/tier.service';
import { ValidationService } from 'src/app/services/validation.service';
import { IonRow, IonCol, IonButtons, IonButton, IonIcon, IonCardSubtitle, IonInput, IonGrid, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonItem, IonCardContent, IonList, IonRadioGroup, IonRadio, IonPopover, IonNote} from '@ionic/angular/standalone';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonRow, IonCol, IonButtons, IonButton, IonIcon, IonCardSubtitle, IonInput, IonGrid, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonItem, IonCardContent, IonList, IonRadioGroup, IonRadio, IonPopover, IonNote]
})
export class SubscriptionComponent  implements OnInit {

  selectedTier: any;
  selectedPaymentMethod: string = 'mastercard';
  activeSubscription:any
  isPopoverOpen: boolean = false;
  subscriptionForm!:FormGroup
  showTiers = false;
  tiers!:any

  // tier = [
  //   {
  //     id: 1,
  //     name: 'Free/Basic Tier',
  //     price: 'Ksh 0/month',
  //     description: 'Perfect for startups and small businesses.',
  //     features: [
  //       { name: 'Basic Inventory Management', description: 'Manage up to 2 products.', cost: 0 },
  //       { name: 'Limited Inventory Tracking', description: 'Basic tracking with no real-time updates.', cost: 0 },
  //       { name: 'Basic Reporting', description: 'Limited reporting functionality.', cost: 0 },
  //       { name: 'Community Support', description: 'Forum-based support only.', cost: 0 }
  //     ]
  //   },
  //   {
  //     id: 2,
  //     name: 'Standard/Essential Tier',
  //     price: 'Ksh 49/month',
  //     description: 'For growing businesses',
  //     features: [
  //       { name: 'Extended Inventory', description: 'Manage up to 5 store products.', cost: 10 },
  //       { name: 'Barcode Scanning', description: 'Supports barcode scanning for products.', cost: 14 },
  //       { name: 'Business Integrations', description: 'Integration with QuickBooks and more.', cost: 12 },
  //       { name: 'Standard Reporting', description: 'Access to detailed reporting features.', cost: 8 },
  //       { name: 'Email Support', description: 'Ticket-based customer support.', cost: 5 }
  //     ]
  //   },
  //   {
  //     id: 3,
  //     name: 'Professional/Pro Tier',
  //     price: 'Ksh 99/month',
  //     description: 'Advanced features',
  //     features: [
  //       { name: 'Unlimited Products', description: 'Manage unlimited store products & 4 SKUs.', cost: 30 },
  //       { name: 'Advanced Analytics', description: 'AI-powered demand forecasting.', cost: 20 },
  //       { name: 'Multi-User Access', description: 'Up to 2 different locations.', cost: 12 },
  //       { name: 'E-commerce Integration', description: 'Shopify & WooCommerce integration.', cost: 15 },
  //       { name: 'Advanced Tracking', description: 'Batch and lot tracking.', cost: 7 },
  //       { name: 'Priority Chat Support', description: 'Chat and email support.', cost: 15 }
  //     ]
  //   },
  //   {
  //     id: 4,
  //     name: 'Business/Team Tier',
  //     price: 'Ksh 149/month',
  //     description: 'For collaboration',
  //     features: [
  //       { name: 'Pro Tier Features', description: 'Includes all Pro Tier features.', cost: 50 },
  //       { name: 'Multi-Team Access', description: 'Supports multiple teams.', cost: 25 },
  //       { name: 'Custom Workflows', description: 'Automation and workflow customization.', cost: 20 },
  //       { name: 'Collaboration Tools', description: 'Real-time communication tools.', cost: 20 },
  //       { name: 'Premium Support', description: 'Priority email/chat support.', cost: 34 }
  //     ]
  //   },
  //   {
  //     id: 5,
  //     name: 'Enterprise/Custom Tier',
  //     price: 'Ksh 199/month',
  //     description: 'For large enterprises',
  //     features: [
  //       { name: 'All Business Tier Features', description: 'Includes all Business Tier features.', cost: 60 },
  //       { name: 'Custom Integrations', description: 'API and third-party software integration.', cost: 35 },
  //       { name: 'Dedicated Account Manager', description: 'One-on-one account support.', cost: 30 },
  //       { name: 'Unlimited Users', description: 'No restrictions on users, SKUs, and locations.', cost: 25 },
  //       { name: 'AI Demand Planning', description: 'Advanced AI-driven stock forecasting.', cost: 25 },
  //       { name: 'SLA-backed Uptime', description: 'Guaranteed system uptime.', cost: 24 }
  //     ]
  //   }
  // ];
  
  constructor(private subscriptions:SubscriptionService, private tierService:TierService,  public validationService: ValidationService) {
    // this.selectedTier = this.tier[4]; 
  }

  ngOnInit() {
    this.subscription()
    this.subscriptionForm = new FormGroup({
      transaction_code: new FormControl('', [Validators.required,  Validators.minLength(8),  Validators.maxLength(10)])
    })
    this.getTiers()
  }

  selectTier(tier: any) {
    this.tierService.getTier(tier.id).subscribe(tier =>{
      this.selectedTier = tier
      this.activeSubscription=''
      // console.log("selected tier:", tier)
    });
    document.getElementById('subscription')?.scrollIntoView({ behavior: 'smooth' });
  }

  getButtonColor(tierName: string): string {
    switch (tierName) {
      case 'Free/Basic Tier': return 'warning';
      case 'Standard/Essential Tier': return 'secondary';
      case 'Professional/Pro Tier': return 'tertiary';
      case 'Business/Team Tier': return 'success';
      case 'Enterprise/Custom Tier': return 'dark';
      default: return 'primary';
    }
  }

  subscription() {
    this.subscriptions.getSubscriptions().pipe(
      // tap((subscriptions: any) => console.log("subscriptions", subscriptions)), 
      map((subscriptions: any[]) => {
        // Find active subscription first, fallback to pending if none exist
        return subscriptions.find((sub: { status: string; }) => sub.status === "active") || 
               subscriptions.find((sub: { status: string; }) => sub.status === "pending");
      }),
      tap((selectedSub: { status: any; }) => {
        if (selectedSub) {
          this.activeSubscription = selectedSub;
        } else {
          console.log("No active or pending subscription found");
        }
      }),
      filter((selectedSub: any) => !!selectedSub), 
      switchMap((selectedSub: any) => this.tierService.getTier(selectedSub?.tier_id)) 
    ).subscribe(
      tier => {
        // console.log("Selected tier:", tier);
        this.selectedTier = tier;
      },
      error => console.error("Error fetching subscription or tier:", error)
    );
  }  

  subscribe(){
    this.isPopoverOpen = true
    if (this.subscriptionForm.invalid) {
      // this.showToastMessage('warning', 'Invalid Input', 'Please fill all required fields.');
      return;
    }
  
    const payload = {
      tier_id: this.activeSubscription.tier_id,
      ...this.subscriptionForm.value,
      staus: 'active'
    };
    
    if (this.subscriptionForm.valid) { 
      // console.log(`Subscription Payload ${this.activeSubscription.id}, ${payload.tier_id},`, this.subscriptionForm.value)         
      this.subscriptions.updateSubscription(this.activeSubscription.id, payload).subscribe({
        next: async (response) => {
          if (response && response.tier_id) {
            // console.log('success', 'Successful Registration & Subscription', 'Company registered successfully!');
            this.subscription()
           
          } else {
            console.log('error', 'Subscription Error', 'Subscription failed. Please try again.');
          }
        },
        error: (error) => {
          // console.log('error', 'Subscription Error', error.message || 'An unexpected error occurred.');
        } 
      })
      
      this.isPopoverOpen = false;
    }
  }

  toggleTiers() {
    this.showTiers = !this.showTiers;
    setTimeout(() => {
      document.getElementById('tiers')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
  
  getTiers(){
    this.tierService.getTiers().subscribe( tiers=> {
      this.tiers = tiers
  })
  }
}
