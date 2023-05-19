import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionsService {
  create(createQuestionDto: CreateQuestionDto) {
    return 'This action adds a new question';
  }
}
