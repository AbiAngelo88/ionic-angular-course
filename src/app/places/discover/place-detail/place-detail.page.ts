import { AuthService } from './../../../auth/auth.service';
import { BookingService } from './../../../bookings/booking.service';
import { CreateBookingComponent } from './../../../bookings/create-booking/create-booking.component';
import { PlacesService } from './../../places.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { Place } from '../../place.model';
import { Subscription, from } from 'rxjs';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private loadingController: LoadingController,
    private bookingService: BookingService,
    private authService: AuthService,
    private alertcontroller: AlertController) { }
  place: Place;
  private _placeSub: Subscription;
  isBookable = false;
  isLoading = false;

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      const placeId = paramMap.get('placeId');
      this.isLoading = true;
      this._placeSub = this.placesService.getPlace(placeId).subscribe(data => {
        this.isLoading = false;
        this.place = data;
        this.isBookable = this.place.userId !== this.authService.userId;
      }, error => {
        this.alertcontroller.create({header: 'Error occured', message: 'Could not load place', buttons: [{
          text: 'Okay', handler: () => {
            this.router.navigate(['/places/tabs/discover']);
          }
        }]}).then(alertElem => {
          alertElem.present();
        });
      });
    });
  }

  ngOnDestroy(): void {
    if(this._placeSub) {
      this._placeSub.unsubscribe();
    }
  }

  onBookPlace() {
    // this.navCtrl.navigateBack('/places/tabs/discover'); // Cambia l'animazione rispetto al navigator di ionic (in questo caso back navigation)
    // this.navCtrl.pop();
    // this.router.navigateByUrl('/places/tabs/discover');

    this.actionSheetController.create({
      header: 'Choose An action',
      buttons: [{
        text: 'Cancel',
        // role: 'destructive' // colora rosso
        role: 'cancel' // lo mette più in basso di tutti
      }, {
        text: 'Selecte date',
        handler: () => {
          this.openBookingModal('select');
        }
      }
      , {
        text: 'Random Date',
        handler: () => {
          this.openBookingModal('random');
        }
      }]
    }).then(actionSheetElement => {
      actionSheetElement.present();
    });
  }

  openBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    this.modalController.create({
      component: CreateBookingComponent,
      componentProps:  { selectedPlace : this.place, selectedMode: mode }
    }).then(modal => {
      modal.present();
      return modal.onDidDismiss();
    }).then( modalDismiss => {
      console.log(modalDismiss.data, modalDismiss.role);
      const data = modalDismiss.data.bookingData;
      if (modalDismiss.role === 'confirm') {
        this.loadingController.create({message: 'Booking places..'}).then(loadedElem => {
          loadedElem.present();
          this.bookingService.addBooking(
            this.place.id,
            this.place.title,
            this.place.imageUrl,
            data.firstName,
            data.lastName,
            data.guestNumber,
            data.startDate,
            data.endDate
            ).subscribe(() => {
            loadedElem.dismiss();
          });
        });
      }
    });
  }

}
