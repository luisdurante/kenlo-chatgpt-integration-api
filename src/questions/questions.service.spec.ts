import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from './questions.service';
import { createMock } from '@golevelup/ts-jest';
import { ChatGptService } from '../chatgpt/chatgpt.service';
import { Model, Query } from 'mongoose';
import { InteractionDocument } from './schemas/interaction.schema';
import { getModelToken } from '@nestjs/mongoose';
import { ServiceUnavailableException } from '@nestjs/common';

describe('QuestionsService', () => {
  let questionsService: QuestionsService;
  let interactionsModel: Model<InteractionDocument>;
  let chatGptService: ChatGptService;

  const interactionsModelMock = {
    create: jest.fn(),
    find: jest.fn(),
  };

  const chatGptServiceMock = {
    getAnswer: jest.fn(),
  };

  const interactionsMock = [
    {
      _id: '6467f63bad9d00dbb4150218',
      message: 'Message one',
      answer: 'Answer one',
    },
    {
      _id: '6467f63bad9d00dbb4150219',
      message: 'Message two',
      answer: 'Answer two',
    },
  ];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        {
          provide: getModelToken('Interaction'),
          useValue: interactionsModelMock,
        },
        {
          provide: ChatGptService,
          useValue: chatGptServiceMock,
        },
      ],
    }).compile();

    questionsService = module.get<QuestionsService>(QuestionsService);
    interactionsModel = module.get<Model<InteractionDocument>>(
      getModelToken('Interaction'),
    );
    chatGptService = module.get<ChatGptService>(ChatGptService);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(questionsService).toBeDefined();
    expect(interactionsModel).toBeDefined();
    expect(chatGptService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of chatgpt interactions', async () => {
      // Arrange

      jest.spyOn(interactionsModel, 'find').mockReturnValueOnce(
        createMock<Query<InteractionDocument[], InteractionDocument>>({
          exec: jest.fn().mockResolvedValueOnce(interactionsMock),
        }),
      );

      // Act
      const interactions = await questionsService.findAll();

      // Assert
      expect(interactions).toMatchObject(interactionsMock);
      expect(interactionsModel.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('create interaction', () => {
    it('should create and return a valid chatgpt interaction', async () => {
      // Arrange
      const questionDTOMock = {
        message: 'Message one',
      };

      interactionsModelMock.create.mockReturnValue(interactionsMock[0]);

      chatGptServiceMock.getAnswer.mockReturnValue({
        choices: [{ message: { content: 'Answer one' } }],
      });

      // Act
      const interaction = await questionsService.create(questionDTOMock);

      // Assert
      expect(interaction).toMatchObject(interactionsMock[0]);
      expect(interactionsModel.create).toHaveBeenCalledTimes(1);
      expect(chatGptService.getAnswer).toHaveBeenCalledTimes(1);
    });

    it('should return a ServiceUnavailableException because chatgpt API is unavailable', async () => {
      // Arrange
      const questionDTOMock = {
        message: 'Message one',
      };

      interactionsModelMock.create.mockReturnValue(interactionsMock[0]);

      chatGptServiceMock.getAnswer = jest.fn(() => {
        throw new ServiceUnavailableException();
      });

      // Act, Assert
      await expect(questionsService.create(questionDTOMock)).rejects.toThrow(
        ServiceUnavailableException,
      );
      expect(chatGptService.getAnswer).toHaveBeenCalledTimes(1);
      expect(interactionsModel.create).toHaveBeenCalledTimes(0);
    });
  });
});
