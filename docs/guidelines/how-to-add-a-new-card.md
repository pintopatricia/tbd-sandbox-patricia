# How to add a new Card

## Fragments
One of the most common things you will need to do on store is to fetch a new card/cardgroup from BFF.

On TBD a definition of a Card and where a Card can be displayed is 100% controled via BFF with [schema.graphql](apps/bf-tbd-http-bff-gql/src/schema.graphql)

Before starting writing your queries/fragments you must answer questions like:

- Can my Card be displayed under a CardGroup?
- Which queries can fetch my Card?
- My Card is actually a Card or any other entity?

At the time of the writing of this document, we have several places where a Card/CardGroup can appear. The easiest way to know the details is to search on [schema.graphql](apps/bf-tbd-http-bff-gql/src/schema.graphql) for your card.

After finding where your card should appear and where can be queried you need to change all fragment's list accordingly. Two places to check:

### Queries

The [Card](packages/tbd-store/clients/catalogue/card_query.graphql) query is a good example.

Looking on [schema.graphql](apps/bf-tbd-http-bff-gql/src/schema.graphql) this query returns an array of ViewItems.

```
type Query {
  """
  Look up cards by its urns
  """
  Cards(
    """
    The cards urns
    """
    cardsURN: [URN!]!
  ): [ViewItem]
```

If your card was added here, you need to change [card_query.graphql](packages/tbd-store/clients/catalogue/card_query.graphql) fragment accordingly and add your new fragment.

### Lists

_Check the [items folder](packages/tbd-store/services/catalogue/normalizer/items)_

All types that have a list of items defined on [schema.graphql](apps/bf-tbd-http-bff-gql/src/schema.graphql) have the correspondent fragment under this folder. So again, you just need to change the types that uses your new Card.

## Normalizers

_Check the [normalizer's folder](packages/tbd-store/services/catalogue/normalizer)_

Everytime you add a new fragment you should had a normalizer for that particular use case.

There are plenty normalizers you can already use as an example but the premise is that you have a `MyCardFragment` that was generated into [catalogue-response-types](packages/tbd-store/clients/catalogue/catalogue-response-types.ts) for you new fragment. This normalizer should be a pure function that transform that `MyCardFragment` into a valid type used by our store. We should **never** use the generated types directly in the store model.


