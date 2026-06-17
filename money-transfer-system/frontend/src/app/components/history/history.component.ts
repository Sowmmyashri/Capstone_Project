import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { forkJoin } from 'rxjs';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, FormsModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  transactions: any[] = [];
  filteredTransactions: any[] = [];
  currentAccountId: number | null = null;
  
  // Filter properties
  statusFilter: string = 'all'; // 'all', 'SUCCESS', 'FAILED'
  directionFilter: string = 'all'; // 'all', 'sent', 'received'
  searchText: string = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    // Fetch both current account and transactions
    forkJoin({
      account: this.api.getAccount(),
      history: this.api.getHistory()
    }).subscribe({
      next: (result) => {
        this.currentAccountId = result.account.id;
        console.log("HISTORY DATA:", result.history);
        console.log("CURRENT ACCOUNT:", result.account);
        
        // Enrich transactions with direction and other party info
        const enrichedTransactions = result.history.map((tx: any) => ({
          ...tx,
          direction: tx.fromAccountId === this.currentAccountId ? 'sent' : 'received',
          otherPartyName: tx.fromAccountId === this.currentAccountId 
            ? tx.toAccountHolderName 
            : tx.fromAccountHolderName,
          otherPartyId: tx.fromAccountId === this.currentAccountId 
            ? tx.toAccountId 
            : tx.fromAccountId
        }));
        
        this.transactions = enrichedTransactions.sort((a: any, b: any) =>
          new Date(b.createdOn).getTime() -
          new Date(a.createdOn).getTime()
        );
        
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error fetching history:', err);
      }
    });
  }

  applyFilters() {
    this.filteredTransactions = this.transactions.filter((tx: any) => {
      // Filter by status
      if (this.statusFilter !== 'all' && tx.status !== this.statusFilter) {
        return false;
      }
      
      // Filter by direction
      if (this.directionFilter !== 'all' && tx.direction !== this.directionFilter) {
        return false;
      }
      
      // Filter by search text (search in other party name)
      if (this.searchText.trim() !== '') {
        const searchLower = this.searchText.toLowerCase();
        const otherPartyName = tx.otherPartyName || '';
        if (!otherPartyName.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      
      return true;
    });
  }

  onFilterChange() {
    this.applyFilters();
  }
}