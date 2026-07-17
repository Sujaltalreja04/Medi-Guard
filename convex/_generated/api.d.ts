/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as alerts from "../alerts.js";
import type * as analytics from "../analytics.js";
import type * as audit from "../audit.js";
import type * as bins from "../bins.js";
import type * as devices from "../devices.js";
import type * as events from "../events.js";
import type * as facilities from "../facilities.js";
import type * as lib_nvidiaVision from "../lib/nvidiaVision.js";
import type * as lib_segregationEngine from "../lib/segregationEngine.js";
import type * as lib_wasteClassNormalizer from "../lib/wasteClassNormalizer.js";
import type * as reviews from "../reviews.js";
import type * as rules from "../rules.js";
import type * as seed from "../seed.js";
import type * as vision from "../vision.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  alerts: typeof alerts;
  analytics: typeof analytics;
  audit: typeof audit;
  bins: typeof bins;
  devices: typeof devices;
  events: typeof events;
  facilities: typeof facilities;
  "lib/nvidiaVision": typeof lib_nvidiaVision;
  "lib/segregationEngine": typeof lib_segregationEngine;
  "lib/wasteClassNormalizer": typeof lib_wasteClassNormalizer;
  reviews: typeof reviews;
  rules: typeof rules;
  seed: typeof seed;
  vision: typeof vision;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
