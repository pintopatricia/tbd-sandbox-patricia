import {
  PlaceInstruction,
  ReplaceInstruction,
  CancelInstruction,
  UpdateInstruction,
  Price,
  Size,
  BetId,
  PersistenceType,
  SelectionId,
  OrderType,
  Side,
  Handicap,
} from "@flutter-global/uki-channels-http-clients/src/clients/ExchangeTransactional/ExchangeTransactional";

/**
 * @enum {string} Exchange Transactional (ETX) methods enum
 * On ETX we may use one of the following methods: 'place', 'replace', 'cancel' or 'update'
 */
export enum ETXMethod {
  Place = "place",
  Replace = "replace",
  Cancel = "cancel",
  Update = "update",
}

/**
 * Editable bet data model type
 * It has the corresponding ETX method to be called and the instruction to send as payload to the service
 */
type EditBet = {
  method: ETXMethod;
  instruction: PlaceInstruction | ReplaceInstruction | CancelInstruction | UpdateInstruction;
};

/**
 * Returns the ETX method to call when a bet is edited, given the original and the edited bet
 *
 * @param {{
 *   persistenceType: PersistenceType,
 *   betId: BetId;
 *   size: Size;
 *   price: Price;
 *   selectionId: SelectionId;
 *   orderType: OrderType;
 *   side: Side;
 *   handicap: Handicap;
 * }} bet The bet with edited fields
 * @param {{
 *   persistenceType: PersistenceType,
 *   betId: BetId;
 *   size: Size;
 *   price: Price;
 *   selectionId: SelectionId;
 *   orderType: OrderType;
 *   side: Side;
 *   handicap: Handicap;
 * }} originalBet The original bet
 * @returns {EditBet} The ETX instruction and the corresponding payload
 */
export default function edit(
  bet: {
    limitOrder: {
      persistenceType: PersistenceType;
      size: Size;
      price: Price;
    };
    betId: BetId;
    selectionId: SelectionId;
    orderType: OrderType;
    side: Side;
    handicap: Handicap;
  },
  originalBet: {
    limitOrder: {
      persistenceType: PersistenceType;
      size: Size;
      price: Price;
    };
    betId: BetId;
    selectionId: SelectionId;
    orderType: OrderType;
    side: Side;
    handicap: Handicap;
  },
): EditBet {
  if (bet.limitOrder.persistenceType !== originalBet.limitOrder.persistenceType) {
    const instruction: UpdateInstruction = {
      betId: originalBet.betId,
      newPersistenceType: bet.limitOrder.persistenceType,
    };

    return {
      instruction,
      method: ETXMethod.Update,
    };
  }
  if (bet.limitOrder.price !== originalBet.limitOrder.price) {
    const instruction: ReplaceInstruction = {
      betId: originalBet.betId,
      newPrice: bet.limitOrder.price,
    };

    return {
      instruction,
      method: ETXMethod.Replace,
    };
  }
  if (bet.limitOrder.size < originalBet.limitOrder.size) {
    const sizeReduction = Number((originalBet.limitOrder.size - bet.limitOrder.size).toFixed(2));

    const instruction: CancelInstruction = {
      betId: originalBet.betId,
      sizeReduction,
    };

    return {
      instruction,
      method: ETXMethod.Cancel,
    };
  }
  if (bet.limitOrder.size > originalBet.limitOrder.size) {
    const sizeIncrement = Number((bet.limitOrder.size - originalBet.limitOrder.size).toFixed(2));

    const instruction: PlaceInstruction = {
      orderType: bet.orderType,
      selectionId: bet.selectionId,
      handicap: bet.handicap,
      side: bet.side,
      limitOrder: {
        size: sizeIncrement,
        price: bet.limitOrder.price,
        persistenceType: bet.limitOrder.persistenceType,
      },
    };

    return {
      instruction,
      method: ETXMethod.Place,
    };
  }

  throw new Error(
    `Expected a possible bet edition, but no edit can be made with '${bet}' as bet and ${originalBet} as originalBet.`,
  );
}
