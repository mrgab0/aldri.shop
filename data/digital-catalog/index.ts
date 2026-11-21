import { DigitalProductItem } from "./types";
import { DIGITAL_GAMES } from "./games";
import { DIGITAL_SOFTWARE } from "./software";
import { DIGITAL_CREATOR_PACKS } from "./creator-packs";
import { DIGITAL_TEMPLATES } from "./templates";
import { DIGITAL_GIFTCARDS } from "./giftcards";

export * from "./types";
export * from "./games";
export * from "./software";
export * from "./creator-packs";
export * from "./templates";
export * from "./giftcards";

export const REAL_DIGITAL_PRODUCTS: DigitalProductItem[] = [
  ...DIGITAL_GAMES,
  ...DIGITAL_SOFTWARE,
  ...DIGITAL_CREATOR_PACKS,
  ...DIGITAL_TEMPLATES,
  ...DIGITAL_GIFTCARDS,
];
