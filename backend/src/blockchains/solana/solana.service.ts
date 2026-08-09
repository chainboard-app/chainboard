/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, PublicKey, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

@Injectable()
export class SolanaService {
  private readonly logger = new Logger(SolanaService.name);
  private readonly connection: Connection;
  private readonly network: string;

  constructor(private readonly configService: ConfigService) {
    this.network = this.configService.get('SOLANA_NETWORK') || 'devnet';
    const rpcUrl = this.configService.get('SOLANA_RPC_URL') || 'https://api.devnet.solana.com';
    this.connection = new Connection(rpcUrl, 'confirmed');
  }

  async createKeypair(): Promise<{ publicKey: string; secretKey: string }> {
    const keypair = Keypair.generate();
    return {
      publicKey: keypair.publicKey.toBase58(),
      secretKey: Buffer.from(keypair.secretKey).toString('base64'),
    };
  }

  async getBalance(publicKey: string): Promise<number> {
    try {
      const balance = await this.connection.getBalance(new PublicKey(publicKey));
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      this.logger.error(`Failed to get balance for ${publicKey}`, error);
      throw error;
    }
  }

  async getAccountInfo(publicKey: string): Promise<any> {
    try {
      const accountInfo = await this.connection.getAccountInfo(new PublicKey(publicKey));
      return {
        publicKey,
        balance: accountInfo ? accountInfo.lamports / LAMPORTS_PER_SOL : 0,
        owner: accountInfo?.owner.toBase58(),
        executable: accountInfo?.executable || false,
      };
    } catch (error) {
      this.logger.error(`Failed to get account info for ${publicKey}`, error);
      throw error;
    }
  }

  async requestAirdrop(publicKey: string, amount: number = 1): Promise<string> {
    try {
      const signature = await this.connection.requestAirdrop(
        new PublicKey(publicKey),
        amount * LAMPORTS_PER_SOL,
      );
      await this.connection.confirmTransaction(signature);
      return signature;
    } catch (error) {
      this.logger.error(`Failed to request airdrop for ${publicKey}`, error);
      throw error;
    }
  }

  async createTransferTransaction(
    fromSecret: string,
    toPublicKey: string,
    amount: number,
  ): Promise<string> {
    try {
      const secretKey = Buffer.from(fromSecret, 'base64');
      const fromKeypair = Keypair.fromSecretKey(secretKey);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromKeypair.publicKey,
          toPubkey: new PublicKey(toPublicKey),
          lamports: amount * LAMPORTS_PER_SOL,
        }),
      );

      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromKeypair.publicKey;

      const serialized = transaction.serialize({
        requireAllSignatures: false,
      });

      return serialized.toString('base64');
    } catch (error) {
      this.logger.error('Failed to create transfer transaction', error);
      throw error;
    }
  }

  async submitTransaction(signedTransaction: string): Promise<string> {
    try {
      const transaction = Transaction.from(
        Buffer.from(signedTransaction, 'base64'),
      );
      const signature = await this.connection.sendRawTransaction(
        transaction.serialize(),
      );
      await this.connection.confirmTransaction(signature);
      return signature;
    } catch (error) {
      this.logger.error('Failed to submit transaction', error);
      throw error;
    }
  }

  async getTransaction(signature: string): Promise<any> {
    try {
      const transaction = await this.connection.getTransaction(signature);
      return transaction;
    } catch (error) {
      this.logger.error(`Failed to get transaction ${signature}`, error);
      throw error;
    }
  }

  getNetworkInfo(): any {
    return {
      network: this.network,
      rpcUrl: this.connection.rpcEndpoint,
      version: this.connection.getVersion,
    };
  }
}
