import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { DatabaseService } from '../database/database.service';
import { Connection } from 'mongoose';
import { ChatGptService } from '../chatgpt/chatgpt.service';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly chatGptService: ChatGptService,
  ) {}

  private readonly databaseConnection: Connection =
    this.databaseService.getDbHandle();

  async create(createQuestionDto: CreateQuestionDto) {
    const response = await this.chatGptService.getAnswer(
      createQuestionDto.message,
    );

    if (response?.choices && response.choices.length) {
      const createdQuestion = await this.databaseConnection
        .collection('clients')
        .insertOne({
          message: createQuestionDto.message,
          answer: response.choices[0].message.content,
        });

      return {
        ...createdQuestion,
        message: createQuestionDto.message,
        answer: response.choices[0].message.content,
      };
    }
  }

  findAll() {
    return this.databaseConnection
      .collection('clients')
      .find({ email: { $exists: false } })
      .toArray();
  }
}
