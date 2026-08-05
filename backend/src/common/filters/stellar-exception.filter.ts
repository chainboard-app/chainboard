import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';

// Type guards for Stellar errors (will be replaced with actual SDK types after install)
interface StellarResponseError {
  status?: number;
  title?: string;
  detail?: string;
  extras?: {
    result_codes?: {
      transaction?: string;
      operations?: string[];
    };
  };
  stack?: string;
}

interface StellarNetworkError extends Error {
  message: string;
  stack?: string;
}

interface StellarBadRequestError extends Error {
  message: string;
  stack?: string;
}

interface StellarNotFoundError extends Error {
  message: string;
}

interface StellarBadResponseError extends Error {
  message: string;
  stack?: string;
}

@Catch()
export class StellarExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(StellarExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let message = 'Internal server error';
    let errorDetails: any = {};

    // Check if it's a Stellar Horizon ResponseError
    if (exception && typeof exception === 'object' && 'status' in exception) {
      const stellarError = exception as StellarResponseError;
      status = stellarError.status || 500;
      message = this.parseStellarError(stellarError);
      errorDetails = {
        type: 'StellarHorizonError',
        status: stellarError.status,
        title: stellarError.title,
        detail: stellarError.detail,
        extras: stellarError.extras,
      };
      this.logger.error(`Stellar Horizon Error: ${message}`, stellarError.stack);
    } else if (exception instanceof Error) {
      message = exception.message;
      errorDetails = {
        type: 'Error',
        message: exception.message,
      };
      this.logger.error(`Unexpected Error: ${exception.message}`, exception.stack);
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      errorDetails = exception.getResponse();
    }

    response.status(status).json({
      statusCode: status,
      message,
      errorDetails: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
      timestamp: new Date().toISOString(),
    });
  }

  private parseStellarError(error: StellarResponseError): string {
    const resultCodes = error.extras?.result_codes;
    
    if (resultCodes?.transaction) {
      const txCode = resultCodes.transaction;
      switch (txCode) {
        case 'tx_bad_seq':
          return 'Transaction sequence number is incorrect';
        case 'tx_insufficient_balance':
          return 'Insufficient balance to complete transaction';
        case 'tx_no_source_account':
          return 'Source account does not exist';
        case 'tx_internal_error':
          return 'Internal Stellar error occurred';
        case 'tx_failed':
          return 'Transaction failed during execution';
        default:
          return `Transaction error: ${txCode}`;
      }
    }

    if (resultCodes?.operations) {
      const opCode = resultCodes.operations[0];
      switch (opCode) {
        case 'op_no_destination':
          return 'Destination account does not exist';
        case 'op_no_trust':
          return 'Destination account does not trust the asset';
        case 'op_not_authorized':
          return 'Not authorized to perform this operation';
        case 'op_underfunded':
          return 'Insufficient funds to complete operation';
        case 'op_low_reserve':
          return 'Account would go below minimum reserve';
        case 'op_bad_auth':
          return 'Invalid signature';
        case 'op_src_no_trust':
          return 'Source account does not trust the asset';
        case 'op_no_issuer':
          return 'Asset issuer does not exist';
        case 'op_cross_self':
          return 'Cannot trade with self';
        case 'op_malformed':
          return 'Operation is malformed';
        default:
          return `Operation error: ${opCode}`;
      }
    }

    return error.detail || error.title || 'Unknown Stellar error';
  }
}
