import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'mongoose';
import { DatabaseService } from '../src/database/database.service';

describe('QuestionsController', () => {
  let dbConnection: Connection;
  let httpServer: any;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();

    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await dbConnection.collection('clients').deleteMany({});
  });

  describe('GET /questions', () => {
    it('should return an array of chatgpt interactions', async () => {
      // Arrange
      const interaction = {
        message: 'Message one',
        answer: 'Answer one',
      };

      await dbConnection.collection('clients').insertOne(interaction);

      // Act
      const response = await request(httpServer).get('/questions');

      // Assert
      expect(response.body).toEqual({
        interactions: expect.arrayContaining([
          expect.objectContaining({
            message: 'Message one',
            answer: 'Answer one',
          }),
        ]),
      });
    });

    it('should return an empty array', async () => {
      // Arrange

      // Act
      const response = await request(httpServer).get('/questions');

      // Assert
      expect(response.body).toEqual({
        interactions: expect.arrayContaining([]),
      });

      expect(response.body.interactions).toHaveLength(0);
    });
  });

  describe('POST /questions', () => {
    it('should return a created chatgpt interaction', async () => {
      // Arrange
      const createQuestionDTO = {
        message: 'Hello',
      };

      // Act
      const response = await request(httpServer)
        .post('/questions')
        .send(createQuestionDTO);

      // Assert
      expect(response.body).toMatchObject(createQuestionDTO);
    });

    it('should throw an Bad Request exception because request data is wrong', async () => {
      // Arrange
      const createQuestionDTO = {
        message: '',
      };

      // Act
      const response = await request(httpServer)
        .post('/questions')
        .send(createQuestionDTO);

      // Assert
      expect(response.statusCode).toEqual(400);
      expect(JSON.parse(response.text)).toMatchObject({
        message: ['message should not be empty'],
      });
    });
  });
});
