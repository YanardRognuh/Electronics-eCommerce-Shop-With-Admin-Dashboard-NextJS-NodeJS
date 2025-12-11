// Script to check available categories in your database
// Run this in your backend console or as a script

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkCategories() {
  console.log("📋 Checking available categories...\n");

  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  if (categories.length === 0) {
    console.log("❌ No categories found in database!");
    console.log("You need to seed categories first.\n");
    return;
  }

  console.log(`✅ Found ${categories.length} categories:\n`);

  // Create a mapping table
  console.log("Category Mapping for CSV:");
  console.log("=".repeat(80));
  console.log("Name".padEnd(40) + "ID");
  console.log("-".repeat(80));

  categories.forEach((cat) => {
    console.log(cat.name.padEnd(40) + cat.id);
  });

  console.log("=".repeat(80));
  console.log("\n📝 Copy the IDs above and use them in your CSV file!");

  // Suggest mapping based on common category names
  console.log("\n💡 Suggested mapping (update your CSV):");
  console.log("-".repeat(80));

  const commonMappings = {
    electronics: ["Electronics", "Electronic", "Tech", "Gadgets"],
    laptops: ["Laptops", "Laptop", "Computers", "PC"],
    audio: ["Audio", "Headphones", "Speakers", "Sound"],
    televisions: ["Televisions", "TV", "Television", "TVs"],
    cameras: ["Cameras", "Camera", "Photography", "Photo"],
  };

  Object.keys(commonMappings).forEach((csvName) => {
    const matchingCat = categories.find((cat) =>
      commonMappings[csvName].some((name) =>
        cat.name.toLowerCase().includes(name.toLowerCase())
      )
    );

    if (matchingCat) {
      console.log(`"${csvName}" → "${matchingCat.id}" (${matchingCat.name})`);
    } else {
      console.log(`"${csvName}" → ⚠️  NO MATCH FOUND`);
    }
  });

  console.log("-".repeat(80));

  await prisma.$disconnect();
}

checkCategories().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
