import { getEventRegistry } from "eventemitter3-singleton";
import type { Events } from "./events";

const { on, once } = getEventRegistry<Events>();

function onAll<K extends Array<keyof Events>>(
  events: [...K],
  handler: (...data: { [I in keyof K]: Events[K[I] & keyof Events] }) => void,
): void {
  const results = new Array(events.length);
  let firedCount = 0;
  let fired = false;

  const eventsObject = Object.fromEntries(events.map((key) => [key, false]));

  const fireHandlerIfAllEventsEmmited = () => {
    if (firedCount === events.length && !fired) {
      fired = true;
      handler(...(results as Parameters<typeof handler>));
      fired = false;
      firedCount = 0;
      for (const key in eventsObject) {
        eventsObject[key] = false;
      }
    }
  };

  events.forEach((event, index) => {
    on(event, (payload) => {
      results[index] = payload;
      if (!eventsObject[event]) {
        eventsObject[event] = true;
        firedCount++;
      }

      fireHandlerIfAllEventsEmmited();
    });
  });
}

export { once, onAll };
export default on;
