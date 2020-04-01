import { IonItemSliding, LoadingController } from '@ionic/angular';
import { BookingService } from './booking.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Booking } from './booking.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {

  constructor(private bookingService: BookingService, private loadingController: LoadingController) { }
  bookingsSub: Subscription;
  loadedBookings: Booking[];
  isLoading = false;
  ngOnInit() {
    this.bookingsSub = this.bookingService.bookings.subscribe(data => {
      this.loadedBookings = data;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.bookingService.fetchBookings().subscribe(bookings => {
      this.loadedBookings = bookings;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.bookingsSub) {
      this.bookingsSub.unsubscribe();
    }
  }

  onCancelBooking(bookingId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.loadingController.create({message: 'Deleting booking..'}).then(loadingElem => {
      loadingElem.present();
      this.bookingService.cancelBooking(bookingId).subscribe(() => {
        loadingElem.dismiss();
      });
    });
  }

}
