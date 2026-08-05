import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StellarService } from './stellar.service';

@ApiTags('stellar')
@Controller('stellar')
export class StellarController {
  constructor(private readonly stellarService: StellarService) {}

  @Post('keypair')
  @ApiOperation({ summary: 'Generate a new Stellar keypair' })
  @ApiResponse({ status: 200, description: 'Returns public and secret key' })
  createKeypair() {
    return this.stellarService.createKeypair();
  }

  @Post('fund/:publicKey')
  @ApiOperation({ summary: 'Fund a testnet account using friendbot' })
  @ApiResponse({ status: 200, description: 'Account funded successfully' })
  async fundAccount(@Param('publicKey') publicKey: string) {
    const success = await this.stellarService.fundTestnetAccount(publicKey);
    return { success };
  }

  @Get('account/:publicKey')
  @ApiOperation({ summary: 'Get account information' })
  @ApiResponse({ status: 200, description: 'Account details' })
  async getAccount(@Param('publicKey') publicKey: string) {
    return this.stellarService.getAccount(publicKey);
  }

  @Get('account/:publicKey/balances')
  @ApiOperation({ summary: 'Get account balances' })
  @ApiResponse({ status: 200, description: 'Account balances' })
  async getBalances(@Param('publicKey') publicKey: string) {
    return this.stellarService.getBalances(publicKey);
  }

  @Post('payment')
  @ApiOperation({ summary: 'Create a payment transaction' })
  @ApiResponse({ status: 200, description: 'Returns signed transaction XDR' })
  async createPayment(@Body() body: {
    fromSecret: string;
    toPublicKey: string;
    amount: string;
    assetCode?: string;
    assetIssuer?: string;
  }) {
    const xdr = await this.stellarService.createPaymentTransaction(body);
    return { xdr };
  }

  @Post('transaction/submit')
  @ApiOperation({ summary: 'Submit a signed transaction' })
  @ApiResponse({ status: 200, description: 'Transaction result' })
  async submitTransaction(@Body() body: { xdr: string }) {
    return this.stellarService.submitTransaction(body.xdr);
  }

  @Get('account/:publicKey/transactions')
  @ApiOperation({ summary: 'Get transaction history' })
  @ApiResponse({ status: 200, description: 'Transaction history' })
  async getTransactions(
    @Param('publicKey') publicKey: string,
    @Query('limit') limit?: string,
  ) {
    return this.stellarService.getTransactionHistory(
      publicKey,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get('federation/:address')
  @ApiOperation({ summary: 'Resolve a Stellar Federation address' })
  @ApiResponse({ status: 200, description: 'Resolved account ID' })
  async resolveFederation(@Param('address') address: string) {
    const accountId = await this.stellarService.resolveFederationAddress(address);
    return { accountId };
  }

  @Get('asset/:code/:issuer')
  @ApiOperation({ summary: 'Get asset metadata' })
  @ApiResponse({ status: 200, description: 'Asset metadata' })
  async getAssetMetadata(
    @Param('code') code: string,
    @Param('issuer') issuer: string,
  ) {
    return this.stellarService.getAssetMetadata(code, issuer);
  }

  @Get('network')
  @ApiOperation({ summary: 'Get network information' })
  @ApiResponse({ status: 200, description: 'Network details' })
  getNetworkInfo() {
    return this.stellarService.getNetworkInfo();
  }

  @Post('contract/deploy')
  @ApiOperation({ summary: 'Deploy a Soroban contract' })
  @ApiResponse({ status: 200, description: 'Contract deployment result' })
  async deployContract(@Body() body: {
    sourceSecret: string;
    wasm: string; // Base64 encoded WASM
  }) {
    const wasm = Buffer.from(body.wasm, 'base64');
    return this.stellarService.deployContract(body.sourceSecret, wasm);
  }

  @Post('contract/invoke')
  @ApiOperation({ summary: 'Invoke a Soroban contract method' })
  @ApiResponse({ status: 200, description: 'Contract invocation result' })
  async invokeContract(@Body() body: {
    contractId: string;
    method: string;
    args: any[];
    sourceSecret?: string;
  }) {
    return this.stellarService.invokeContract(
      body.contractId,
      body.method,
      body.args,
      body.sourceSecret,
    );
  }
}
