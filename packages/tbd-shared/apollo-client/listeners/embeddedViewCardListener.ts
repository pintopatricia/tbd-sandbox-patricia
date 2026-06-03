import { getApolloClient } from "../client";
import { APP_CONTEXT__FETCH, FetchAppContextAction } from "@ppb/tbd-store/actions/app-context";
import { getStore } from "@ppb/tbd-store/create-store";

export async function embeddedViewCardListener(urn: string) {
  const apollo = getApolloClient();
  const store = getStore();

  const { EmbeddedViewCardAppContextFragment, EmbeddedViewCardFragment } = await import(
    "@ppb/tbd-components-regulatory-and-utils/components/EmbeddedViewCard/model/EmbeddedViewCard.graphql"
  );

  const observable = apollo.cache.watchFragment({
    fragment: EmbeddedViewCardAppContextFragment,
    fragmentName: "EmbeddedViewCardAppContext",
    from: {
      __typename: "AppContextDetails",
      urn: "ppb:tbd:appContext:appContext",
    },
  });

  observable.subscribe(() => {
    const embeddedViewCardData = apollo.cache.readFragment({
      fragment: EmbeddedViewCardFragment,
      fragmentName: "EmbeddedViewCard",
      id: apollo.cache.identify({
        __typename: "EmbeddedViewCard",
        urn: urn,
      }),
    });

    if (embeddedViewCardData?.appEnv) {
      store.dispatch<FetchAppContextAction>({
        type: APP_CONTEXT__FETCH,
        payload: {
          defaultAppEnv: embeddedViewCardData.appEnv,
        },
      });
    }
  });
}
