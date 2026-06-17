import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './transfer.component.html',
  styleUrl:'./transfer.component.css',
})
export class TransferComponent {
  toAccount = '';
  amount = 0;
  message = '';
  messageType = '';

  constructor(private api: ApiService) { }

 transfer() {
  this.api.transfer({
    toAccount: this.toAccount,
    amount: this.amount
  }).subscribe({
    next: (res: any) => {
      if (res.status === 'SUCCESS') {
        this.message = 'Transfer successful';
        this.messageType = 'success';
      } else {
        this.message = res.message;
        this.messageType = 'error';
      }
    },
    error: (err) => {
      this.message = err.error?.message || 'Transfer failed';
      this.messageType = 'error';
    }
  });
}

}
