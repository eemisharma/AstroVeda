const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding AstroVeda consultation services with updated tiers (49, 89, 99, 149, 499)...');

  const services = [
    {
      name: 'Quick Kundli Glance & Planetary Insights',
      slug: 'quick-kundli-glance',
      description: 'Rapid Vedic calculation of your Ascendant (Lagna), Moon sign, 9 planetary positions, and active dasha snapshot.',
      price: 49,
      currency: 'INR',
      deliveryTime: '30 mins',
      active: true,
    },
    {
      name: 'Life Direction & Transit Guide',
      slug: 'life-direction-transit',
      description: 'Focused planetary transit analysis covering your immediate life questions across career, emotional harmony, and major timings.',
      price: 89,
      currency: 'INR',
      deliveryTime: '30 mins',
      active: true,
    },
    {
      name: 'Comprehensive Destiny & House Analysis',
      slug: 'comprehensive-destiny',
      description: 'In-depth 12-house reading, wealth yogas, career trajectory, relationship compatibility dynamics, and 2-year forecast.',
      price: 99,
      currency: 'INR',
      deliveryTime: '30 mins',
      active: true,
    },
    {
      name: 'Deep Vedic Kundli + Live WhatsApp Consultation',
      slug: 'vedic-kundli-whatsapp',
      description: 'Complete 10-section Vedic horoscope analysis report with immediate direct WhatsApp chat consultation with an expert astrologer upon payment.',
      price: 149,
      currency: 'INR',
      deliveryTime: 'Instant on WhatsApp',
      active: true,
    },
    {
      name: 'AstroVeda Master Horoscope & Remedial Blueprint [Premium - Coming Soon]',
      slug: 'premium-master-horoscope',
      description: 'All-inclusive master compendium covering every life domain, dosha shanti, gemstone & rudraksha recommendations, and custom Vedic remedial product bundle.',
      price: 499,
      currency: 'INR',
      deliveryTime: 'Coming Soon / Pre-book',
      active: true,
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }

  // Deactivate legacy services so only the 5 official AstroVeda tiers appear in ascending order
  await prisma.service.updateMany({
    where: {
      slug: {
        notIn: services.map((s) => s.slug),
      },
    },
    data: {
      active: false,
    },
  });

  console.log('Seeding admin and demo customer accounts...');

  const adminPasswordHash = await bcrypt.hash('AdminPassword123!', 10);
  const customerPasswordHash = await bcrypt.hash('CustomerPassword123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@astroveda.com' },
    update: {
      role: 'ADMIN',
      passwordHash: adminPasswordHash,
    },
    create: {
      name: 'AstroVeda Admin',
      email: 'admin@astroveda.com',
      phone: '+919876543210',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  // Keep legacy admin for seamless access
  await prisma.user.upsert({
    where: { email: 'admin@astroconsult.com' },
    update: {
      role: 'ADMIN',
      passwordHash: adminPasswordHash,
    },
    create: {
      name: 'AstroVeda Admin',
      email: 'admin@astroconsult.com',
      phone: '+919876543210',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {
      passwordHash: customerPasswordHash,
    },
    create: {
      name: 'Aarav Sharma',
      email: 'customer@example.com',
      phone: '+919876543211',
      passwordHash: customerPasswordHash,
      role: 'CUSTOMER',
    },
  });

  console.log(`Seeding complete: Admin ${admin.email}, Customer ${customer.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
