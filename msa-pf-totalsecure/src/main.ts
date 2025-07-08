import { getAppConfig, getCorsConfig, getSwaggerConfig } from './config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './common/pipes/custom-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Obtener configuración
  const configService = app.get(ConfigService);
  const appConfig = getAppConfig(configService);
  const corsConfig = getCorsConfig(configService);
  const swaggerConfig = getSwaggerConfig(configService);

  // Configuración de CORS y validación global
  app.enableCors({
    origin: corsConfig.origin,
    credentials: corsConfig.credentials,
  });

  // Configuración de validación global
  app.useGlobalPipes(new CustomValidationPipe());

  // Prefijo global para todas las rutas
  app.setGlobalPrefix('api/v1');

  // Configuración de Swagger
  if (swaggerConfig.isEnabled) {
    const config = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setVersion(swaggerConfig.version)
      .addBearerAuth(swaggerConfig.bearerAuth, 'access-token')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerConfig.path, app, document, {
      swaggerOptions: swaggerConfig.swaggerOptions,
    });

    console.log(
      `📖 Swagger habilitado en: http://localhost:${appConfig.port}/${swaggerConfig.path}`,
    );
  } else {
    console.log('📖 Swagger deshabilitado en producción');
  }

  // Configuración del puerto de la aplicación
  console.log(`🛡️  CORS habilitado para: ${corsConfig.origin.join(', ')}`);
  console.log('🚀 Aplicación iniciada en el puerto:', appConfig.port);
  console.log(`🌍 Entorno: ${appConfig.nodeEnv}`);

  await app.listen(appConfig.port);
}

// Iniciar la aplicación
bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
  process.exit(1);
});
