import { Injectable } from '@angular/core';
// prettier-ignore
import { Platform } from '@ionic/angular';
import { fromEvent } from 'rxjs';
import { first } from 'rxjs/operators';

declare let admob: any;
declare let consent: any;

@Injectable({
  providedIn: 'root',
})
export class AdsService {
  showAds = true;
  isTesting = true;
  banner;
  interstitial;
  rewarded;
  constructor(private platform: Platform) {}

  async admobSetup() {
    if (this.platform.is('cordova') && this.showAds) {
      // Ask user consent to show ads
      if (this.platform.is('ios')) {
        await admob.requestTrackingAuthorization();
      }

      const consentStatus = await consent.getConsentStatus();
      if (consentStatus === consent.ConsentStatus.Required) {
        await consent.requestInfoUpdate();
      }

      const formStatus = await consent.getFormStatus();
      if (formStatus === consent.FormStatus.Available) {
        const form = await consent.loadForm();
        form.show();
      }
      // Ask user consent to show ads

      await admob.start();
      admob.setAppVolume(0);
      admob.setAppMuted(true);
    }
  }

  async showBannerAd() {
    if (this.platform.is('cordova') && this.showAds) {
      const bannerConfig = {
        id: '',
      };
      if (this.platform.is('android')) {
        bannerConfig.id = this.isTesting
          ? 'ca-app-pub-3940256099942544/6300978111'
          : '';
      } else {
        bannerConfig.id = this.isTesting
          ? 'ca-app-pub-3940256099942544/2934735716'
          : '';
      }

      this.banner = new admob.BannerAd({
        adUnitId: bannerConfig.id,
      });

      await this.banner.show();
    }
  }

  async loadInterstitialAds() {
    if (this.platform.is('cordova') && this.showAds) {
      const interstitialConfig = {
        id: '',
      };
      if (this.platform.is('android')) {
        interstitialConfig.id = this.isTesting
          ? 'ca-app-pub-3940256099942544/1033173712'
          : '';
      } else {
        interstitialConfig.id = this.isTesting
          ? 'ca-app-pub-3940256099942544/4411468910'
          : '';
      }
      this.interstitial = new admob.InterstitialAd({
        adUnitId: interstitialConfig.id,
      });

      await this.interstitial.load();
    }
  }

  showInterstitialAds() {
    if (this.platform.is('cordova') && this.showAds) {
      this.interstitial.show();
      setTimeout(() => {
        this.loadInterstitialAds();
      }, 1000);
    }
  }

  hideBanner() {
    if (this.platform.is('cordova') && this.banner) {
      this.banner.hide();
    }
  }

  removeAds() {
    this.showAds = false;
    if (this.platform.is('cordova') && this.banner) {
      this.banner.hide();
    }
  }

  async loadRewardAds() {
    if (this.platform.is('cordova') && this.showAds) {
      const rewardVideoConfig = {
        id: '',
      };
      if (this.platform.is('android')) {
        rewardVideoConfig.id = this.isTesting
          ? 'ca-app-pub-3940256099942544/5224354917'
          : '';
      } else {
        rewardVideoConfig.id = this.isTesting
          ? 'ca-app-pub-3940256099942544/1712485313'
          : '';
      }

      this.rewarded = new admob.RewardedAd({
        adUnitId: rewardVideoConfig.id,
      });

      await this.rewarded.load();
    }
  }

  showRewardAds() {
    if (this.platform.is('cordova') && this.showAds) {
      this.rewarded.show();
      setTimeout(() => {
        this.loadRewardAds();
      }, 1000);
    }
  }

  listenRewardUserEvent() {
    return new Promise((resolve, reject) => {
      fromEvent(document, 'admob.rewarded.reward')
        .pipe(first())
        .subscribe((value) => {
          resolve(value);
        });
    });
  }

  listenRewardOnLoadEvent() {
    return new Promise((resolve, reject) => {
      fromEvent(document, 'admob.rewarded.load')
        .pipe(first())
        .subscribe((value) => {
          resolve(value);
        });
    });
  }

  listenInterstitalOnLoadEvent() {
    return new Promise((resolve, reject) => {
      fromEvent(document, 'admob.interstitial.load')
        .pipe(first())
        .subscribe((value) => {
          resolve(value);
        });
    });
  }
}
