import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
  new Place('p1', 'Manhattan Mansion', 'In the heart of New York', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/NYC_Montage_2014_4_-_Jleon.jpg/190px-NYC_Montage_2014_4_-_Jleon.jpg', 149.99),
  new Place('p2', 'N\'artra casa', 'A roma', 'https://static.amazon.jobs/locations/58/thumbnails/NYC.jpg?1547618123', 189.99),
  new Place('p3', 'casa 3', 'A Napoli', 'https://static.amazon.jobs/locations/58/thumbnails/NYC.jpg?1547618123', 99.99)
];

  get places() {
    return [...this._places];
  }

  getPlace(id: string) {
    return {...this._places.find(p => p.id === id)};
  }
  constructor() { }
}
