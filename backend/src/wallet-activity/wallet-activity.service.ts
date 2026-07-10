import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { WalletActivityItem, WalletAddress, Chain } from '../common/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Tip } from '../tips/entities/tip.entity';

@Injectable()
export class WalletActivityService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Tip)
    private tipRepository: Repository<Tip>,
  ) {}

  async getWalletActivity(userId: string): Promise<WalletActivityItem[]> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      return [];
    }

    const activities: WalletActivityItem[] = [];

    // Get local tip activity
    const tips = await this.tipRepository.find({
      where: [{ senderId: userId }, { receiverId: userId }],
      relations: ['sender', 'receiver'],
    });
    tips.forEach((tip) => {
      activities.push({
        id: tip.id,
        type: 'tip',
        chain: tip.chain,
        amount: Number(tip.amount),
        fromAddress: user.walletAddresses.find((wa) => wa.chain === tip.chain)?.address,
        toAddress: user.walletAddresses.find((wa) => wa.chain === tip.chain)?.address,
        txHash: tip.id,
        timestamp: tip.createdAt,
        description: `Tip from ${tip.sender.displayName} to ${tip.receiver.displayName}`,
      });
    });

    // Get Stellar activity
    for (const wallet of user.walletAddresses.filter((wa) => wa.chain === 'stellar')) {
      const stellarActivities = await this.fetchStellarActivity(wallet.address);
      activities.push(...stellarActivities);
    }

    // Get Ethereum activity
    for (const wallet of user.walletAddresses.filter((wa) => wa.chain === 'ethereum')) {
      const ethereumActivities = await this.fetchEthereumActivity(wallet.address);
      activities.push(...ethereumActivities);
    }

    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  private async fetchStellarActivity(address: string): Promise<WalletActivityItem[]> {
    try {
      const response = await axios.get(
        `https://horizon.stellar.org/accounts/${address}/operations?limit=20&order=desc`,
      );
      const operations = response.data._embedded?.records || [];
      return operations.map((op: any) => ({
        id: op.id,
        type: op.type === 'payment' ? 'stellar_payment' : 'stellar_contract',
        chain: 'stellar',
        amount: op.amount ? Number(op.amount) : undefined,
        fromAddress: op.from,
        toAddress: op.to,
        assetCode: op.asset_code,
        assetIssuer: op.asset_issuer,
        txHash: op.transaction_hash,
        timestamp: new Date(op.created_at),
        description: op.type,
      }));
    } catch (error) {
      console.error('Error fetching Stellar activity:', error);
      return [];
    }
  }

  private async fetchEthereumActivity(address: string): Promise<WalletActivityItem[]> {
    try {
      // For demo purposes, using a mock API - in production use Alchemy/Etherscan
      const response = await axios.get(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=YourApiKeyToken`,
      );
      const transactions = response.data.result || [];
      return transactions.slice(0, 20).map((tx: any) => ({
        id: tx.hash,
        type: 'ethereum_transfer',
        chain: 'ethereum',
        amount: Number(tx.value) / 1e18,
        fromAddress: tx.from,
        toAddress: tx.to,
        txHash: tx.hash,
        timestamp: new Date(Number(tx.timeStamp) * 1000),
        description: 'Ethereum transfer',
      }));
    } catch (error) {
      console.error('Error fetching Ethereum activity:', error);
      return [];
    }
  }
}
