import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { CreateRestaurantDto } from './dto/createRestaurant.dto';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  private logger = new Logger('RestaurantController');

  constructor(private readonly restaurantService: RestaurantsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createRestaurantDto: CreateRestaurantDto) {
    this.logger.verbose(`User is about to create restaurant`);
    return await this.restaurantService.createRestaurant(createRestaurantDto);
  }

  @Get()
  async getAll() {
    return await this.restaurantService.getAllRestaurants();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.restaurantService.getRestaurant(id);
  }

  @Get('menu/:id')
  async getMenu(@Param('id') id: string) {
    return await this.restaurantService.getMenu(id);
  }
}
