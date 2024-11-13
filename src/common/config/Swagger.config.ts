import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SwaggerConfig {
  static init(app: INestApplication) {
    const options = new DocumentBuilder()
      .setTitle('Web Api Documentation')
      .setDescription('API Documentation')
      .setVersion('3.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'Authorization',
      )
      .addSecurityRequirements('Authorization')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document, {
      swaggerOptions: {
        // save token
        persistAuthorization: true,
        //shouldDisableEmptyProperties
      },
    });
  }
}
