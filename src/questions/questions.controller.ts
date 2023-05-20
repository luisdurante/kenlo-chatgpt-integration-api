import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Interaction } from './schemas/interaction.schema';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createQuestionDto: CreateQuestionDto): Promise<Interaction> {
    return this.questionsService.create(createQuestionDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<any> {
    const interactions = await this.questionsService.findAll();
    return { interactions };
  }
}
