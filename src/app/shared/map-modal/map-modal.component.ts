import { ModalController } from '@ionic/angular';
import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit {

  constructor(private modalController: ModalController) { }
  private _googleMapSDK = '';

  ngAfterViewInit(): void {
    this.getGoogleMaps().then((googleMapsSdk) => {
      console.log(googleMapsSdk);
    }).catch(err => console.log(err));
  }

  ngOnInit() {}

  onCancel() {
    this.modalController.dismiss();
  }

  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google; // Sarà valorizzata appena l'sdk js di google maps verrà imporata

    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this._googleMapSDK}&callback=initMap`;
      script.type = 'text/javascript';
      // per CARICARE lo script in modo non bloccante
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        // Non appena lo script sarà caricato su window sarà valorizzato l'oggetto GOOGLE
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          return resolve(loadedGoogleModule.maps);
        } else {
          reject('Google maps sdk not avaible');
        }
      };
    });
  }
}
