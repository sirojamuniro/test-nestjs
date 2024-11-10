import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import fastifyStatic from '@fastify/static';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import helmet from '@fastify/helmet'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true })
  );

    // Enable global validation
    app.useGlobalPipes(new ValidationPipe());
    app.register(helmet, {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`, 'unpkg.com'],
          styleSrc: [
            `'self'`,
            `'unsafe-inline'`,
            'cdn.jsdelivr.net',
            'fonts.googleapis.com',
            'unpkg.com',
          ],
          fontSrc: [`'self'`, 'fonts.gstatic.com', 'data:'],
          imgSrc: [`'self'`, 'data:', 'cdn.jsdelivr.net'],
          scriptSrc: [
            `'self'`,
            `https: 'unsafe-inline'`,
            `cdn.jsdelivr.net`,
            `'unsafe-eval'`,
          ],
        },
      },
    });
  //using helmet
    app.register(helmet)

   // Enable CORS
   app.enableCors({
    origin: '*', // Adjust as needed, or specify specific origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Register fastifyStatic and serve files from 'public' directory
  app.getHttpAdapter().getInstance().register(fastifyStatic, {
    root: join(__dirname, '..', 'public'), 
    prefix: '/static/', 
  });


  // Set up Swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API documentation for the NestJS application')
    .setVersion('1.0')
    .addBearerAuth() // Add JWT or other authentication if required
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI available at /api

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();