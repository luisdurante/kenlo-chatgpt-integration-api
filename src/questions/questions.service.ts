import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Model } from 'mongoose';
import { ChatGptService } from '../chatgpt/chatgpt.service';
import { InjectModel } from '@nestjs/mongoose';
import { Interaction } from './schemas/interaction.schema';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Interaction.name) private clientModel: Model<Interaction>,
    private readonly chatGptService: ChatGptService,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Interaction> {
    const response = await this.chatGptService.getAnswer(
      createQuestionDto.message,
    );

    if (response?.choices && response.choices.length) {
      return this.clientModel.create({
        message: createQuestionDto.message,
        answer: response.choices[0].message.content,
      });
    }
  }

  findAll(): Promise<Interaction[]> {
    return this.clientModel
      .find({ email: { $exists: false } }, { __v: 0 })
      .exec();
  }
}
