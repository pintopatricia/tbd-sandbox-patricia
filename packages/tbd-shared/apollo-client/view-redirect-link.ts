import { ApolloLink } from "@apollo/client";
import type { DocumentNode, FieldNode, FragmentDefinitionNode } from "graphql";
import { ViewRedirectQuery } from "./fragments/ViewRedirect.graphql";
import { getApolloClient } from "./client";
import { getStore } from "@ppb/tbd-store/create-store";
import { VIEW_REDIRECT } from "@ppb/tbd-store/actions/router";
import type { ViewRedirectAction } from "@ppb/tbd-store/actions/router";

const VIEW_REDIRECT_OPERATION_NAME = "ViewRedirect";

const FORCE_REDIRECT_TYPENAMES: ReadonlySet<string> = new Set<string>(["NotFoundView", "MaintenanceView"]);

/**
 * Finds the top-level `View` field in a query document.
 *
 * A GraphQL document is a tree of definitions. For an operation like:
 *
 *   query RaceMeetingView($viewURN: URN!) {
 *     View(viewURN: $viewURN) {
 *       ...RaceMeetingView
 *     }
 *   }
 *
 * the AST looks roughly like:
 *
 *   Document
 *   └── OperationDefinition ("RaceMeetingView")
 *       └── SelectionSet
 *           └── Field { name: "View", arguments: [...], selectionSet: ... }  ← we want this
 *
 * We only look at the operation's top-level selections — we do NOT recurse
 * into nested selection sets, because the `View` root field is always at the
 * top (BFF schema convention).
 *
 * Returns `undefined` for any query that doesn't touch `View` (e.g. AppContext
 * queries, bets queries, etc.). The link uses this as a fast-path exit.
 */
function findViewField(document: DocumentNode): FieldNode | undefined {
  for (const definition of document.definitions) {
    if (definition.kind === "OperationDefinition") {
      for (const selection of definition.selectionSet.selections) {
        if (selection.kind === "Field" && selection.name.value === "View") {
          return selection;
        }
      }
    }
  }
  return undefined;
}

/**
 * Extracts the set of view `__typename`s a query is expecting.
 *
 * `View` is a GraphQL interface implemented by ~20 concrete types
 * (RaceMeetingView, SportView, EventView, ...). When a query selects on
 * `View`, it narrows down to specific types via either:
 *
 *   (a) Inline fragments:        `... on RaceMeetingView { ... }`
 *   (b) Fragment spreads:        `...RaceMeetingView`
 *       where the fragment is defined as `fragment RaceMeetingView on RaceMeetingView { ... }`
 *
 * For case (a), the type condition sits directly on the InlineFragment node.
 * For case (b), we have to follow the spread — look up the FragmentDefinition
 * by name in the same document, and read its `typeCondition`.
 *
 * Example:
 *
 *   query RaceMeetingView($viewURN: URN!) {
 *     View(viewURN: $viewURN) {
 *       ...RaceMeetingView              ← FragmentSpread → resolves to "RaceMeetingView"
 *     }
 *   }
 *
 *   fragment RaceMeetingView on RaceMeetingView {  ← typeCondition: "RaceMeetingView"
 *     urn
 *     ...
 *   }
 *
 * The returned list is the set of types the caller considers "a match". If
 * the BFF returns a `__typename` outside this list, it's treated as a redirect.
 */
function getExpectedViewTypes(document: DocumentNode, viewField: FieldNode): string[] {
  if (!viewField.selectionSet) {
    return [];
  }

  const fragmentDefinitions = new Map<string, FragmentDefinitionNode>();
  for (const def of document.definitions) {
    if (def.kind === "FragmentDefinition") {
      fragmentDefinitions.set(def.name.value, def);
    }
  }

  const types: string[] = [];
  for (const selection of viewField.selectionSet.selections) {
    if (selection.kind === "InlineFragment" && selection.typeCondition) {
      types.push(selection.typeCondition.name.value);
    } else if (selection.kind === "FragmentSpread") {
      const fragment = fragmentDefinitions.get(selection.name.value);
      if (fragment?.typeCondition) {
        types.push(fragment.typeCondition.name.value);
      }
    }
  }

  return types;
}

/**
 * Resolves the `viewURN` argument value passed to the `View(...)` field.
 *
 * In GraphQL, field arguments can be expressed in two shapes we care about:
 *
 *   - As a variable reference:   `View(viewURN: $viewURN)`
 *     The AST stores the variable *name* ("viewURN"); the actual runtime
 *     value lives in `operation.variables` and has to be looked up by that
 *     name. Note that the variable name doesn't have to match the argument
 *     name — e.g. `View(viewURN: $someOtherName)` is valid.
 *
 *   - As a string literal:       `View(viewURN: "ppb:tbd:race:123")`
 *     The value sits right there in the AST.
 *
 * Any other value kind (enum, int, etc.) doesn't make sense for a URN and is
 * treated as "unknown" — the link will bail out and forward the operation
 * without firing the redirect query.
 */
function getViewURNFromField(viewField: FieldNode, variables: Record<string, any>): string | undefined {
  const arg = viewField.arguments?.find((a) => a.name.value === "viewURN");

  if (!arg) {
    return undefined;
  }

  if (arg.value.kind === "Variable") {
    return variables[arg.value.name.value];
  }

  if (arg.value.kind === "StringValue") {
    return arg.value.value;
  }

  return undefined;
}

/**
 * Decides whether a BFF-returned view should trigger a redirect PUSH.
 *
 * Two independent reasons can flip this to `true`:
 *
 *   - `FORCE_REDIRECT_TYPENAMES` match — the returned type is always treated
 *     as a terminal/redirect target regardless of what the caller expected.
 *   - Unexpected type — the caller's query didn't declare a fragment for the
 *     returned type, so rendering would silently break.
 *
 * Kept as a pure function so new rules can be added without touching the
 * link's control flow.
 */
function shouldRedirect(returnedTypename: string, expectedTypes: string[]): boolean {
  if (FORCE_REDIRECT_TYPENAMES.has(returnedTypename)) {
    return true;
  }
  return !expectedTypes.includes(returnedTypename);
}

/**
 * Fires the parallel `ViewRedirect` query and dispatches a `PUSH` if the
 * returned view warrants a redirect. Intended as fire-and-forget from the
 * link handler — the original operation is already being forwarded.
 *
 * Runs `network-only`: a cached redirect would defeat the point of detecting
 * fresh server state. Any failure is swallowed — a broken redirect check must
 * never break the original query.
 */
async function checkAndDispatchRedirect(viewURN: string, expectedTypes: string[]): Promise<void> {
  const client = getApolloClient();

  try {
    const { data } = await client.query({
      query: ViewRedirectQuery,
      variables: { viewURN },
      fetchPolicy: "network-only",
    });

    if (!data?.View) {
      return;
    }

    if (!shouldRedirect(data.View.__typename, expectedTypes)) {
      return;
    }

    const store = getStore();

    store.dispatch<ViewRedirectAction>({
      type: VIEW_REDIRECT,
      payload: {
        viewUrn: data.View.urn,
        viewUrl: data.View.url,
      },
    });
  } catch {
    // Best-effort: a failed redirect check must not break the original query.
  }
}

/**
 * Creates an Apollo Link that protects `View(viewURN: ...)` queries from
 * server-side redirects to a different view type.
 *
 * The link inspects the outgoing query AST to collect expected `__typename`s,
 * fires a parallel `ViewRedirect` identity query, and dispatches a Redux
 * `PUSH` when the returned type is unexpected (or force-redirected).
 *
 * The original operation is always forwarded untouched; redirect is a
 * side-effect. It bails out quickly when:
 *
 *   - The operation is `ViewRedirect` itself (prevents recursion).
 *   - The operation doesn't query `View` at all.
 *   - No concrete expected `View` types are declared.
 *   - The `viewURN` argument cannot be resolved.
 *
 * Keep this link before persisted-queries in the chain so it can read the full
 * GraphQL document instead of a hashed payload.
 */
export function createViewRedirectLink(): ApolloLink {
  return new ApolloLink((operation, forward) => {
    // Skip our own redirect query to prevent infinite recursion.
    if (operation.operationName === VIEW_REDIRECT_OPERATION_NAME) {
      return forward(operation);
    }

    const viewField = findViewField(operation.query);
    if (!viewField) {
      return forward(operation);
    }

    const expectedTypes = getExpectedViewTypes(operation.query, viewField);
    if (expectedTypes.length === 0) {
      return forward(operation);
    }

    const viewURN = getViewURNFromField(viewField, operation.variables);
    if (!viewURN) {
      return forward(operation);
    }

    void checkAndDispatchRedirect(viewURN, expectedTypes);

    return forward(operation);
  });
}
