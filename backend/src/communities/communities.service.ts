import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Community } from './entities/community.entity';
import { Chain } from '../common/types';

@Injectable()
export class CommunitiesService {
  constructor(
    @InjectRepository(Community)
    private communitiesRepository: Repository<Community>,
  ) {}

  async findAll(): Promise<Community[]> {
    return this.communitiesRepository.find();
  }

  async findOne(id: string): Promise<Community | null> {
    return this.communitiesRepository.findOneBy({ id });
  }

  async checkAccess(
    community: Community,
    walletAddress: string,
    chain: Chain,
  ): Promise<boolean> {
    if (chain !== community.chain) {
      return false;
    }

    if (community.chain === 'stellar') {
      return this.checkStellarOwnership(community, walletAddress);
    } else if (community.chain === 'ethereum' || community.chain === 'base') {
      return this.checkEthereumOwnership(community, walletAddress);
    }
    return false;
  }

  private async checkStellarOwnership(
    community: Community,
    walletAddress: string,
  ): Promise<boolean> {
    try {
      const horizonUrl = 'https://horizon-testnet.stellar.org';
      const response = await fetch(
        `${horizonUrl}/accounts/${walletAddress}/balances`,
      );
      const data = await response.json();
      const balance = data._embedded?.records?.find(
        (b: any) => b.asset_code === community.contractAddress,
      )?.balance;
      return Number(balance || 0) >= Number(community.minBalance);
    } catch (e) {
      console.error('Stellar ownership check failed:', e);
      return false;
    }
  }

  private async checkEthereumOwnership(
    community: Community,
    walletAddress: string,
  ): Promise<boolean> {
    try {
      const rpcUrl = community.chain === 'base' 
        ? 'https://mainnet.base.org' 
        : 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY';
      
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_call',
          params: [
            {
              to: community.contractAddress,
              data: `0x70a08231000000000000000000000000${walletAddress.slice(2)}`,
            },
            'latest',
          ],
        }),
      });
      const data = await response.json();
      const balance = data.result ? BigInt(data.result) : 0n;
      return balance >= BigInt(community.minBalance);
    } catch (e) {
      console.error('Ethereum ownership check failed:', e);
      return false;
    }
  }
}
