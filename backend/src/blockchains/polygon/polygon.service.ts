/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class PolygonService {
  private readonly logger = new Logger(PolygonService.name);
  private readonly provider: ethers.JsonRpcProvider;
  private readonly network: string;

  constructor(private readonly configService: ConfigService) {
    this.network = this.configService.get('POLYGON_NETWORK') || 'amoy';
    const rpcUrl = this.configService.get('POLYGON_RPC_URL') || 'https://rpc-amoy.polygon.technology';
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  async createWallet(): Promise<{ address: string; privateKey: string }> {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
    };
  }

  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      this.logger.error(`Failed to get balance for ${address}`, error);
      throw error;
    }
  }

  async getTransactionCount(address: string): Promise<number> {
    try {
      return await this.provider.getTransactionCount(address);
    } catch (error) {
      this.logger.error(`Failed to get transaction count for ${address}`, error);
      throw error;
    }
  }

  async createTransferTransaction(
    fromPrivateKey: string,
    toAddress: string,
    amount: string,
  ): Promise<string> {
    try {
      const wallet = new ethers.Wallet(fromPrivateKey, this.provider);
      const tx = await wallet.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(amount),
      });
      return tx.hash;
    } catch (error) {
      this.logger.error('Failed to create transfer transaction', error);
      throw error;
    }
  }

  async getTransaction(txHash: string): Promise<any> {
    try {
      const tx = await this.provider.getTransaction(txHash);
      if (!tx) return null;
      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: ethers.formatEther(tx.value),
        blockNumber: tx.blockNumber,
        confirmations: tx.confirmations,
      };
    } catch (error) {
      this.logger.error(`Failed to get transaction ${txHash}`, error);
      throw error;
    }
  }

  async estimateGas(fromAddress: string, toAddress: string, amount: string): Promise<string> {
    try {
      const gasEstimate = await this.provider.estimateGas({
        from: fromAddress,
        to: toAddress,
        value: ethers.parseEther(amount),
      });
      return gasEstimate.toString();
    } catch (error) {
      this.logger.error('Failed to estimate gas', error);
      throw error;
    }
  }

  async getGasPrice(): Promise<string> {
    try {
      const feeData = await this.provider.getFeeData();
      return feeData.gasPrice ? feeData.gasPrice.toString() : '0';
    } catch (error) {
      this.logger.error('Failed to get gas price', error);
      throw error;
    }
  }

  getNetworkInfo(): any {
    return {
      network: this.network,
      chainId: this.network === 'mainnet' ? 137 : 80002,
      rpcUrl: this.provider._getConnection().url,
    };
  }
}
