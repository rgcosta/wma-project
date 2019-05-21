import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { useAnimation } from '@angular/animations';
import {PushNotificationService} from '../services/push-notification.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() user: any = {};
  messages: any[] = [];
  subscription: Subscription;
  constructor(
    private authService: AuthService,
    private router: Router ,
    protected pushNotificationService: PushNotificationService
  ) { }

  ngOnInit() {
    console.log(this.user);
    if ( this.user ) {
      this.pushNotificationService.requestPermission();
      this.pushNotificationService.listen();
      this.subscription = this.pushNotificationService.currentNotice.subscribe(message => {
        // const notifi = message.notification;
        console.log(message);
        if (message) {
          this.messages.push(message);
        } else {
          // clear messages when empty message received
          this.messages = [];
        }
      });
    }
  }

  async logout() {
    await this.pushNotificationService.unsubscribe();
    this.authService.signOut();
    this.navigate('/auth/login');
  }

  navigate(link): void {
    this.router.navigate([link]);
  }

}
