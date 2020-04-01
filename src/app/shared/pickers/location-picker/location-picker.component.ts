import { MapModalComponent } from './../../map-modal/map-modal.component';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  onPickLocation() {
    this.modalController.create({component: MapModalComponent}).then(modalCmp => {
      modalCmp.present();
    });
  }

}
