import {Component, OnInit, OnDestroy} from '@angular/core';
import { ZenObservable } from 'zen-observable-ts';
import { APIService, Restaurant } from './API.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'demo';

  constructor(private api: APIService) {
  }

  public restaurants: Array<Restaurant> = [];

  private subscription: ZenObservable.Subscription | null = null;

  async ngOnInit() {
    this.api.ListRestaurants().then(event => {
      this.restaurants = event.items as Restaurant[];
    });

    /* subscribe to new restaurants being created */
    this.subscription = this.api.OnCreateRestaurantListener.subscribe(
      (event: any) => {
        const newRestaurant = event.value.data.onCreateRestaurant;
        this.restaurants = [newRestaurant, ...this.restaurants];
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = null;
  }
}
