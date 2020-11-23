import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import {
  Meal,
  MealSchema,
  Menu,
  MenuItem,
  MenuItemSchema,
  MenuSchema,
} from './menu.schema';

import { Restaurant, RestaurantSchema } from './restaurant.schema';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Restaurant.name,
        schema: RestaurantSchema,
      },
      {
        name: MenuItem.name,
        schema: MenuItemSchema,
      },
      {
        name: Menu.name,
        schema: MenuSchema,
      },
      {
        name: Meal.name,
        schema: MealSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
})
export class RestaurantsModule {}
