const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Helper function untuk validasi email
function isValidEmail(email) {
  if (!email) return true; // Email optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function untuk validasi status
function isValidStatus(status) {
  const validStatuses = ["active", "inactive", "ACTIVE", "INACTIVE"];
  return validStatuses.includes(status);
}

async function getAllMerchants(request, response) {
  try {
    const merchants = await prisma.merchant.findMany({
      include: {
        products: true,
      },
    });
    return response.json(merchants);
  } catch (error) {
    console.error("Error fetching merchants:", error);
    return response.status(500).json({ error: "Error fetching merchants" });
  }
}

async function getMerchantById(request, response) {
  try {
    const { id } = request.params;
    const merchant = await prisma.merchant.findUnique({
      where: {
        id: id,
      },
      include: {
        products: true,
      },
    });

    if (!merchant) {
      return response.status(404).json({ error: "Merchant not found" });
    }

    return response.json(merchant);
  } catch (error) {
    console.error("Error fetching merchant:", error);
    return response.status(500).json({ error: "Error fetching merchant" });
  }
}

async function createMerchant(request, response) {
  try {
    const { name, email, phone, address, description, status } = request.body;

    // Validasi required fields
    if (!name || !name.trim()) {
      return response.status(400).json({ error: "Name is required" });
    }

    // Validasi email format
    if (email && !isValidEmail(email)) {
      return response.status(400).json({ error: "Invalid email format" });
    }

    // Validasi status
    const merchantStatus = status || "active";
    if (!isValidStatus(merchantStatus)) {
      return response.status(400).json({
        error: "Invalid status. Must be 'active' or 'inactive'",
      });
    }

    const merchant = await prisma.merchant.create({
      data: {
        name: name.trim(),
        email: email?.trim() || "",
        phone: phone?.trim() || "",
        address: address?.trim() || "",
        description: description?.trim() || "",
        status: merchantStatus.toLowerCase(),
      },
    });

    return response.status(201).json(merchant);
  } catch (error) {
    console.error("Error creating merchant:", error);

    // Handle Prisma unique constraint error
    if (error.code === "P2002") {
      return response.status(409).json({
        error: "Merchant with this email already exists",
      });
    }

    return response.status(500).json({ error: "Error creating merchant" });
  }
}

async function updateMerchant(request, response) {
  try {
    const { id } = request.params;
    const { name, email, phone, address, description, status } = request.body;

    // Check if merchant exists
    const existingMerchant = await prisma.merchant.findUnique({
      where: { id },
    });

    if (!existingMerchant) {
      return response.status(404).json({ error: "Merchant not found" });
    }

    // Validasi name jika dikirim
    if (name !== undefined && (!name || !name.trim())) {
      return response.status(400).json({ error: "Name cannot be empty" });
    }

    // Validasi email format jika dikirim
    if (email !== undefined && email && !isValidEmail(email)) {
      return response.status(400).json({ error: "Invalid email format" });
    }

    // Validasi status jika dikirim
    if (status !== undefined && !isValidStatus(status)) {
      return response.status(400).json({
        error: "Invalid status. Must be 'active' or 'inactive'",
      });
    }

    // Build update data - hanya update field yang dikirim
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (email !== undefined) updateData.email = email.trim();
    if (phone !== undefined) updateData.phone = phone.trim();
    if (address !== undefined) updateData.address = address.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (status !== undefined) updateData.status = status.toLowerCase();

    const merchant = await prisma.merchant.update({
      where: { id },
      data: updateData,
    });

    return response.json(merchant);
  } catch (error) {
    console.error("Error updating merchant:", error);

    // Handle Prisma errors
    if (error.code === "P2002") {
      return response.status(409).json({
        error: "Merchant with this email already exists",
      });
    }

    if (error.code === "P2025") {
      return response.status(404).json({ error: "Merchant not found" });
    }

    return response.status(500).json({ error: "Error updating merchant" });
  }
}

async function deleteMerchant(request, response) {
  try {
    const { id } = request.params;

    // Check if merchant exists and has products
    const merchant = await prisma.merchant.findUnique({
      where: { id },
      include: {
        products: {
          select: { id: true }, // Only select id for performance
        },
      },
    });

    if (!merchant) {
      return response.status(404).json({ error: "Merchant not found" });
    }

    // OPTION 1: Prevent deletion if has products (Current behavior)
    if (merchant.products.length > 0) {
      return response.status(400).json({
        error: "Cannot delete merchant with existing products",
        details: `Merchant has ${merchant.products.length} product(s)`,
      });
    }

    // OPTION 2: Cascade delete products (Uncomment if you want this behavior)
    // await prisma.product.deleteMany({
    //   where: { merchantId: id }
    // });

    await prisma.merchant.delete({
      where: { id },
    });

    return response.status(204).send();
  } catch (error) {
    console.error("Error deleting merchant:", error);

    // Handle Prisma errors
    if (error.code === "P2025") {
      return response.status(404).json({ error: "Merchant not found" });
    }

    if (error.code === "P2003") {
      return response.status(400).json({
        error: "Cannot delete merchant due to related records",
      });
    }

    return response.status(500).json({ error: "Error deleting merchant" });
  }
}

module.exports = {
  getAllMerchants,
  getMerchantById,
  createMerchant,
  updateMerchant,
  deleteMerchant,
};
