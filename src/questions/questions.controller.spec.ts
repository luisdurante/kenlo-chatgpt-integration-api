import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { ServiceUnavailableException } from '@nestjs/common';

describe('QuestionsController', () => {
  let questionsController: QuestionsController;
  let questionsService: QuestionsService;

  const questionsServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
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
        QuestionsController,
        {
          provide: QuestionsService,
          useValue: questionsServiceMock,
        },
      ],
    }).compile();

    questionsController = module.get<QuestionsController>(QuestionsController);
    questionsService = module.get<QuestionsService>(QuestionsService);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(questionsController).toBeDefined();
    expect(questionsService).toBeDefined();
  });

  describe('create', () => {
    it('should return a created chatgpt interaction', async () => {
      // Arrange
      const questionDTOMock = {
        message: 'Message one',
      };

      questionsServiceMock.create.mockReturnValue(interactionsMock[0]);

      // Act
      const interaction = await questionsServiceMock.create(questionDTOMock);

      // Assert
      expect(interaction).toMatchObject(interactionsMock[0]);
      expect(questionsService.create).toHaveBeenCalledTimes(1);
    });

    it('should return a ServiceUnavailableException because chatgpt API is unavailable', async () => {
      // Arrange
      const questionDTOMock = {
        message: 'Message one',
      };

      questionsServiceMock.create = jest.fn(() => {
        throw new ServiceUnavailableException();
      });

      // Act, Assert
      expect(() => {
        questionsController.create(questionDTOMock);
      }).toThrow(ServiceUnavailableException);
      expect(questionsServiceMock.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of created chatgpt interactions', async () => {
      // Arrange
      jest
        .spyOn(questionsService, 'findAll')
        .mockImplementation(async () => interactionsMock);

      // Act
      const result = await questionsController.findAll();

      // Assert
      expect(result.interactions).toHaveLength(2);
      expect(questionsServiceMock.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
