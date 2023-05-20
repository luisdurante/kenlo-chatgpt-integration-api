import { HttpService } from '@nestjs/axios';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatGptService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private readonly apiUrl = this.configService.get<string>('OPENAPI_URL');
  private readonly apiKey = this.configService.get<string>('OPENAPI_KEY');

  getAnswer(message: string): Promise<any> {
    const response = this.httpService.axiosRef
      .post(
        `${this.apiUrl}/chat/completions`,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: message,
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      )
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        throw new ServiceUnavailableException(error.message);
      });

    return response;
  }
}
