import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { MapModalComponent } from './map-modal/map-modal.component';

@NgModule({
    declarations: [LocationPickerComponent, MapModalComponent],
    exports: [LocationPickerComponent, MapModalComponent],
    imports: [CommonModule, IonicModule],
    entryComponents: [MapModalComponent],
    providers: []
})
export class SharedModule {}
