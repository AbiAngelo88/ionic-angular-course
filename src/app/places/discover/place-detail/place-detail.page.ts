import { CreateBookingComponent } from './../../../bookings/create-booking/create-booking.component';
import { PlacesService } from './../../places.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController, ActionSheetController } from '@ionic/angular';
import { Place } from '../../place.model';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController) { }
  place: Place;
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      const placeId = paramMap.get('placeId');
      this.place = this.placesService.getPlace(placeId);
    });
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
      componentProps:  { selectedPlace : this.place }
    }).then(modal => {
      modal.present();
      return modal.onDidDismiss();
    }).then( modalDismiss => {
      console.log(modalDismiss.data, modalDismiss.role);
      if (modalDismiss.role === 'confirm') {
        console.log('BOOKED!');
      }
    });
  }

}
