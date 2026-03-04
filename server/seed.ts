import { storage } from "./storage";

export async function seedDatabase() {
  const existingRoutines = await storage.getAllRoutines();
  if (existingRoutines.length > 0) return;

  const admin = await storage.getUserByUsername("admin1");
  if (!admin) return;

  const routines = [
    {
      title: "Tropical Beach Paradise",
      destination: "Maldives",
      description: "Experience the ultimate tropical getaway in the Maldives. Stay in overwater villas, snorkel in crystal-clear lagoons, and enjoy world-class spa treatments surrounded by pristine white sand beaches and turquoise waters.",
      duration: "7 Days / 6 Nights",
      price: 2499,
      image: "/images/beach-paradise.png",
      highlights: ["Overwater Villa", "Snorkeling", "Spa Retreat", "Sunset Cruise"],
      createdBy: admin.id,
    },
    {
      title: "Ancient Temple Discovery",
      destination: "Siem Reap, Cambodia",
      description: "Journey through centuries of history exploring the magnificent temples of Angkor. From the iconic Angkor Wat to the mysterious Ta Prohm, this cultural immersion takes you deep into the heart of Khmer civilization.",
      duration: "5 Days / 4 Nights",
      price: 1299,
      image: "/images/temple-tour.png",
      highlights: ["Angkor Wat", "Local Cuisine", "Guided Tours", "Sunrise Experience"],
      createdBy: admin.id,
    },
    {
      title: "Alpine Mountain Adventure",
      destination: "Swiss Alps, Switzerland",
      description: "Conquer the majestic Swiss Alps with guided treks through wildflower meadows, glacier walks, and panoramic summit views. Enjoy cozy mountain lodges and authentic Swiss fondue after exhilarating days on the trails.",
      duration: "6 Days / 5 Nights",
      price: 1899,
      image: "/images/mountain-adventure.png",
      highlights: ["Glacier Trek", "Mountain Lodge", "Scenic Train", "Alpine Dining"],
      createdBy: admin.id,
    },
    {
      title: "European City Explorer",
      destination: "Prague, Czech Republic",
      description: "Wander through the fairy-tale streets of Prague, from the stunning Old Town Square to the majestic Prague Castle. Discover hidden courtyards, taste traditional Czech cuisine, and soak in centuries of art and architecture.",
      duration: "4 Days / 3 Nights",
      price: 999,
      image: "/images/european-city.png",
      highlights: ["Castle Tour", "River Cruise", "Beer Tasting", "Old Town Walk"],
      createdBy: admin.id,
    },
  ];

  for (const routine of routines) {
    await storage.createRoutine(routine);
  }
}
