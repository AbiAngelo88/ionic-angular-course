import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlacesService } from './../../places.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Place } from '../../place.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private loadingController: LoadingController,
    private router: Router,
    private alertController: AlertController) { }

  isLoading = false;
  place: Place;
  form: FormGroup;
  private _placeSub: Subscription;
  placeId: string;

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }

      this.isLoading = true;
      this.placeId = paramMap.get('placeId');
      this._placeSub = this.placesService.getPlace(this.placeId).subscribe(data => {
        this.place = data;
        this.form = new FormGroup({
          title: new FormControl(this.place.title, {
            updateOn: 'blur',
            validators: [ Validators.required]
          }),
          description: new FormControl(this.place.description, {
            updateOn: 'blur',
            validators: [ Validators.required, Validators.maxLength(180)]
          })
        });

        this.isLoading = false;
      }, error => {
        this.alertController.create({header: 'Error occurred!', message: 'Place could not be fetch, try later', buttons: [
          {text: 'Okay', handler: () => {
            this.router.navigate(['/places/tabs/offers']);
          }}
        ]}).then(alertElem => {
          alertElem.present();
        });
      });
    });
  }

  ngOnDestroy(): void {
    if (this._placeSub) {
      this._placeSub.unsubscribe();
    }
  }

  onEditOffer() {

    if (!this.form.valid) {
      return;
    }
    console.log(this.form);
    this.loadingController.create({message: 'Updating place...'}).then(loadingElem => {
      loadingElem.present();
      this.placesService.updatePlace(this.place.id, this.form.value.title, this.form.value.description).subscribe(() => {
        loadingElem.dismiss();
        this.form.reset();
        this.router.navigate(['/places/tabs/offers']);
      });
    });


  }
}
