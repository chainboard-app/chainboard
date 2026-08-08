/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsStellarPublicKey(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStellarPublicKey',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          // Stellar public keys start with 'G' and are 56 characters long (base32 encoded)
          const stellarPublicKeyRegex = /^G[A-Z0-9]{55}$/;
          return stellarPublicKeyRegex.test(value);
        },
        defaultMessage(_args: ValidationArguments) {
          return 'Must be a valid Stellar public key';
        },
      },
    });
  };
}

export function IsStellarSecretKey(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStellarSecretKey',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          // Stellar secret keys start with 'S' and are 56 characters long (base32 encoded)
          const stellarSecretKeyRegex = /^S[A-Z0-9]{55}$/;
          return stellarSecretKeyRegex.test(value);
        },
        defaultMessage(_args: ValidationArguments) {
          return 'Must be a valid Stellar secret key';
        },
      },
    });
  };
}

export function IsStellarAssetCode(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStellarAssetCode',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          // Asset codes are 1-12 alphanumeric characters
          const assetCodeRegex = /^[a-zA-Z0-9]{1,12}$/;
          return assetCodeRegex.test(value);
        },
        defaultMessage(_args: ValidationArguments) {
          return 'Must be a valid Stellar asset code (1-12 alphanumeric characters)';
        },
      },
    });
  };
}

export function IsStellarAssetIssuer(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStellarAssetIssuer',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          // Asset issuers are Stellar public keys
          const stellarPublicKeyRegex = /^G[A-Z0-9]{55}$/;
          return stellarPublicKeyRegex.test(value);
        },
        defaultMessage(_args: ValidationArguments) {
          return 'Must be a valid Stellar public key';
        },
      },
    });
  };
}

export function IsStellarMemo(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStellarMemo',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          // Memos can be text (up to 28 bytes), ID (64-bit unsigned), hash (32 bytes), or return (32 bytes)
          if (typeof value === 'string' && value.length <= 28) {
            return true; // Text memo
          }
          if (/^\d+$/.test(value) && BigInt(value) <= 18446744073709551615n) {
            return true; // ID memo
          }
          if (/^[0-9a-fA-F]{64}$/.test(value)) {
            return true; // Hash or return memo
          }
          return false;
        },
        defaultMessage(_args: ValidationArguments) {
          return 'Must be a valid Stellar memo';
        },
      },
    });
  };
}

export function IsStellarFederationAddress(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStellarFederationAddress',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          // Federation addresses follow the format: username*domain.com
          const federationAddressRegex =
            /^[a-zA-Z0-9._-]+\*[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          return federationAddressRegex.test(value);
        },
        defaultMessage(_args: ValidationArguments) {
          return 'Must be a valid Stellar federation address (username*domain.com)';
        },
      },
    });
  };
}
