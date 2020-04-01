import { HttpClient } from '@angular/common/http';
import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { Booking } from './booking.model';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, filter, delay, tap, switchMap } from 'rxjs/operators';

interface BookingData {
    bookedFrom: string;
    bookedTo: string;
    firstName: string;
    guestNumber: number;
    lastName: string;
    placeId: string;
    placeImg: string;
    placeTitle: string;
    userId: string;
}

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    constructor(private authService: AuthService, private http: HttpClient) {}

    get firebaseUrl(): string { return 'https://ionic-angular-course-21065.firebaseio.com/'; }
    private _bookings = new BehaviorSubject<Booking[]>([]);

    get bookings() {
        return this._bookings.asObservable();
    }

    fetchBookings() {
        // Filtriamo per userId
        return this.http.get<{[key: string]: BookingData}>(`${this.firebaseUrl}/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`)
        .pipe(map((bookingsData: any) => {
            const bookings = [];
            for (const key in bookingsData) {
                if (bookingsData.hasOwnProperty(key)) {
                    bookings.push(
                        new Booking(key,
                            bookingsData[key].placeId,
                            bookingsData[key].userId,
                            bookingsData[key].title,
                            bookingsData[key].imageUrl,
                            bookingsData[key].firstName,
                            bookingsData[key].lastName,
                            bookingsData[key].guestNumber,
                            new Date(bookingsData[key].bookedFrom),
                            new Date(bookingsData[key].bookedTo)));
                }
            }
            return bookings;
        }), tap(bookings => {
            this._bookings.next(bookings);
        }));
    }

    addBooking(
        placeId: string,
        placeTitle: string,
        placeImg: string,
        firstName: string,
        lastName: string,
        guestNumber: number,
        dateFrom: Date,
        dateTo: Date) {
        let generatedId: string;
        const newBooking = new Booking(Math.random().toString(),
        placeId,
        this.authService.userId,
        placeTitle,
        placeImg,
        firstName,
        lastName,
        guestNumber,
        dateFrom,
        dateTo);

        return this.http.post<{name: string}>(`${this.firebaseUrl}/bookings.json`, {...newBooking, id: null}).pipe(switchMap(resData => {
            generatedId = resData.name;
            return this.bookings;
        }), take(1), tap(bookings => {
            newBooking.id = generatedId;
            this._bookings.next(bookings.concat(newBooking));
        }));
        // Inserendo return si rimanere in ascolto all'esterno!
        // return this.bookings.pipe(take(1), delay(1000), tap((bookings: any) => {
        //     this._bookings.next(bookings.concat(newBooking));
        // }));
    }

    cancelBooking(bookingId: string) {
        return this.http.delete(`${this.firebaseUrl}/bookings/${bookingId}.json`).pipe(switchMap(() => {
            return this.bookings;
        }), take(1), tap(bookings => {
            const newBookings = bookings.filter(e => e.id !== bookingId);
            this._bookings.next(newBookings);
        }));


        // return this.bookings.pipe(take(1), delay(1000), tap(data => {
        //     this._bookings.next(data.filter(elem => elem.id !== bookingId));
        // }));
    }
}