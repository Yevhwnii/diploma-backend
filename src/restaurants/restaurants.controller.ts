import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
  Logger,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateRestaurantDto } from './dto/createRestaurant.dto';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  private logger = new Logger('RestaurantController');

  constructor(private readonly restaurantService: RestaurantsService) {}

  @UseGuards(AuthGuard())
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

  @Get('/search')
  async search(@Query() query: { q: string }) {
    const { q } = query;
    return this.restaurantService.search(q);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.restaurantService.getRestaurant(id);
  }

  @Get('menu/:id')
  async getMenu(@Param('id') id: string) {
    return await this.restaurantService.getMenu(id);
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.restaurantService.deleteRestaurant(id);
  }
}
