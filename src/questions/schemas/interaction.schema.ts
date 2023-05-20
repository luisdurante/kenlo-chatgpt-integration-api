import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InteractionDocument = HydratedDocument<Interaction>;

@Schema({ collection: 'clients' })
export class Interaction {
  @Prop()
  message: string;

  @Prop()
  answer: string;
}

export const InteractionSchema = SchemaFactory.createForClass(Interaction);
