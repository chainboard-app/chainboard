import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { StellarService } from './stellar.service';

interface WalletConnection {
  publicKey: string;
  isConnected: boolean;
  network: string;
}

interface SignedTransaction {
  xdr: string;
  network: string;
}

@Injectable()
export class WalletConnectionService {
  private readonly logger = new Logger(WalletConnectionService.name);

  constructor(private readonly stellarService: StellarService) {}

  /**
   * Validate a Stellar public key from wallet connection
   */
  validatePublicKey(publicKey: string): boolean {
    const stellarPublicKeyRegex = /^G[A-Z0-9]{55}$/;
    return stellarPublicKeyRegex.test(publicKey);
  }

  /**
   * Get wallet connection status
   */
  async getConnectionStatus(publicKey: string): Promise<WalletConnection> {
    if (!this.validatePublicKey(publicKey)) {
      throw new BadRequestException('Invalid Stellar public key');
    }

    const account = await this.stellarService.getAccount(publicKey);
    const networkInfo = this.stellarService.getNetworkInfo();

    return {
      publicKey,
      isConnected: account !== null,
      network: networkInfo.network,
    };
  }

  /**
   * Sign a transaction using wallet (client-side signing)
   * This endpoint provides the unsigned transaction XDR for the wallet to sign
   */
  async prepareTransactionForSigning(params: {
    fromPublicKey: string;
    toPublicKey: string;
    amount: string;
    assetCode?: string;
    assetIssuer?: string;
    memo?: string;
  }): Promise<{ xdr: string; network: string }> {
    const { fromPublicKey, toPublicKey, amount, assetCode, assetIssuer, memo } = params;

    if (!this.validatePublicKey(fromPublicKey)) {
      throw new BadRequestException('Invalid source public key');
    }

    if (!this.validatePublicKey(toPublicKey)) {
      throw new BadRequestException('Invalid destination public key');
    }

    // Note: We cannot sign server-side without the secret key
    // This method prepares the transaction for client-side signing
    // In a real implementation, you would use the Stellar SDK to build the transaction
    // and return the unsigned XDR for the wallet to sign
    
    const networkInfo = this.stellarService.getNetworkInfo();
    
    // For now, return a placeholder - in production, build the actual transaction
    return {
      xdr: 'PLACEHOLDER_UNSIGNED_XDR',
      network: networkInfo.network,
    };
  }

  /**
   * Submit a signed transaction from wallet
   */
  async submitSignedTransaction(signedXdr: string): Promise<any> {
    try {
      const result = await this.stellarService.submitTransaction(signedXdr);
      return result;
    } catch (error) {
      this.logger.error('Failed to submit signed transaction:', error);
      throw new BadRequestException('Transaction submission failed');
    }
  }

  /**
   * Get account info for wallet display
   */
  async getWalletInfo(publicKey: string): Promise<any> {
    if (!this.validatePublicKey(publicKey)) {
      throw new BadRequestException('Invalid Stellar public key');
    }

    const account = await this.stellarService.getAccount(publicKey);
    if (!account) {
      throw new BadRequestException('Account not found');
    }

    const balances = await this.stellarService.getBalances(publicKey);
    const networkInfo = this.stellarService.getNetworkInfo();

    return {
      publicKey,
      network: networkInfo.network,
      balances: balances.map((balance: any) => ({
        assetType: balance.asset_type,
        assetCode: balance.asset_code,
        assetIssuer: balance.asset_issuer,
        balance: balance.balance,
        limit: balance.limit,
      })),
      sequence: account.sequence,
      threshold: {
        low: account.thresholds.low_threshold,
        medium: account.thresholds.med_threshold,
        high: account.thresholds.high_threshold,
      },
      signers: account.signers,
      flags: {
        authRequired: account.flags.auth_required,
        authRevocable: account.flags.auth_revocable,
        authImmutable: account.flags.auth_immutable,
      },
    };
  }

  /**
   * Check if account requires funding (new account)
   */
  async requiresFunding(publicKey: string): Promise<boolean> {
    const account = await this.stellarService.getAccount(publicKey);
    return account === null;
  }

  /**
   * Get supported assets for the wallet
   */
  async getSupportedAssets(): Promise<any[]> {
    // Return common Stellar assets
    const commonAssets = [
      {
        code: 'XLM',
        issuer: 'native',
        type: 'native',
        name: 'Lumen',
        image: 'https://stellar.expert/img/assets/XLM.png',
      },
      {
        code: 'USDC',
        issuer: 'GA5ZSEJYB37JRC5AVCY5EM7QG4GP536E5URKZ3XL5LBEWPN4KCTM6E7S',
        type: 'credit_alphanum4',
        name: 'USD Circle',
        image: 'https://stellar.expert/img/assets/USDC-GA5ZSEJYB37JRC5AVCY5EM7QG4GP536E5URKZ3XL5LBEWPN4KCTM6E7S.png',
      },
      {
        code: 'USDT',
        issuer: 'GCHC6PGBDLEU7MNTSZ7PT4YWENTBXMMJQFXDE4J2E2GBJQDHBVVB3Y7U',
        type: 'credit_alphanum4',
        name: 'Tether USD',
        image: 'https://stellar.expert/img/assets/USDT-GCHC6PGBDLEU7MNTSZ7PT4YWENTBXMMJQFXDE4J2E2GBJQDHBVVB3Y7U.png',
      },
      {
        code: 'EURT',
        issuer: 'GAP5LETOV6YIEVY4BQJ6BJMRX4GIW4Q7LPT6QGDV7XRZAIWJ6KCHB4UT',
        type: 'credit_alphanum4',
        name: 'Tether EUR',
        image: 'https://stellar.expert/img/assets/EURT-GAP5LETOV6YIEVY4BQJ6BJMRX4GIW4Q7LPT6QGDV7XRZAIWJ6KCHB4UT.png',
      },
    ];

    return commonAssets;
  }

  /**
   * Create trustline for a custom asset
   */
  async createTrustlineTransaction(params: {
    publicKey: string;
    assetCode: string;
    assetIssuer: string;
    limit?: string;
  }): Promise<{ xdr: string; network: string }> {
    const { publicKey, assetCode, assetIssuer, limit } = params;

    if (!this.validatePublicKey(publicKey)) {
      throw new BadRequestException('Invalid public key');
    }

    if (!this.validatePublicKey(assetIssuer)) {
      throw new BadRequestException('Invalid asset issuer');
    }

    const networkInfo = this.stellarService.getNetworkInfo();

    // In production, build the actual change trust operation
    // For now, return placeholder
    return {
      xdr: 'PLACEHOLDER_TRUSTLINE_XDR',
      network: networkInfo.network,
    };
  }

  /**
   * Get transaction fee estimate
   */
  async getFeeEstimate(): Promise<{ baseFee: string; networkFee: string }> {
    // Base fee is 100 stroops (0.00001 XLM)
    return {
      baseFee: '100',
      networkFee: '100',
    };
  }

  /**
   * Get network minimum balance
   */
  async getMinimumBalance(): Promise<{ baseReserve: string; minimumBalance: string }> {
    // Base reserve is 2 XLM, plus 0.5 XLM per subentry
    return {
      baseReserve: '2',
      minimumBalance: '2',
    };
  }
}
