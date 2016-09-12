var config = {
    apiKey: "AIzaSyCUEtuiIUf_V9C7D299SVdkcPJ5gkU90aE",
    authDomain: "cityride-b1417.firebaseapp.com",
    databaseURL: "https://cityride-b1417.firebaseio.com",
    storageBucket: "cityride-b1417.appspot.com",
};
firebase.initializeApp(config);

var ridesRef = firebase.database().ref('rides');

function addRide(ride) {
    var now = moment().format(),
        in30mins = moment().add(30, 'minutes').format(),
        newRide = ridesRef.push();

    newRide.set({
        driver: ride.driver,
        riders: ride.riders,
        dateTimeStart: now,
        dateTimeEnd: ride.dateTimeEnd || in30mins,
        coordsStart: ride.coordsStart,
        coordsEnd: ride.coordsEnd,
        // path: ride.path
    });

    var path = newRide.toString(); // ride uid
}