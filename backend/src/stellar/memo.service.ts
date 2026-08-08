/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as StellarSdk from '@stellar/stellar-sdk';

export enum MemoType {
  NONE = 'none',
  TEXT = 'text',
  ID = 'id',
  HASH = 'hash',
  RETURN = 'return',
}

export interface Memo {
  type: MemoType;
  value: string;
}

@Injectable()
export class MemoService {
  private readonly logger = new Logger(MemoService.name);

  /**
   * Parse a memo according to SEP-0005 standard
   */
  parseMemo(memo: string, type: MemoType = MemoType.TEXT): Memo {
    if (!memo) {
      return { type: MemoType.NONE, value: '' };
    }

    switch (type) {
      case MemoType.TEXT:
        if (memo.length > 28) {
          throw new BadRequestException(
            'Text memo must be 28 characters or less',
          );
        }
        // Text memos should be ASCII printable
        if (!/^[\x20-\x7E]*$/.test(memo)) {
          throw new BadRequestException(
            'Text memo must contain only ASCII printable characters',
          );
        }
        return { type: MemoType.TEXT, value: memo };

      case MemoType.ID: {
        if (!/^\d+$/.test(memo)) {
          throw new BadRequestException('ID memo must contain only digits');
        }
        const idValue = BigInt(memo);
        if (idValue > 18446744073709551615n) {
          throw new BadRequestException('ID memo must be less than 2^64');
        }
        return { type: MemoType.ID, value: memo };
      }

      case MemoType.HASH: {
        if (memo.length !== 64) {
          throw new BadRequestException(
            'Hash memo must be exactly 64 hex characters',
          );
        }
        if (!/^[0-9a-fA-F]{64}$/.test(memo)) {
          throw new BadRequestException('Hash memo must be valid hex');
        }
        return { type: MemoType.HASH, value: memo };
      }

      case MemoType.RETURN: {
        if (memo.length !== 64) {
          throw new BadRequestException(
            'Return memo must be exactly 64 hex characters',
          );
        }
        if (!/^[0-9a-fA-F]{64}$/.test(memo)) {
          throw new BadRequestException('Return memo must be valid hex');
        }
        return { type: MemoType.RETURN, value: memo };
      }

      default:
        return { type: MemoType.NONE, value: '' };
    }
  }

  /**
   * Create a Stellar SDK Memo object
   */
  createStellarMemo(memo: Memo): StellarSdk.Memo {
    switch (memo.type) {
      case MemoType.TEXT:
        return StellarSdk.Memo.text(memo.value);
      case MemoType.ID:
        return StellarSdk.Memo.id(BigInt(memo.value).toString());
      case MemoType.HASH:
        return StellarSdk.Memo.hash(memo.value);
      case MemoType.RETURN:
        return StellarSdk.Memo.return(memo.value);
      case MemoType.NONE:
      default:
        return StellarSdk.Memo.none();
    }
  }

  /**
   * Extract memo from a Stellar transaction
   */

  extractMemoFromTransaction(transactionXdr: string): Memo | null {
    try {
      const transaction = StellarSdk.TransactionBuilder.fromXDR(
        transactionXdr,
        StellarSdk.Networks.TESTNET,
      );

      // Check if it's a regular transaction (not fee bump)

      if ('memo' in transaction) {
        const memo = (transaction as any).memo;
        if (!memo) {
          return null;
        }

        // Check memo type based on the value

        if (memo._type === StellarSdk.xdr.MemoType.memoText()) {
          return { type: MemoType.TEXT, value: memo._value.toString('utf8') };
        } else if (memo._type === StellarSdk.xdr.MemoType.memoId()) {
          return { type: MemoType.ID, value: memo._value.toString() };
        } else if (memo._type === StellarSdk.xdr.MemoType.memoHash()) {
          return { type: MemoType.HASH, value: memo._value.toString('hex') };
        } else if (memo._type === StellarSdk.xdr.MemoType.memoReturn()) {
          return { type: MemoType.RETURN, value: memo._value.toString('hex') };
        }
      }

      return null;
    } catch (error) {
      this.logger.error('Failed to extract memo from transaction:', error);
      return null;
    }
  }

  /**
   * Generate a unique memo for a transaction
   */
  generateMemo(type: MemoType = MemoType.ID): string {
    switch (type) {
      case MemoType.ID: {
        // Generate a random 64-bit unsigned integer
        const randomId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        return randomId.toString();
      }

      case MemoType.HASH:
      case MemoType.RETURN: {
        // Generate a random 32-byte hash
        const randomBytes = Buffer.from(
          Array.from({ length: 32 }, () => Math.floor(Math.random() * 256)),
        );
        return randomBytes.toString('hex');
      }

      case MemoType.TEXT: {
        // Generate a random alphanumeric string
        const chars =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 28; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      }

      default:
        return '';
    }
  }

  /**
   * Validate memo format
   */
  validateMemo(memo: string, type: MemoType): boolean {
    try {
      this.parseMemo(memo, type);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Convert memo to display format
   */
  memoToDisplay(memo: Memo): string {
    switch (memo.type) {
      case MemoType.TEXT:
        return `Text: ${memo.value}`;
      case MemoType.ID:
        return `ID: ${memo.value}`;
      case MemoType.HASH:
        return `Hash: ${memo.value.slice(0, 8)}...${memo.value.slice(-8)}`;
      case MemoType.RETURN:
        return `Return: ${memo.value.slice(0, 8)}...${memo.value.slice(-8)}`;
      default:
        return 'No memo';
    }
  }

  /**
   * Encode memo for URL (for payment links)
   */
  encodeMemoForUrl(memo: Memo): string {
    switch (memo.type) {
      case MemoType.TEXT:
        return `memo=${encodeURIComponent(memo.value)}&memo_type=text`;
      case MemoType.ID:
        return `memo=${encodeURIComponent(memo.value)}&memo_type=id`;
      case MemoType.HASH:
        return `memo=${encodeURIComponent(memo.value)}&memo_type=hash`;
      case MemoType.RETURN:
        return `memo=${encodeURIComponent(memo.value)}&memo_type=return`;
      default:
        return '';
    }
  }

  /**
   * Decode memo from URL parameters
   */
  decodeMemoFromUrl(params: { memo?: string; memo_type?: string }): Memo {
    if (!params.memo) {
      return { type: MemoType.NONE, value: '' };
    }

    const type = params.memo_type || MemoType.TEXT;
    return this.parseMemo(params.memo, type as MemoType);
  }
}
