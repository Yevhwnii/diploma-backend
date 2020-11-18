import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';

export type MenuDocument = Menu & Document;
export type MenuItemDocument = MenuItem & Document;
export type MealDocument = Meal & Document;

@Schema()
export class Meal extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;
}

export const MealSchema = SchemaFactory.createForClass(Meal);

@Schema()
export class MenuItem extends Document {
  @Prop({ required: true })
  category: string;

  @Prop({ type: [MealSchema], default: [] })
  meals: Meal[];
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);

@Schema()
export class Menu extends Document {
  @Prop({
    type: [Types.ObjectId],
    required: true,
    default: [],
    ref: MenuItem.name,
  })
  items: MenuItem[];
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
