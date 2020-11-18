import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Menu } from './menu.schema';

export interface Location {
  lat: number;
  lng: number;
}

export type RestaurantDocument = Restaurant & Document;

@Schema({ timestamps: true })
export class Restaurant {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  website: string;

  @Prop({ required: true })
  tags: string;

  @Prop(
    raw({
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    }),
  )
  location: Location;

  @Prop({ type: Types.ObjectId, ref: Menu.name })
  menu: Menu;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
