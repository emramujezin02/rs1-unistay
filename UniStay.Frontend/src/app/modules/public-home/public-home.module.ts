import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../shared/material/material';
import { PublicHomeRoutingModule } from './public-home-routing.module';
import { PublicHomeAboutComponent } from './components/about/public-home-about.component';
import { PublicHomeAnnouncementsComponent } from './components/announcements/public-home-announcements.component';
import { PublicHomeFeaturesComponent } from './components/features/public-home-features.component';
import { PublicHomeFooterComponent } from './components/footer/public-home-footer.component';
import { PublicHomeHeroComponent } from './components/hero/public-home-hero.component';
import { PublicHomeNavbarComponent } from './components/navbar/public-home-navbar.component';
import { PublicHomePageComponent } from './pages/home/public-home-page.component';

@NgModule({
  declarations: [
    PublicHomePageComponent,
    PublicHomeNavbarComponent,
    PublicHomeHeroComponent,
    PublicHomeAnnouncementsComponent,
    PublicHomeAboutComponent,
    PublicHomeFeaturesComponent,
    PublicHomeFooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    PublicHomeRoutingModule
  ]
})
export class PublicHomeModule {}
