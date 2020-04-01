import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { Subject, BehaviorSubject, of } from 'rxjs';
import { take, map, filter, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


export interface PlaceData {
  avaibleFrom: string;
  avaibleTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  constructor(private authService: AuthService, private http: HttpClient) { }

  // new Place('p1', 'Manhattan Mansion', 'In the heart of New York', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/NYC_Montage_2014_4_-_Jleon.jpg/190px-NYC_Montage_2014_4_-_Jleon.jpg', 149.99, new Date('2020-03-31'), new Date('2021-12-31'), 'asd'),
  // new Place('p2', 'N\'artra casa', 'A roma', 'https://static.amazon.jobs/locations/58/thumbnails/NYC.jpg?1547618123', 189.99, new Date('2020-03-31'), new Date('2021-12-31'), 'asd'),
  // new Place('p3', 'casa 3', 'A Napoli', 'https://static.amazon.jobs/locations/58/thumbnails/NYC.jpg?1547618123', 99.99, new Date('2020-03-31'), new Date('2021-12-31'), 'xyz')



  get firebaseUrl() { return 'https://ionic-angular-course-21065.firebaseio.com/'; }

  private _places = new BehaviorSubject<Place[]> ([]);

  get places() {
    return this._places.asObservable();
  }

  getPlace(id: string) {
    /** La funzione map ha come input il risultato dell'operatore take */
    // return this.places.pipe(take(1), map(places => {
    //   return {...places.find(p => p.id === id)};
    // }));
    return this.http.get<PlaceData>(`${this.firebaseUrl}/offered-places/${id }.json`).pipe(map(resData => {
      return new Place(id, resData.title, resData.description, resData.imageUrl, resData.price, new Date(resData.avaibleFrom), new Date(resData.avaibleTo), resData.userId);
    }));
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(take(1), switchMap(places => {
      if (!places || places.length <= 0) {
        return this.fetchPlaces();
      } else {
        return of(places);
      }
    }), switchMap((places: Place[]) => {
      const updatedPlaceIndex = places.findIndex(p => p.id === placeId);
      updatedPlaces = [...places];
      const oldPlace = updatedPlaces[updatedPlaceIndex];
      updatedPlaces[updatedPlaceIndex] = new Place(
        oldPlace.id,
        title,
        description,
        oldPlace.imageUrl,
        oldPlace.price,
        oldPlace.avaibleFrom,
        oldPlace.avaibleTo,
        oldPlace.userId);
      return this.http.put(`${this.firebaseUrl}/offered-places/${placeId }.json`, {...updatedPlaces[updatedPlaceIndex], id: null});
    }), tap(() => {
      this._places.next(updatedPlaces);
    }));

  }

  fetchPlaces() {
    return this.http.get<{[key: string]: PlaceData}>(this.firebaseUrl + '/offered-places.json').pipe(map( (res: any) => {
      const places = [];
      for (const key in res) {
        if (res.hasOwnProperty(key)) {
          const newPlace = new Place(key,
            res[key].title,
            res[key].description,
            res[key].imageUrl,
            res[key].price,
            new Date(res[key].avaibleFrom),
            new Date(res[key].avaibleTo),
            res[key].userId);
          places.push(newPlace);
        }
      }

      return places;
    }), tap( places => {
      this._places.next(places);
    }));
  }

  /** NB. L'operatore switchMap ritorna un observable. L'operatore map invece NO!
   */

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    const newPlace: Place = new Place(Math.random().toString(), title, description, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/NYC_Montage_2014_4_-_Jleon.jpg/190px-NYC_Montage_2014_4_-_Jleon.jpg', price, dateFrom, dateTo, this.authService.userId);

    let generatedId: string;
    /** Si passa alla post newPlace ma mettendo id null per usare quello creato da firebase */
    return this.http.post<{name: string}>(this.firebaseUrl + '/offered-places.json', {...newPlace, id: null})
    .pipe(switchMap(resultData => {
      generatedId = resultData.name;
      return this.places;
    }), take(1), tap(places => {
      newPlace.id = generatedId;
      this._places.next(places.concat(newPlace));
    }));
    /** Inserendo take(1) si prende solamente lo stato attuale dell'array,
     * ma in questo modo si stoppa l'observable quì (si consuma e non si può notificare all'esterno l'avvenuto inserimento)
     */
    // this.places.pipe(take(1)).subscribe(places => {
    //   setTimeout(() => {
    //       this._places.next(places.concat(newPlace));
    //   }, 1000);
    // });

    /** Con l'operatore tap ci immettiamo nella catena di operazioni del pipe: si ha come input l'array corrente
     * di places ottenuto dall'operatore take(1). Si ritorna così un observable a cui ci si può sottoscrivere all'esterno
     */
    // return this.places.pipe(take(1), delay(1000), tap(places => {
    //     this._places.next(places.concat(newPlace));
    //     console.log('ADDED', this._places);
    // }));
  }
 }
