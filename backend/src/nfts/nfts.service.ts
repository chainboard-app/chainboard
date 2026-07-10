import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { NFT, WalletAddress } from '../common/types';

@Injectable()
export class NftsService {
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
      console.error('Error fetching Ethereum NFTs:', error);
      return [];
    }
  }

  private async fetchStellarNFTs(address: string): Promise<NFT[]> {
    try {
      const response = await axios.get(`https://horizon.stellar.org/accounts/${address}/balances`);
      const balances = response.data._embedded?.records || [];
      const nfts: NFT[] = [];

      for (const balance of balances) {
        if (balance.asset_type === 'credit_alphanum4' || balance.asset_type === 'credit_alphanum12') {
          const assetCode = balance.asset_code;
          const assetIssuer = balance.asset_issuer;
          
          if (parseInt(balance.balance, 10) === 1) {
            nfts.push({
              id: `${assetCode}-${assetIssuer}`,
              chain: 'stellar',
              name: assetCode,
              collectionName: assetIssuer.slice(0, 8) + '...',
              imageUrl: `https://stellar.expert/explorer/public/asset/${assetCode}-${assetIssuer}.png`,
              assetCode,
              assetIssuer,
            });
          }
        }
      }

      return nfts;
    } catch (error) {
      console.error('Error fetching Stellar NFTs:', error);
      return [];
    }
  }
}
