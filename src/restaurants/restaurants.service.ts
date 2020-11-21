import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Meal,
  MealDocument,
  Menu,
  MenuDocument,
  MenuItem,
  MenuItemDocument,
} from './menu.schema';
import { Restaurant, RestaurantDocument } from './restaurant.schema';
import { CreateRestaurantDto } from './dto/createRestaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<RestaurantDocument>,
    @InjectModel(Menu.name) private readonly menuModel: Model<MenuDocument>,
    @InjectModel(MenuItem.name)
    private readonly menuItemModel: Model<MenuItemDocument>,
    @InjectModel(Meal.name) private readonly mealModel: Model<MealDocument>,
  ) {}

  async createRestaurant(createRestaurantDto: CreateRestaurantDto) {
    const {
      name,
      description,
      address,
      location,
      website,
      menu,
      imageUrl,
      tags,
    } = createRestaurantDto;

    const restaurant = new this.restaurantModel();
    const restaurantMenu = new this.menuModel();

    restaurant.name = name;
    restaurant.description = description;
    restaurant.address = address;
    restaurant.website = website;
    restaurant.location = { ...location };
    restaurant.imageUrl = imageUrl;
    restaurant.tags = tags;

    menu.items.forEach(async item => {
      const menuItem = new this.menuItemModel();
      menuItem.category = item.category;
      item.meals.forEach(async meal => {
        const menuItemMeal = new this.mealModel();
        menuItemMeal.price = meal.price;
        menuItemMeal.name = meal.name;
        menuItemMeal.save();
        menuItem.meals.push(menuItemMeal);
      });
      menuItem.save();
      restaurantMenu.items.push(menuItem);
    });

    await restaurantMenu.save();
    restaurant.menu = restaurantMenu._id;

    await restaurant.save();

    return restaurant;
  }

  async getRestaurant(id: string) {
    const restaurant = await this.restaurantModel
      .findById(id)
      .populate({
        path: 'menu',
        populate: {
          path: 'items',
          model: MenuItem.name,
          populate: {
            path: 'meals',
            model: Meal.name,
          },
        },
      })
      .exec();
    return restaurant;
  }

  async getAllRestaurants() {
    const restaurants = await this.restaurantModel
      .find()
      .populate({
        path: 'menu',
        populate: {
          path: 'items',
          model: MenuItem.name,
          populate: {
            path: 'meals',
            model: Meal.name,
          },
        },
      })
      .exec();

    return restaurants;
  }

  async getMenu(id: string) {
    const menu = await this.menuModel.findById(id).populate('items');
    return menu;
  }

  async deleteRestaurant(id: string): Promise<void> {
    await this.restaurantModel.findByIdAndDelete(id);
  }
}
