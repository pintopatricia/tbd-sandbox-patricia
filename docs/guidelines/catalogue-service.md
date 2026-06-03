# Catalogue Service

The `Catalogue Service Mapper` is a component of BFRB channels applications that has the core responsibility of mapping a GraphQL response from Backend for Frontend Catalogue Service to the Application State (Store). 

Although it is currently only being used on the frontend space, it is possible that this can become an isomorphic component to provide preloaded state to the application.

### Guidelines

##### ➡️ Guideline: Use fragments/normalizers pattern to transform GraphQL response data into the application state

* Can be checked by Static Code Analysis: 🚫
* Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

  In the early days of BFRB, a large set of functions were created to transform the response from the GraphQL underlying services such as the BFF Catalogue into the Application State. Usually, that set of (old) functions are typically prefixed as `transform`/`extract` functions. That led to an overly complex software component that should have a single responsibility: to map the response to the internal application state. This led to bigger issues such as reduced flexibility in the application views and unmaintainable unit tests.

  Giving the fact that the queries to the resources provided by the BFF Catalogue are composed of fragments (such as views, or business entities like competitions or events), we should enforce as a guideline that **an entity should be queried by a GraphQL fragment, then mapped to the application state by a normalizer**.

</details>

<br/>

##### ➡️ Guideline: Normalizers should expose `data` and `relations` properties

* Can be checked by Static Code Analysis: ✅
* Is this being checked by Static Code Analysis: ✅ (via typecheck)

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

  Normalizers API should be compliant with the definition of exposing:
  * `data`: the result of the transformed data from the service response
  * `relations`: an array of functions that recursively can normalize the graph dependencies of the original entity.
</details>

<details>
  <summary>👍👎 EXAMPLES</summary>
  <br />
  
  * As per the normalizer on the [Normalizer Example](#normalizer-example), the `data` property contains the relevant data of the competition and the `relations` property contains a `Sport` entity that is a dependency for the competition

  * There may happen that a fragment does not have any relations, in which case, an empty array must be returned.
</details>

<br/>

##### ➡️ Guideline: Normalizers should transform relations defined on fragments

* Can be checked by Static Code Analysis: 🚫
* Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

  Considering the [Fragment Example](#fragment-example), the snippet specifies that the competition fragment depends on the sport fragment. That said, this need to be explicitly handled within the normalizer within the `relations` property (see [Normalizer Example](#normalizer-example)).
</details>

<br/>

##### ➡️ Guideline: When creating a fragment/normalizer, avoid duplicated relations

* Can be checked by Static Code Analysis: 🚫
* Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

  When creating a fragment, attempt to assure that there aren't duplicated relations. 

  Let's consider the `SportsbookMarket` entity that depends on a `Sport` and `Competition`. Let's also consider that the `Competition` entity depends on `Sport` as well.

  In terms of fragments, this maps like the following:

  ```
    fragment sportsbookMarket on SportsbookMarket {
      __typename
      urn
      name
      sport {
        ...sport
      }
      competition {
        ...competition
      }
      ...
    }

    fragment competition on Competition {
      __typename
      urn
      name
      competitionId
      sport {
        ...sport
      }
    }

    fragment sport on Sport {
      __typename
      urn
      name
      sportId
    }
  ```

  In practice, the `sportsbookMarket` will have access to the `sport` in two different ways: 
   * by accessing directly the `sport` attribute
   * by accessing the `sport` attribute within the `competition`

For the sake of consistency and readability, the `sportsbookMarket` fragment should be composed by the following:

```
fragment sportsbookMarket on SportsbookMarket {
      __typename
      urn
      name
      competition {
        ...competition
      }
      ...
    }
```

</details>

<br/>

##### ➡️ Guideline: Organize fragments/normalizers folder structure with the same structure as per the Application Store

* Can be checked by Static Code Analysis: ✅
* Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

  The folder structure to use for the organization of normalizers and fragments is the same as the one defined for the application store (see the example below).

  Also important, folders should contain all the fragments/normalizers of an entity (as per the example below).
</details>


<details>
  <summary>👍👎 EXAMPLES</summary>
  <br />

```
// GOOD
packages/tbd-store/services/catalogue/normalizer/
├── entities
│   ├── competition
│   │   ├── competition.fragment.graphql
│   │   ├── competition-normalizer.ts
│   │   ├── competition-normalizer.test.js
│   ├── sport
│   └── sportsbook-market
├── layout
│   ├── cardgroups
│   ├── cards
│   ├── gridcardgroups
│   ├── pebblecardgroups
│   └── views
```
</details>

<br/>

##### ➡️ Guideline: When creating a fragment, always request mandatory attributes of the entity

* Can be checked by Static Code Analysis: 🚫
* Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

  Considering that we have a competition entity with the following type:

  ```
  export type Competition = {
    /** Competition URN */
    urn: URN;
    /** Competition name */
    name: string;
    /** Competition id */
    competitionId?: number;
    /** Sport URN */
    sport: string;
  };
  ```

  And that we have the following fragment to request a competition:

  ```
  fragment competition on Competition {
    __typename
    urn
    name
    competitionId
    sport {
      ...sport
    }
  }
  ```

  Whenever we need to request a competition, we will use `...competition`. Example:

  ```
  fragment sportevent on SportsEvent {
    urn
    name
    competition {
      ...competition
    }
  }
  ```

  This way, we assure that we have a canonical way to transform a given entity.
</details>

<details>
  <summary>👍👎 EXAMPLES</summary>
  <br />

```
// GOOD
fragment sportsbookMarket on SportsbookMarket {
  __typename
  urn
  name
  marketType
  competition {
    ...competition
  }
}

fragment newSportsbookMarket on SportsbookMarket {
  __typename
  urn
  name
  marketType
  competition {
    ...competition
  }
}
```

```
// BAD
fragment sportsbookMarket on SportsbookMarket {
  __typename
  urn
  name
  marketType
  competition {
    ...competition
  }
}

fragment newSportsbookMarket on SportsbookMarket {
  __typename
  urn
  name
  marketType
  competition {
    name
  }
}
```
</details>

<br/>

##### ➡️ Guideline: Naming Conventions for Normalizers

* Can be checked by Static Code Analysis: ✅
* Is this being checked by Static Code Analysis: ✅

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

  Name the normalizers as per the following pattern: `normalize<Fragment>Into<Entity>`.
</details>

<details>
  <summary>👍👎 EXAMPLES</summary>
  <br />

```
// GOOD
function normalizeMaintenanceViewFragmentIntoMaintenanceView(maintenanceView: MaintenanceViewFragment): TransformedFragment<MaintenanceView>
```
</details>

<br/>

### Reference Snippets

#### Fragment Example

<details>
  <summary>💬 Competition Fragment</summary>
  <br />
  
  **competition.fragment.graphql**

```
fragment competition on Competition {
  __typename
  urn
  name
  competitionId
  sport {
    ...sport
  }
}
```
</details>

#### Normalizer Example

<details>
  <summary>💬 Competition Normalizer</summary>
  <br />
  
  **competition-normalizer.ts**
```
const relations = (competition: CompetitionFragment): (() => TransformedFragment<Sport>)[] => {
  return [() => sportNormalizer(competition.sport)];
};
 
const normalizeCompetitionFragmentIntoCompetition = (
  competition: CompetitionFragment
): TransformedFragment<Competition> => {
  const { urn, name, sport, competitionId } = competition;
 
  return {
    data: {
      urn,
      name,
      sport: sport.urn,
      competitionId
    },
    relations: () => relations(competition)
  };
};
 
export default normalizeCompetitionFragmentIntoCompetition;
```
</details>
