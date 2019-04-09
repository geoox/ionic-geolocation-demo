import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  latitude: any;
  longitude: any;
  timestamp: any;
  pastLocations = [];

  constructor(public navCtrl: NavController, private backgroundGeolocation: BackgroundGeolocation, public zone: NgZone) {
  }

  startLocationTrack(): void {

    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 2,
      interval: 2000,
      debug: false, 
      stopOnTerminate: false
    };
    this.backgroundGeolocation.configure(config).subscribe((location) => {

      this.zone.run(() => {
        this.latitude = location.latitude;
        this.longitude = location.longitude;

        this.timestamp = new Date();

        const newLoc = {};
        newLoc['latitude'] = location.latitude;
        newLoc['longitude'] = location.longitude;
        newLoc['timestamp'] = new Date();

        this.pastLocations.push(newLoc);

      });
      console.log('location', location);
      this.backgroundGeolocation.finish();

    },
    (err) => {
      console.warn(err);
    });
    
    this.backgroundGeolocation.start();
  }

  stopLocationTrack(): void {
    this.backgroundGeolocation.stop();
  }

  showLocationsHistory(): void{
    this.backgroundGeolocation.getLocations().then(res => {
      console.log('Locations History', res);
    });
  }


  

}
