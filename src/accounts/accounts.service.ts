import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { CheckBalanceDto } from './dto/check-balance.dto';
import { WithdrawDto } from './dto/withdraw.dto';

// Interface pour le compte
interface DummyAccount {
  id: number;
  accountNumber: string;
  bankCode: string;
  balance: number;
  accountHolder: string;
}

@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);
  private dummyAccounts: DummyAccount[] = [];

  constructor() {
    // Initialiser les données factices
    this.initializeDummyData();
  }

  /**
   * Initialise les données factices avec les comptes de démonstration
   */
  private initializeDummyData() {
    this.dummyAccounts = [
      {
        id: 1,
        accountNumber: 'MG76123456789',
        bankCode: '30001',
        balance: 1500.50,
        accountHolder: 'Rasoa Ramartine'
      },
      {
        id: 2,
        accountNumber: 'MG76987654321',
        bankCode: '30002',
        balance: 2500.00,
        accountHolder: 'TENDRINJANAHARY Theodore'
      },
      {
        id: 3,
        accountNumber: 'MG76456789123',
        bankCode: '30003',
        balance: 500.75,
        accountHolder: 'RAKOTOARISOA Faneva'
      },
      {
        id: 4,
        accountNumber: 'MG76321987654',
        bankCode: '30004',
        balance: 10000.00,
        accountHolder: 'ANDRIAMANDRANTO Teophile'
      },
      {
        id: 5,
        accountNumber: 'MG76876543210',
        bankCode: '30005',
        balance: 75.20,
        accountHolder: 'SAHONDRA Lisa Parker'
      },
      {
        id: 6,
        accountNumber: 'MG76823886788',
        bankCode: '30006',
        balance: 1500.50,
        accountHolder: 'RAHARISON Alin Bertrand'
      }
    ];

    this.logger.log(`Données factices initialisées avec ${this.dummyAccounts.length} comptes`);
  }

  /**
   * Vérifier le solde d'un compte
   */
  async checkBalance(checkBalanceDto: CheckBalanceDto): Promise<{ balance: number; message: string }> {
    const { accountNumber, bankCode } = checkBalanceDto;
    
    this.logger.log(`Vérification du solde pour le compte: ${accountNumber} (${bankCode})`);
    
    const account = this.findAccount(accountNumber, bankCode);
    
    this.logger.log(`Solde trouvé: ${account.balance} MGA pour le compte ${accountNumber}`);
    
    return {
      balance: account.balance,
      message: `Votre solde est de ${account.balance} MGA`,
    };
  }

  /**
   * Effectuer un retrait
   */
  async withdraw(withdrawDto: WithdrawDto): Promise<{ message: string; newBalance?: number }> {
    const { accountNumber, bankCode, amount } = withdrawDto;
    
    this.logger.log(`Tentative de retrait de ${amount} MGA pour le compte: ${accountNumber} (${bankCode})`);
    
    const account = this.findAccount(accountNumber, bankCode);
    
    if (account.balance < amount) {
      this.logger.warn(`Retrait refusé - Solde insuffisant: ${account.balance} MGA < ${amount} MGA pour le compte ${accountNumber}`);
      return {
        message: 'votre solde est insuffisant',
      };
    }
    
    // Effectuer le retrait
    account.balance -= amount;
    
    this.logger.log(`Retrait effectué avec succès. Nouveau solde: ${account.balance} MGA pour le compte ${accountNumber}`);
    
    return {
      message: 'retrait effectué avec succés',
      newBalance: account.balance,
    };
  }

  /**
   * Rechercher un compte par numéro et code bancaire
   */
  private findAccount(accountNumber: string, bankCode: string): DummyAccount {
    const account = this.dummyAccounts.find(
      acc => acc.accountNumber === accountNumber && acc.bankCode === bankCode
    );
    
    if (!account) {
      this.logger.error(`Compte non trouvé: ${accountNumber} (${bankCode})`);
      throw new NotFoundException('Compte non trouvé');
    }
    
    return account;
  }

  /**
   * Méthode utilitaire pour obtenir tous les comptes (optionnel)
   */
  getAllAccounts(): DummyAccount[] {
    return [...this.dummyAccounts];
  }

  /**
   * Méthode utilitaire pour obtenir un compte par ID (optionnel)
   */
  getAccountById(id: number): DummyAccount | undefined {
    return this.dummyAccounts.find(acc => acc.id === id);
  }

  /**
   * Méthode utilitaire pour réinitialiser les données (optionnel)
   */
  resetDummyData(): void {
    this.initializeDummyData();
    this.logger.log('Données factices réinitialisées');
  }
}