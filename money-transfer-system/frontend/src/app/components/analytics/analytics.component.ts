import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { forkJoin } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css'
})
export class AnalyticsComponent implements OnInit {
  currentAccountId: number | null = null;
  
  // KPI Metrics
  totalTransacions: number = 0;
  successfulTransactions: number = 0;
  failedTransactions: number = 0;
  totalAmountTransferred: number = 0;
  totalAmountReceived: number = 0;
  mostTransactedPerson: { name: string; count: number } = { name: '', count: 0 };
  topRecipients: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    // Fetch account and transactions
    forkJoin({
      account: this.api.getAccount(),
      history: this.api.getHistory()
    }).subscribe({
      next: (result) => {
        this.currentAccountId = result.account.id;
        this.calculateAnalytics(result.history);
      },
      error: (err) => {
        console.error('Error fetching analytics data:', err);
      }
    });
  }

  calculateAnalytics(transactions: any[]) {
    // Total transactions count
    this.totalTransacions = transactions.length;

    // Count successful and failed transactions
    this.successfulTransactions = transactions.filter(t => t.status === 'SUCCESS').length;
    this.failedTransactions = transactions.filter(t => t.status === 'FAILED').length;

    // Calculate total amounts
    let sentTotal = 0;
    let receivedTotal = 0;

    transactions.forEach((tx: any) => {
      if (tx.status === 'SUCCESS') {
        if (tx.fromAccountId === this.currentAccountId) {
          sentTotal += Number(tx.amount);
        } else {
          receivedTotal += Number(tx.amount);
        }
      }
    });

    this.totalAmountTransferred = sentTotal;
    this.totalAmountReceived = receivedTotal;

    // Calculate most transacted person and top recipients
    const personCount: { [key: string]: number } = {};
    const personNames: { [key: string]: string } = {};

    transactions.forEach((tx: any) => {
      const otherParty = tx.fromAccountId === this.currentAccountId 
        ? tx.toAccountHolderName 
        : tx.fromAccountHolderName;
      
      personCount[otherParty] = (personCount[otherParty] || 0) + 1;
      personNames[otherParty] = otherParty;
    });

    // Find most transacted person
    let maxCount = 0;
    let maxPerson = '';
    for (const [person, count] of Object.entries(personCount)) {
      if ((count as number) > maxCount) {
        maxCount = count as number;
        maxPerson = person;
      }
    }

    this.mostTransactedPerson = { name: maxPerson, count: maxCount };

    // Get top 5 recipients/senders
    this.topRecipients = Object.entries(personCount)
      .map(([person, count]) => ({
        name: person,
        count: count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
}
