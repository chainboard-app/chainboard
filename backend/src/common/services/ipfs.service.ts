/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IpfsService {
  private readonly logger = new Logger(IpfsService.name);
  private readonly gateway: string;
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.gateway = this.configService.get('IPFS_GATEWAY') || 'https://ipfs.io';
    this.apiKey = this.configService.get('IPFS_API_KEY') || '';
  }

  async uploadFile(file: Buffer, filename: string): Promise<string> {
    try {
      // Placeholder for IPFS upload
      // In production, use Pinata, Web3.Storage, or IPFS HTTP client
      this.logger.log(`Uploading file ${filename} to IPFS`);

      // Example with Pinata:
      // const FormData = require('form-data');
      // const form = new FormData();
      // form.append('file', file, filename);
      // const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', form, {
      //   headers: {
      //     'Authorization': `Bearer ${this.apiKey}`,
      //     ...form.getHeaders(),
      //   },
      // });
      // return `ipfs://${response.data.IpfsHash}`;

      return 'ipfs://QmExampleHash';
    } catch (error) {
      this.logger.error('Failed to upload file to IPFS', error);
      throw error;
    }
  }

  async uploadJSON(data: any): Promise<string> {
    try {
      this.logger.log('Uploading JSON to IPFS');

      // Placeholder for JSON upload
      // const response = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', data, {
      //   headers: {
      //     'Authorization': `Bearer ${this.apiKey}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      // return `ipfs://${response.data.IpfsHash}`;

      return 'ipfs://QmExampleJSONHash';
    } catch (error) {
      this.logger.error('Failed to upload JSON to IPFS', error);
      throw error;
    }
  }

  async getFromIPFS(cid: string): Promise<any> {
    try {
      const url = `${this.gateway}/ipfs/${cid.replace('ipfs://', '')}`;
      // const response = await axios.get(url);
      // return response.data;
      return null;
    } catch (error) {
      this.logger.error(`Failed to fetch from IPFS: ${cid}`, error);
      throw error;
    }
  }

  getGatewayUrl(cid: string): string {
    return `${this.gateway}/ipfs/${cid.replace('ipfs://', '')}`;
  }

  async pin(cid: string): Promise<void> {
    try {
      this.logger.log(`Pinning CID ${cid}`);
      // Placeholder for pinning service
    } catch (error) {
      this.logger.error(`Failed to pin CID ${cid}`, error);
      throw error;
    }
  }

  async unpin(cid: string): Promise<void> {
    try {
      this.logger.log(`Unpinning CID ${cid}`);
      // Placeholder for unpinning service
    } catch (error) {
      this.logger.error(`Failed to unpin CID ${cid}`, error);
      throw error;
    }
  }
}
