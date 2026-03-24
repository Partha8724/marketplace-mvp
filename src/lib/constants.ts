import { DeliveryOption, ItemCondition } from "@prisma/client";

export const APP_NAME = process.env.APP_NAME || "Northstar Market";

export const deliveryOptionLabels: Record<DeliveryOption, string> = {
  PICKUP: "Pickup",
  LOCAL_DELIVERY: "Local delivery",
  SHIPPING: "Shipping",
};

export const conditionLabels: Record<ItemCondition, string> = {
  NEW: "New",
  LIKE_NEW: "Like New",
  VERY_GOOD: "Very Good",
  GOOD: "Good",
  FAIR: "Fair",
  FOR_PARTS: "For Parts",
};

export const prohibitedKeywords = [
  "gun",
  "firearm",
  "ammo",
  "ammunition",
  "knife",
  "cocaine",
  "weed",
  "marijuana",
  "counterfeit",
  "fake passport",
  "explosive",
  "human organ",
  "ivory",
];

export const prohibitedCategoriesCopy = [
  {
    title: "Weapons and explosives",
    description: "Firearms, ammunition, explosives, military-grade gear, and weapon parts are prohibited.",
  },
  {
    title: "Illegal drugs and controlled substances",
    description: "Recreational drugs, prescription abuse products, and paraphernalia are not allowed.",
  },
  {
    title: "Counterfeit or stolen goods",
    description: "Replica luxury items, fake electronics, and any item with suspicious ownership are blocked.",
  },
  {
    title: "Illegal services or documents",
    description: "Listings for forged IDs, hacked accounts, exam leaks, or unlawful services are rejected.",
  },
];

export const safeMeetupTips = [
  "Meet in a busy public place with CCTV coverage.",
  "Bring a friend for high-value transactions when possible.",
  "Inspect the item fully before handing over payment.",
  "Avoid paying outside the platform conversation trail.",
];
