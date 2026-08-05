import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { NFT, WalletAddress } from '../common/types';
import { StellarService } from '../stellar/stellar.service';

@Injectable()
export class NftsService {
  private readonly logger = new Logger(NftsService.name);

  constructor(private readonly stellarService: StellarService) {}

  async getNFTsForUser(walletAddresses: WalletAddress[]): Promise<NFT[]> {
    const nfts: NFT[] = [];

    const ethereumAddresses = walletAddresses.filter(w => w.chain === 'ethereum');
    for (const wallet of ethereumAddresses) {
      const ethNfts = await this.fetchEthereumNFTs(wallet.address);
      nfts.push(...ethNfts);
    }

    const stellarAddresses = walletAddresses.filter(w => w.chain === 'stellar');
    for (const wallet of stellarAddresses) {
      const stellarNfts = await this.fetchStellarNFTs(wallet.address);
      nfts.push(...stellarNfts);
    }

    return nfts;
  }

  private async fetchEthereumNFTs(address: string): Promise<NFT[]> {
    try {
      const response = await axios.get(`https://api.opensea.io/api/v2/chain/ethereum/account/${address}/nfts`, {
        headers: {
          'X-API-KEY': process.env.OPENSEA_API_KEY || '',
        },
      });
      return (response.data?.nfts || []).map((nft: any) => ({
        id: `${nft.identifier}-${nft.contract}`,
        chain: 'ethereum',
        name: nft.name || 'Unknown NFT',
        collectionName: nft.collection?.name,
        imageUrl: nft.image_url,
        tokenId: nft.identifier,
        contractAddress: nft.contract,
      }));
    } catch (error) {
      this.logger.error('Error fetching Ethereum NFTs:', error);
      return [];
    }
  }

  private async fetchStellarNFTs(address: string): Promise<NFT[]> {
    try {
      const balances = await this.stellarService.getBalances(address);
      const nfts: NFT[] = [];

      for (const balance of balances) {
        // Check if it's a custom asset (not native XLM)
        if (balance.asset_type === 'credit_alphanum4' || balance.asset_type === 'credit_alphanum12') {
          const assetCode = balance.asset_code;
          const assetIssuer = balance.asset_issuer;
          const balanceAmount = parseFloat(balance.balance);
          
          // Consider assets with balance of 1 as NFTs (common practice)
          // Also check if the asset code suggests it's an NFT
          const isNFT = balanceAmount === 1 || 
                        assetCode?.toLowerCase().includes('nft') ||
                        assetCode?.toLowerCase().includes('token');
          
          if (isNFT) {
            // Try to get asset metadata from Stellar Expert
            const metadata = await this.stellarService.getAssetMetadata(assetCode, assetIssuer);
            
            nfts.push({
              id: `${assetCode}-${assetIssuer}`,
              chain: 'stellar',
              name: metadata?.name || assetCode,
              collectionName: metadata?.domain || assetIssuer.slice(0, 8) + '...',
              imageUrl: metadata?.image || `https://stellar.expert/explorer/public/asset/${assetCode}-${assetIssuer}.png`,
              assetCode,
              assetIssuer,
            });
          }
        }
      }

      return nfts;
    } catch (error) {
      this.logger.error(`Error fetching Stellar NFTs for ${address}:`, error);
      return [];
    }
  }

  /**
   * Get detailed information about a specific Stellar NFT
   */
  async getStellarNFTDetails(assetCode: string, assetIssuer: string): Promise<any> {
    try {
      const metadata = await this.stellarService.getAssetMetadata(assetCode, assetIssuer);
      return {
        assetCode,
        assetIssuer,
        name: metadata?.name || assetCode,
        description: metadata?.desc,
        domain: metadata?.domain,
        image: metadata?.image,
        toml: metadata?.toml,
        verified: metadata?.verified || false,
      };
    } catch (error) {
      this.logger.error(`Error fetching NFT details for ${assetCode}-${assetIssuer}:`, error);
      return null;
    }
  }
}
