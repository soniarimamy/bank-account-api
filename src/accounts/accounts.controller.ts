import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CheckBalanceDto } from './dto/check-balance.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { BalanceResponseDto } from './dto/balance-response.dto';
import { ErrorResponseDto } from './dto/error-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Comptes Bancaires')
@ApiBearerAuth('access-token') // Spécifier le nom du security scheme
@ApiSecurity('access-token') // Alternative pour la sécurité
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post('check-balance')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Vérifier le solde d\'un compte',
    description: 'Cette endpoint permet de consulter le solde d\'un compte bancaire en fournissant le numéro de compte et le code bancaire. Authentification requise.'
  })
  @ApiBearerAuth('access-token')
  @ApiBody({
    type: CheckBalanceDto,
    description: 'Informations du compte à vérifier',
    examples: {
      'compte_standard': {
        summary: 'Compte standard',
        value: {
          accountNumber: 'MG76123456789',
          bankCode: '30001'
        }
      },
      'compte_avec_solde_eleve': {
        summary: 'Compte avec solde élevé',
        value: {
          accountNumber: 'MG76321987654',
          bankCode: '30004'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Solde du compte récupéré avec succès',
    type: BalanceResponseDto,
    example: {
      balance: 1500.50,
      message: 'Votre solde est de 1500.5 MGA'
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié - Token manquant ou invalide',
    type: ErrorResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Compte non trouvé',
    type: ErrorResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
    type: ErrorResponseDto
  })
  async checkBalance(@Body() checkBalanceDto: CheckBalanceDto) {
    return this.accountsService.checkBalance(checkBalanceDto);
  }

  @Post('withdraw')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Effectuer un retrait',
    description: 'Cette endpoint permet d\'effectuer un retrait d\'argent d\'un compte bancaire. Vérifie automatiquement si le solde est suffisant. Authentification requise.'
  })
  @ApiBearerAuth('access-token')
  @ApiBody({
    type: WithdrawDto,
    description: 'Informations du retrait',
    examples: {
      'retrait_valide': {
        summary: 'Retrait valide (solde suffisant)',
        value: {
          accountNumber: 'MG76123456789',
          bankCode: '30001',
          amount: 100
        }
      },
      'retrait_solde_insuffisant': {
        summary: 'Retrait avec solde insuffisant',
        value: {
          accountNumber: 'MG76876543210',
          bankCode: '30005',
          amount: 100
        }
      },
      'retrait_montant_important': {
        summary: 'Retrait d\'un montant important',
        value: {
          accountNumber: 'MG76321987654',
          bankCode: '30004',
          amount: 5000
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Opération de retrait traitée avec succès',
    schema: {
      oneOf: [
        {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'retrait effectué avec succés' },
            newBalance: { type: 'number', example: 1400.50 }
          }
        },
        {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'votre solde est insuffisant' }
          }
        }
      ]
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié - Token manquant ou invalide',
    type: ErrorResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Compte non trouvé',
    type: ErrorResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides (montant négatif ou supérieur à la limite)',
    type: ErrorResponseDto
  })
  async withdraw(@Body() withdrawDto: WithdrawDto) {
    return this.accountsService.withdraw(withdrawDto);
  }
}