import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdsService } from '../services/ads/ads.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  isInterstitialLoaded = false;
  isRewardLoaded = false;
  isBannerShowing = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private adsService: AdsService
  ) {
    this.adsService.admobSetup();
    setTimeout(() => {
      this.adsService.loadInterstitialAds();
      this.adsService.loadRewardAds();
    }, 1000);
    this.adsService.listenInterstitalOnLoadEvent().then((value) => {
      this.isInterstitialLoaded = true;
    });
    this.adsService.listenRewardOnLoadEvent().then((value) => {
      this.isRewardLoaded = true;
    });
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }

  showBanner() {
    this.adsService.showBannerAd();
    this.isBannerShowing = true;
  }

  hideBanner() {
    this.adsService.hideBanner();
    this.isBannerShowing = false;
  }

  showInterstitial() {
    this.adsService.showInterstitialAds();
    this.isInterstitialLoaded = false;
    this.adsService.listenInterstitalOnLoadEvent().then((value) => {
      this.isInterstitialLoaded = true;
    });
  }

  showReward() {
    this.adsService.showRewardAds();
    this.isRewardLoaded = false;
    this.adsService.listenRewardOnLoadEvent().then((value) => {
      this.isRewardLoaded = true;
    });
  }
}
