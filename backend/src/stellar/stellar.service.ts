/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-enum-comparison */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as StellarSdk from '@stellar/stellar-sdk';

@Injectable()
export class StellarService {
  private readonly logger = new Logger(StellarService.name);
  private server: StellarSdk.Horizon.Server;
  private sorobanRpc: StellarSdk.SorobanRpc.Server;

  private network: any;
  private networkPassphrase: string;

  constructor(private configService: ConfigService) {
    this.initializeStellar();
  }

  private initializeStellar() {
    const stellarNetwork = this.configService.get<string>(
      'STELLAR_NETWORK',
      'testnet',
    );
    const rpcUrl = this.configService.get<string>(
      'STELLAR_RPC_URL',
      'https://soroban-testnet.stellar.org',
    );
    const horizonUrl = this.configService.get<string>(
      'STELLAR_HORIZON_URL',
      'https://horizon-testnet.stellar.org',
    );

    if (stellarNetwork === 'mainnet') {
      this.server = new StellarSdk.Horizon.Server(
        'https://horizon.stellar.org',
      );
      this.network = StellarSdk.Networks.PUBLIC;
      this.networkPassphrase = StellarSdk.Networks.PUBLIC;
    } else {
      this.server = new StellarSdk.Horizon.Server(horizonUrl);
      this.network = StellarSdk.Networks.TESTNET;
      this.networkPassphrase = StellarSdk.Networks.TESTNET;
    }

    this.sorobanRpc = new StellarSdk.SorobanRpc.Server(rpcUrl);
    this.logger.log(`Initialized Stellar ${stellarNetwork} connection`);
  }

  /**
   * Create a new Stellar account keypair
   */
  createKeypair(): { publicKey: string; secretKey: string } {
    const keypair = StellarSdk.Keypair.random();
    return {
      publicKey: keypair.publicKey(),
      secretKey: keypair.secret(),
    };
  }

  /**
   * Fund a testnet account using friendbot
   */
  async fundTestnetAccount(publicKey: string): Promise<boolean> {
    if (this.networkPassphrase !== StellarSdk.Networks.TESTNET) {
      throw new Error('Friendbot only available on testnet');
    }

    try {
      const response = await fetch(
        `https://friendbot.stellar.org?addr=${publicKey}`,
      );
      if (response.ok) {
        this.logger.log(`Successfully funded account ${publicKey}`);
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(`Failed to fund account ${publicKey}:`, error);
      return false;
    }
  }

  /**
   * Get account information
   */

  async getAccount(publicKey: string): Promise<any> {
    try {
      const account = await this.server.loadAccount(publicKey);
      return account;
    } catch (error) {
      if (error.status === 404) {
        this.logger.warn(`Account ${publicKey} not found`);
        return null;
      }
      this.logger.error(`Error fetching account ${publicKey}:`, error);
      throw error;
    }
  }

  /**
   * Get account balances
   */

  async getBalances(publicKey: string): Promise<any[]> {
    const account = await this.getAccount(publicKey);
    if (!account) {
      return [];
    }
    return account.balances;
  }

  /**
   * Create and sign a payment transaction
   */
  async createPaymentTransaction(params: {
    fromSecret: string;
    toPublicKey: string;
    amount: string;
    assetCode?: string;
    assetIssuer?: string;
  }): Promise<string> {
    const { fromSecret, toPublicKey, amount, assetCode, assetIssuer } = params;

    const sourceKeypair = StellarSdk.Keypair.fromSecret(fromSecret);
    const sourceAccount = await this.server.loadAccount(
      sourceKeypair.publicKey(),
    );

    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: this.networkPassphrase,
    });

    let asset: StellarSdk.Asset;
    if (assetCode && assetIssuer) {
      asset = new StellarSdk.Asset(assetCode, assetIssuer);
    } else {
      asset = StellarSdk.Asset.native();
    }

    transaction.addOperation(
      StellarSdk.Operation.payment({
        destination: toPublicKey,
        asset,
        amount,
      }),
    );

    const builtTx = transaction.setTimeout(30).build();
    builtTx.sign(sourceKeypair);

    return builtTx.toXDR();
  }

  /**
   * Submit a transaction to the network
   */

  async submitTransaction(xdr: string): Promise<any> {
    try {
      const transaction = StellarSdk.TransactionBuilder.fromXDR(
        xdr,
        this.networkPassphrase,
      );
      const result = await this.server.submitTransaction(transaction);
      this.logger.log(`Transaction submitted successfully: ${result.hash}`);
      return result;
    } catch (error) {
      this.logger.error('Transaction submission failed:', error);
      throw error;
    }
  }

  /**
   * Get transaction history for an account
   */
  async getTransactionHistory(
    publicKey: string,
    limit: number = 20,
  ): Promise<any[]> {
    try {
      const transactions = await this.server
        .transactions()
        .forAccount(publicKey)
        .limit(limit)
        .order('desc')
        .call();
      return transactions.records;
    } catch (error) {
      this.logger.error(`Error fetching transactions for ${publicKey}:`, error);
      return [];
    }
  }

  /**
   * Resolve Stellar Federation address (e.g., user*stellar.org)
   */
  async resolveFederationAddress(
    federationAddress: string,
  ): Promise<string | null> {
    try {
      const [name, domain] = federationAddress.split('*');
      const response = await fetch(
        `https://${domain}/.well-known/stellar.toml`,
      );

      if (!response.ok) {
        return null;
      }

      const stellarToml = await response.text();
      const federationUrlMatch = stellarToml.match(
        /FEDERATION_SERVER\s*=\s*"([^"]+)"/,
      );

      if (!federationUrlMatch) {
        return null;
      }

      const federationUrl = federationUrlMatch[1];
      const federationResponse = await fetch(
        `${federationUrl}?type=name&id=${name}&domain=${domain}`,
      );

      if (federationResponse.ok) {
        const data = await federationResponse.json();
        return data.account_id;
      }

      return null;
    } catch (error) {
      this.logger.error(
        `Error resolving federation address ${federationAddress}:`,
        error,
      );
      return null;
    }
  }

  /**
   * Create a custom asset
   */
  createCustomAsset(code: string, issuer: string): StellarSdk.Asset {
    if (code.length > 12 || code.length < 4) {
      throw new Error('Asset code must be between 4 and 12 characters');
    }
    return new StellarSdk.Asset(code, issuer);
  }

  /**
   * Get asset metadata from Stellar Expert
   */
  async getAssetMetadata(assetCode: string, assetIssuer: string): Promise<any> {
    try {
      const response = await fetch(
        `https://api.stellar.expert/v1/assets?asset_code=${assetCode}&asset_issuer=${assetIssuer}`,
      );
      if (response.ok) {
        const data = await response.json();
        return data._embedded.records[0];
      }
      return null;
    } catch (error) {
      this.logger.error(`Error fetching asset metadata:`, error);
      return null;
    }
  }

  /**
   * Soroban: Deploy a contract
   */

  async deployContract(
    sourceSecret: string,
    wasm: Buffer,
  ): Promise<{ contractId: string; transactionHash: string }> {
    try {
      const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecret);
      const sourceAccount = await this.server.loadAccount(
        sourceKeypair.publicKey(),
      );

      // Upload WASM

      const uploadTx = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })

        .addOperation(
          StellarSdk.Operation.invokeHostFunction({
            func: (StellarSdk.xdr.HostFunction as any).uploadContractWasm(wasm),
          }),
        )
        .setTimeout(30)
        .build();

      uploadTx.sign(sourceKeypair);
      const uploadResult = await this.server.submitTransaction(uploadTx);

      const wasmHash = (uploadResult as any).result_meta_xdr
        ?.v0()
        ?.sorobanData()
        ?.resources()?.[0]
        ?.wasm()
        ?.hash();

      if (!wasmHash) {
        throw new Error('Failed to get WASM hash from upload transaction');
      }

      // Create contract
      const createTx = new StellarSdk.TransactionBuilder(
        await this.server.loadAccount(sourceKeypair.publicKey()),
        {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: this.networkPassphrase,
        },
      )

        .addOperation(
          StellarSdk.Operation.invokeHostFunction({
            func: (StellarSdk.xdr.HostFunction as any).createContract(
              StellarSdk.Address.fromScAddress(
                StellarSdk.StrKey.decodeEd25519PublicKey(
                  sourceKeypair.publicKey(),
                ) as any,
              ),
              wasmHash,
            ),
          }),
        )
        .setTimeout(30)
        .build();

      createTx.sign(sourceKeypair);
      const createResult = await this.server.submitTransaction(createTx);

      const contractId = (createResult as any).result_meta_xdr
        ?.v0()
        ?.sorobanData()
        ?.resources()?.[0]
        ?.contract()
        ?.contractId();

      if (!contractId) {
        throw new Error('Failed to get contract ID from create transaction');
      }

      return {
        contractId: StellarSdk.StrKey.encodeContract(contractId),
        transactionHash: createResult.hash,
      };
    } catch (error) {
      this.logger.error('Contract deployment failed:', error);
      throw error;
    }
  }

  /**
   * Soroban: Invoke a contract method
   */

  async invokeContract(
    contractId: string,
    method: string,
    args: any[],
    sourceSecret?: string,
  ): Promise<any> {
    try {
      const contractAddress = StellarSdk.Address.contract(contractId as any);

      let transaction: StellarSdk.Transaction;

      if (sourceSecret) {
        const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecret);
        const sourceAccount = await this.server.loadAccount(
          sourceKeypair.publicKey(),
        );

        transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: this.networkPassphrase,
        })

          .addOperation(
            StellarSdk.Operation.invokeHostFunction({
              func: (StellarSdk.xdr.HostFunction as any).invokeContract({
                contractAddress: contractAddress.toScAddress(),
                functionName: method,

                args: args.map((arg) =>
                  (StellarSdk.xdr.ScVal as any).from(arg),
                ),
              }),
            }),
          )
          .setTimeout(30)
          .build();

        transaction.sign(sourceKeypair);
      } else {
        // Simulate transaction without signing
        const sourceAccount = await this.server.loadAccount(
          StellarSdk.Keypair.random().publicKey(),
        );

        transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: this.networkPassphrase,
        })

          .addOperation(
            StellarSdk.Operation.invokeHostFunction({
              func: (StellarSdk.xdr.HostFunction as any).invokeContract({
                contractAddress: contractAddress.toScAddress(),
                functionName: method,

                args: args.map((arg) =>
                  (StellarSdk.xdr.ScVal as any).from(arg),
                ),
              }),
            }),
          )
          .setTimeout(30)
          .build();
      }

      const result = await this.sorobanRpc.simulateTransaction(transaction);
      return result;
    } catch (error) {
      this.logger.error(`Contract invocation failed:`, error);
      throw error;
    }
  }

  /**
   * Get network information
   */

  getNetworkInfo(): { network: string; passphrase: string; rpcUrl: string } {
    return {
      network:
        this.networkPassphrase === StellarSdk.Networks.PUBLIC
          ? 'mainnet'
          : 'testnet',
      passphrase: this.networkPassphrase,

      rpcUrl: this.sorobanRpc.serverURL.toString(),
    };
  }
}
