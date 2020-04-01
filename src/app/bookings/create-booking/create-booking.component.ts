import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { Place } from 'src/app/places/place.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {

  @Input() selectedPlace: Place;
  @Input() selectedMode: 'select' | 'random';
  @ViewChild('form', {static: true}) form: NgForm;

  startDate: string;
  endDate: string;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    const avaibleFrom =  new Date(this.selectedPlace.avaibleFrom);
    const avaibleTo =  new Date(this.selectedPlace.avaibleTo);
    if (this.selectedMode === 'random') {
      this.startDate = new Date(avaibleFrom.getTime() + Math.random() * (avaibleTo.getTime() - 7 * 24 * 60 * 60 * 1000 - avaibleFrom.getTime())).toISOString();
      this.endDate = new Date(new Date(this.startDate).getTime() + Math.random() * ( new Date(this.startDate).getTime() + 6 * 24 * 60 * 60 * 1000 - new Date(this.startDate).getTime())).toISOString();
    }
  }

  onCancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  onBookPlace() {
    if (this.form.invalid || !this.datesValid()) {
      console.log('form is not valid');
      return;
    }

    this.modalController.dismiss({ bookingData: {
      firstName: this.form.value['first-name'],
      lastName: this.form.value['last-name'],
      guestNumber: +this.form.value['guest-number'],
      startDate: new Date(this.form.value['date-from']),
      endDate: new Date(this.form.value['date-to']),
    }}, 'confirm');
  }

  datesValid() {
    const startDate = new Date(this.form.value['date-from']);
    const endDate = new Date(this.form.value['date-to']);

    return endDate > startDate;
  }
}
