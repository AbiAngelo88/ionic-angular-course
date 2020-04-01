export class Booking {
    public id: string;
    placeId: string;
    userId: string;
    placeTitle: string;
    placeImg: string;
    firstName: string;
    lastName: string;
    guestNumber: number;
    bookedFrom: Date;
    bookedTo: Date;


    constructor(
        id: string,
        placeId: string,
        userId: string,
        placeTitle: string,
        placeImg: string,
        firstName: string,
        lastName: string,
        guestNumber: number,
        bookedFrom: Date,
        bookedTo: Date
    ) {
        this.id = id;
        this.placeId =  placeId;
        this.userId =  userId;
        this.placeTitle = placeTitle;
        this.placeImg =  placeImg;
        this.firstName =  firstName;
        this.lastName =  lastName;
        this.guestNumber = guestNumber;
        this.bookedFrom = bookedFrom;
        this.bookedTo = bookedTo;
    }
}
