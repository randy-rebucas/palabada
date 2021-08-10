import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { SubSink } from 'subsink';
// ionic native
import { AppVersion } from '@ionic-native/app-version/ngx';
import { ModalController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  public appVer: string;
  private subs = new SubSink();
  
  constructor(
    private appVersion: AppVersion,
    private platform: Platform,
    private router: Router,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.subs.sink = from(this.appVersion.getVersionNumber()).subscribe((app) => {
      this.appVer = app;
    });
  }

  onLoginOpen() {
    this.subs.sink = from(this.modalController.create({
      component: LoginComponent
    })).subscribe((modalEl) => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
        if (modalData.data.dismissed) {
          this.router.navigateByUrl('/pages');
        }
      });
      modalEl.present();
    });
  }

  onRegisterOpen() {
    this.subs.sink = from(this.modalController.create({
      component: RegisterComponent
    })).subscribe((modalEl) => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
        if (modalData.data.dismissed) {
          this.router.navigateByUrl('/auth');
        }
      });
      modalEl.present();
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
