import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnalyticsService } from '../../../../endpoints/analytics/analytics.service';
import { trigger,transition,style,animate } from '@angular/animations';

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.scss'],
  standalone:false,
   animations: [ // NOVO
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('1000ms ease',
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ])
  ]
})
export class AnalyticsDashboardComponent implements OnInit, OnDestroy {

  analytics={
    activeUsers:0,
    totalUsers:0,
    totalMessages:0

  }

  constructor(private analyticsService: AnalyticsService) {}

ngOnInit(): void {
  const userId = Number(localStorage.getItem('id'));

  if (!userId) {
    return;
  }

  this.analyticsService.startConnection(userId);

  this.analyticsService.analytics$
    .subscribe(data => {
      this.analytics = data;
    });
}



  ngOnDestroy():void{
    this.analyticsService.stopConnection();
  }
}