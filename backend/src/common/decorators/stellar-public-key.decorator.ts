import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsStellarPublicKey(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStellarPublicKey',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }
          
          // Stellar public keys are 56 characters and start with 'G'
          const stellarPublicKeyRegex = /^G[A-Z0-9]{55}$/;
          return stellarPublicKeyRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid Stellar public key (starts with G, 56 characters)`;
        },
      },
    });
  };
}

export function IsStellarSecretKey(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStellarSecretKey',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }
          
          // Stellar secret keys are 56 characters and start with 'S'
          const stellarSecretKeyRegex = /^S[A-Z0-9]{55}$/;
          return stellarSecretKeyRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid Stellar secret key (starts with S, 56 characters)`;
        },
      },
    });
  };
}

export function IsStellarAssetCode(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStellarAssetCode',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }
          
          // Asset codes are 1-12 alphanumeric characters
          const assetCodeRegex = /^[a-zA-Z0-9]{1,12}$/;
          return assetCodeRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid Stellar asset code (1-12 alphanumeric characters)`;
        },
      },
    });
  };
}

export function IsStellarAssetIssuer(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStellarAssetIssuer',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }
          const stellarPublicKeyRegex = /^G[A-Z0-9]{55}$/;
          return stellarPublicKeyRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid Stellar public key (asset issuer)`;
        },
      },
    });
  };
}

export function IsStellarMemo(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStellarMemo',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }
          
          // Memos can be up to 28 bytes (28 characters for text, 64 hex chars for ID, 28 base64 chars for hash)
          if (value.length > 28) {
            return false;
          }
          
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid Stellar memo (max 28 characters)`;
        },
      },
    });
  };
}

export function IsStellarFederationAddress(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStellarFederationAddress',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }
          
          // Federation addresses are in format: username*domain.com
          const federationRegex = /^[a-zA-Z0-9._-]+\*[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          return federationRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid Stellar federation address (e.g., user*domain.com)`;
        },
      },
    });
  };
}
