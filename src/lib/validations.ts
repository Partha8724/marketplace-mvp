import { DeliveryOption, ItemCondition, ListingStatus } from "@prisma/client";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.email("Enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Password must contain one uppercase letter.")
      .regex(/[0-9]/, "Password must contain one number."),
    confirmPassword: z.string(),
    city: z.string().min(2, "City is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const profileSchema = z.object({
  name: z.string().min(2),
  city: z.string().min(2).max(80),
  bio: z.string().max(240).optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  photoUrl: z.string().optional().or(z.literal("")),
});

export const listingSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(8).max(120),
  description: z.string().min(30).max(4000),
  categoryId: z.string().min(1, "Choose a category."),
  price: z.coerce.number().min(1, "Price must be greater than 0."),
  negotiable: z.coerce.boolean().default(false),
  condition: z.nativeEnum(ItemCondition),
  brand: z.string().max(80).optional().or(z.literal("")),
  city: z.string().min(2).max(80),
  deliveryOptions: z.array(z.nativeEnum(DeliveryOption)).min(1, "Select at least one delivery option."),
  tags: z.array(z.string().min(1).max(24)).max(8),
  status: z.nativeEnum(ListingStatus),
  imageUrls: z.array(z.string().min(1)).min(1, "Add at least one image.").max(8),
});

export const reportSchema = z.object({
  listingId: z.string().min(1),
  reason: z.string().min(5).max(120),
  details: z.string().max(500).optional().or(z.literal("")),
});

export const messageSchema = z.object({
  listingId: z.string().min(1),
  body: z.string().min(1, "Message cannot be empty.").max(1000),
});

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2).max(60),
  slug: z.string().min(2).max(60),
  description: z.string().max(180).optional().or(z.literal("")),
  parentId: z.string().optional().or(z.literal("")),
  icon: z.string().max(40).optional().or(z.literal("")),
  sortOrder: z.coerce.number().min(0).max(999).default(0),
});

export type ListingInput = z.infer<typeof listingSchema>;
