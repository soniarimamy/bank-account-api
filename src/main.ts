import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Activer la validation globale
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  // Configuration de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Gestion Bancaire')
    .setDescription(`
      ## API de gestion de comptes bancaires
      
      Cette API permet de gérer des opérations bancaires simples :
      
      - **Vérification de solde** : Consulter le solde d'un compte bancaire
      - **Retrait** : Effectuer un retrait d'argent avec vérification du solde
      
      ### Comptes de démonstration disponibles:
      
      | Numéro de compte | Code bancaire | Titulaire | Solde |
      |-----------------|---------------|-----------|-------|
      | MG76123456789 | 30001 | Rasoa Ramartine | 1500.50 MGA |
      | MG76987654321 | 30002 | TENDRINJANAHARY Theodore | 2500.00 MGA |
      | MG76456789123 | 30003 | RAKOTOARISOA Faneva | 500.75 MGA |
      | MG76321987654 | 30004 | ANDRIAMANDRANTO Teophile | 10000.00 MGA |
      | MG76876543210 | 30005 | SAHONDRA Lisa Parker | 75.20 MGA |
      
      ### Codes d'erreur possibles:
      - **404** : Compte non trouvé
      - **400** : Données invalides (format incorrect)
      - **500** : Erreur serveur interne
    `)
    .setVersion('1.0')
    .setContact(
      'Support Technique',
      'https://github.com/soniarimamy/bank-account-api.git',
      'support@bank.com'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addTag('Comptes Bancaires', 'Opérations sur les comptes bancaires')
    .addServer('http://localhost:3000', 'Serveur de développement')
    .addServer('http://api.bank.com', 'Serveur de production')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  
  // Configuration de l'interface Swagger UI
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'API Gestion Bancaire - Documentation',
    customCss: '.swagger-ui .topbar { background-color: #2c3e50; }',
    customfavIcon: 'https://nestjs.com/img/favicon.ico',
  });
  
  const port = process.env.API_PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation available on: http://localhost:${port}/api-docs`);
}
bootstrap();