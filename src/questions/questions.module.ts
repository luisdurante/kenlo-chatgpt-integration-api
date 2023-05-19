import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { DatabaseModule } from '../database/database.module';
import { ChatGptModule } from '../chatgpt/chatgpt.module';

@Module({
  imports: [DatabaseModule, ChatGptModule],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
