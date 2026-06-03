# Frontend Experimentation

## Overview

Frontend experiment exposures are tracked through **LPS (Loop SDK)** which feeds data into **Statsig**. This replaces the previous GA-based tracking approach.

> **Note:** This documentation applies to **frontend-only experiments**. Experiments driven by the BFF are not affected.

## Implementation Guide

### Using the `useExperimentVariant` Hook

The simplest way to read experiment variants is using the `useExperimentVariant` hook:

```tsx
import { useExperimentVariant } from "@ppb/tbd-shared/experimentation/hooks/useExperimentVariant";

const MyComponent = () => {
  const variant = useExperimentVariant("my-experiment-id");

  if (variant === "control") {
    return <Control />;
  }

  if (variant === "variant-a") {
    return <VariantA />;
  }

  // Handle null case (experiment not assigned)
  return <DefaultExperience />;
};
```

The hook returns:

- The assigned variant as a `string` if the user is enrolled in the experiment
- `null` if the experiment is not assigned or the Loop client is unavailable

### Using the Loop Client Directly

If the hook doesn't fit your use case, you can access the Loop client directly via the `LoopContext`:

```tsx
import { useContext } from "react";
import { LoopContext } from "@ppb/tbd-shared/experimentation/provider/LoopProvider";

const MyComponent = () => {
  const loopClient = useContext(LoopContext);

  if (loopClient) {
    const variant = loopClient.getAssignedExperimentVariant("my-experiment-id");
    // Use variant as needed
  }
};
```

## Architecture

### LoopProvider

The `LoopProvider` component wraps the application and exposes the Loop client through React context.

### Key Files

| File                                                                | Description                                |
| ------------------------------------------------------------------- | ------------------------------------------ |
| `packages/tbd-shared/experimentation/provider/LoopProvider.tsx`     | React context provider for the Loop client |
| `packages/tbd-shared/experimentation/hooks/useExperimentVariant.ts` | Hook for reading experiment variants       |

## Important Notes

1. **Do not use `ApplicationState` for frontend experiments** - Always use the Loop client (via hook or directly) to ensure tracking in Statsig.

2. **BFF experiments are unaffected** - This guidance only applies to frontend-only experiments.

3. **Throttle-controlled** - The Loop client is controlled by the `LPS_FE_EXPOSURE` throttle. When the throttle is inactive, the client will be `null`, and experiment will be off (exposures won't be send also).
