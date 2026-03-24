import { PrismaClient, DeliveryOption, ItemCondition, ListingStatus, ModerationStatus, ReportStatus, ReportTargetType, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";

const prisma = new PrismaClient();

const categories = [
  { name: "Electronics", slug: "electronics", icon: "Smartphone", children: [{ name: "Phones", slug: "phones" }, { name: "Laptops", slug: "laptops" }, { name: "Audio", slug: "audio" }] },
  { name: "Home & Living", slug: "home-living", icon: "Sofa", children: [{ name: "Furniture", slug: "furniture" }, { name: "Appliances", slug: "appliances" }] },
  { name: "Vehicles", slug: "vehicles", icon: "Car", children: [{ name: "Cars", slug: "cars" }, { name: "Bikes", slug: "bikes" }] },
  { name: "Fashion", slug: "fashion", icon: "Shirt", children: [{ name: "Men", slug: "men-fashion" }, { name: "Women", slug: "women-fashion" }] },
];

async function main() {
  await prisma.moderationLog.deleteMany();
  await prisma.report.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.listingImage.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.category.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  for (const [index, category] of categories.entries()) {
    await prisma.category.create({ data: { name: category.name, slug: category.slug, icon: category.icon, sortOrder: index, children: { create: category.children.map((child, childIndex) => ({ ...child, sortOrder: childIndex })) } } });
  }

  const passwordHash = await bcrypt.hash("Password123!", 12);
  const admin = await prisma.user.create({ data: { name: "Admin Northstar", email: "admin@northstar.test", emailVerified: new Date(), passwordHash, role: Role.ADMIN, profile: { create: { city: "Bengaluru", bio: "Marketplace operations and trust team", identityVerified: true, phoneVerified: true } } } });
  const seller = await prisma.user.create({ data: { name: "Ayesha Khan", email: "ayesha@northstar.test", emailVerified: new Date(), passwordHash, profile: { create: { city: "Bengaluru", bio: "Selling carefully maintained home tech and furniture.", ratingAverage: 4.8, ratingCount: 17, phoneVerified: true } } } });
  const buyer = await prisma.user.create({ data: { name: "Rahul Das", email: "rahul@northstar.test", emailVerified: new Date(), passwordHash, profile: { create: { city: "Kolkata", bio: "Looking for quality second-hand gadgets and bikes.", phoneVerified: true } } } });
  const casualSeller = await prisma.user.create({ data: { name: "Maya Joseph", email: "maya@northstar.test", emailVerified: new Date(), passwordHash, profile: { create: { city: "Mumbai", bio: "Decluttering premium fashion and decor." } } } });

  const phoneCategory = await prisma.category.findUniqueOrThrow({ where: { slug: "phones" } });
  const laptopCategory = await prisma.category.findUniqueOrThrow({ where: { slug: "laptops" } });
  const furnitureCategory = await prisma.category.findUniqueOrThrow({ where: { slug: "furniture" } });
  const bikeCategory = await prisma.category.findUniqueOrThrow({ where: { slug: "bikes" } });
  const fashionCategory = await prisma.category.findUniqueOrThrow({ where: { slug: "women-fashion" } });

  const seedListings = [
    { userId: seller.id, categoryId: phoneCategory.id, title: "iPhone 13 128GB in midnight", description: "Single-owner iPhone 13 with 89% battery health, original box, and tempered glass installed. No repairs, no cracks.", brand: "Apple", price: 42999, negotiable: true, condition: ItemCondition.VERY_GOOD, city: "Bengaluru", tags: ["iphone", "apple", "smartphone", "128gb"], deliveryOptions: [DeliveryOption.PICKUP, DeliveryOption.SHIPPING], status: ListingStatus.ACTIVE, moderationStatus: ModerationStatus.APPROVED, imageUrls: ["/uploads/listings/sample-phone-1.svg", "/uploads/listings/sample-phone-2.svg"] },
    { userId: seller.id, categoryId: laptopCategory.id, title: "MacBook Air M1 2020 8GB 256GB", description: "Lightly used MacBook Air with charger, sleeve, and pristine keyboard. Ideal for students and remote work.", brand: "Apple", price: 57999, negotiable: false, condition: ItemCondition.LIKE_NEW, city: "Bengaluru", tags: ["macbook", "m1", "laptop"], deliveryOptions: [DeliveryOption.PICKUP, DeliveryOption.LOCAL_DELIVERY], status: ListingStatus.ACTIVE, moderationStatus: ModerationStatus.APPROVED, imageUrls: ["/uploads/listings/sample-laptop-1.svg"] },
    { userId: casualSeller.id, categoryId: furnitureCategory.id, title: "Solid teak study desk with drawers", description: "Minimalist teak desk with two drawers. Great condition, fits compact apartments, and very sturdy.", brand: "Urban Ladder", price: 14999, negotiable: true, condition: ItemCondition.GOOD, city: "Mumbai", tags: ["desk", "teak", "study", "furniture"], deliveryOptions: [DeliveryOption.PICKUP, DeliveryOption.LOCAL_DELIVERY], status: ListingStatus.ACTIVE, moderationStatus: ModerationStatus.APPROVED, imageUrls: ["/uploads/listings/sample-desk-1.svg"] },
    { userId: buyer.id, categoryId: bikeCategory.id, title: "Royal Enfield Classic 350 2021", description: "Well maintained, service records available, insurance valid until December 2026. Serious buyers only.", brand: "Royal Enfield", price: 132000, negotiable: true, condition: ItemCondition.VERY_GOOD, city: "Kolkata", tags: ["bike", "classic350", "royalenfield"], deliveryOptions: [DeliveryOption.PICKUP], status: ListingStatus.ACTIVE, moderationStatus: ModerationStatus.PENDING, imageUrls: ["/uploads/listings/sample-bike-1.svg"] },
    { userId: casualSeller.id, categoryId: fashionCategory.id, title: "Coach leather tote bag", description: "Original leather tote with dust bag. Mild corner wear, still looks premium and polished.", brand: "Coach", price: 8400, negotiable: false, condition: ItemCondition.GOOD, city: "Mumbai", tags: ["bag", "coach", "tote", "fashion"], deliveryOptions: [DeliveryOption.SHIPPING, DeliveryOption.PICKUP], status: ListingStatus.SOLD, moderationStatus: ModerationStatus.APPROVED, imageUrls: ["/uploads/listings/sample-bag-1.svg"] },
  ];

  const createdListings = [];
  for (const listing of seedListings) {
    const created = await prisma.listing.create({ data: { userId: listing.userId, categoryId: listing.categoryId, title: listing.title, slug: `${slugify(listing.title, { lower: true, strict: true })}-${Math.random().toString(36).slice(2, 6)}`, description: listing.description, brand: listing.brand, price: listing.price, negotiable: listing.negotiable, condition: listing.condition, city: listing.city, tags: listing.tags, deliveryOptions: listing.deliveryOptions, status: listing.status, moderationStatus: listing.moderationStatus, publishedAt: listing.moderationStatus === ModerationStatus.APPROVED ? new Date() : null, images: { create: listing.imageUrls.map((url, index) => ({ url, alt: listing.title, sortOrder: index })) } } });
    createdListings.push(created);
  }

  await prisma.favorite.createMany({ data: [{ userId: buyer.id, listingId: createdListings[0].id }, { userId: buyer.id, listingId: createdListings[2].id }, { userId: seller.id, listingId: createdListings[4].id }] });
  const conversation = await prisma.conversation.create({ data: { listingId: createdListings[0].id, buyerId: buyer.id, sellerId: seller.id, lastMessageAt: new Date() } });
  await prisma.message.createMany({ data: [{ conversationId: conversation.id, senderId: buyer.id, body: "Hi, is the iPhone still available? Can you share if the battery was replaced?" }, { conversationId: conversation.id, senderId: seller.id, body: "Yes, it is available. Battery is original and currently at 89% health." }] });
  const report = await prisma.report.create({ data: { reporterId: buyer.id, listingId: createdListings[3].id, targetType: ReportTargetType.LISTING, reason: "Possible mismatch in registration details", details: "The model year and service history need manual moderation review.", status: ReportStatus.OPEN } });
  await prisma.moderationLog.create({ data: { actorId: admin.id, reportId: report.id, action: "REPORT_REVIEWED", note: "Seeded review record for admin dashboard." } });

  console.log("Seed complete");
  console.log("Admin:", admin.email);
  console.log("User:", seller.email);
  console.log("Password:", "Password123!");
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
