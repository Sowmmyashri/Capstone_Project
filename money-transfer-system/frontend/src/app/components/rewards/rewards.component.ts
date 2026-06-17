import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.css']
})
export class RewardsComponent implements OnInit {
  rewards: any[] = [];
  summary: any = { totalRewards: 0 };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getRewards().subscribe({
      next: (data) => this.rewards = data,
      error: (err) => console.error('Error fetching rewards', err)
    });

    this.api.getRewardSummary().subscribe({
      next: (data) => this.summary = data,
      error: (err) => console.error('Error fetching reward summary', err)
    });
  }
}
