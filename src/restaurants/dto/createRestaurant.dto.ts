import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { Menu } from '../menu.schema';
import { Location } from '../restaurant.schema';

export class CreateRestaurantDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 250)
  description: string;

  @IsNotEmpty()
  @MinLength(5)
  imageUrl: string;

  @IsNotEmpty()
  @IsString()
  @Length(0, 50)
  address: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 50)
  website: string;

  @IsOptional()
  @IsString()
  @Length(5, 50)
  tags: string;

  @IsNotEmptyObject()
  location: Location;

  @IsNotEmptyObject()
  menu: Menu;
}
