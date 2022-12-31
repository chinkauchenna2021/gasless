import { Address } from '@graphprotocol/graph-ts';
import {
  PaymentTokenWhitelistUpdate as PaymentTokenWhitelistUpdateEvent
} from '../../../generated/DoubleDiceProtocol/DoubleDiceProtocol';
import { IERC20Metadata } from '../../../generated/DoubleDiceProtocol/IERC20Metadata';
import { PaymentToken } from '../../../generated/schema';
import { assertFieldEqual } from '../entity-lib';

export function assertPaymentTokenEntity(token: Address): PaymentToken {
  const id = token.toHex();
  const loaded = PaymentToken.load(id);
  if (loaded == null) {
    const created = new PaymentToken(id);
    {
      created.address = token;
      const paymentTokenContract = IERC20Metadata.bind(token);
      const symbol = paymentTokenContract.symbol();
      created.name = paymentTokenContract.name();
      created.symbol = symbol;
      created.decimals = paymentTokenContract.decimals();
      created.isWhitelisted = false;

      // Ignore warning "Type 'bool' is not assignable to type 'boolean'. Type 'number' is not assignable to type 'boolean'"
      created.isTest = symbol.startsWith('TEST');

    }
    created.save();
    return created;
  } else {
    {
      assertFieldEqual('PaymentToken', id, 'address', loaded.address, token);
    }
    return loaded;
  }
}

/**
 * It doesn't matter whether this token is being enabled or disabled, we are only using it to discover
 * new ERC-20 payment tokens that might later be used in virtual-floors.
 */
export function handlePaymentTokenWhitelistUpdate(event: PaymentTokenWhitelistUpdateEvent): void {
  const paymentToken = assertPaymentTokenEntity(event.params.token);
  paymentToken.isWhitelisted = event.params.whitelisted;
  paymentToken.save();
}
