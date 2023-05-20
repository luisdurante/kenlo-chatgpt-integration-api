import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { ChatGptModule } from '../chatgpt/chatgpt.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Interaction, InteractionSchema } from './schemas/interaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Interaction.name, schema: InteractionSchema },
    ]),
    ChatGptModule,
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
