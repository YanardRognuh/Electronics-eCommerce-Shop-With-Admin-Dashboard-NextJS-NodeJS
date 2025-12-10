/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command untuk login user
       * @example cy.login('user@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>;

      /**
       * Custom command untuk login sebagai user default
       * @example cy.loginAsUser()
       */
      loginAsUser(): Chainable<void>;

      /**
       * Custom command untuk login sebagai admin
       * @example cy.loginAsAdmin()
       */
      loginAsAdmin(): Chainable<void>;

      /**
       * Custom command untuk register user baru
       * @example cy.registerUser('John', 'Doe', 'john@example.com', 'password123')
       */
      registerUser(
        name: string,
        lastname: string,
        email: string,
        password: string
      ): Chainable<void>;

      /**
       * Custom command untuk logout
       * @example cy.logout()
       */
      logout(): Chainable<void>;

      /**
       * Custom command untuk search produk
       * @example cy.searchProduct('laptop')
       */
      searchProduct(query: string): Chainable<void>;

      /**
       * Custom command untuk add product to cart
       * @example cy.addToCart(productId)
       */
      addToCart(productId?: string): Chainable<void>;

      /**
       * Custom command untuk clear cart
       * @example cy.clearCart()
       */
      clearCart(): Chainable<void>;

      /**
       * Custom command untuk verify cart quantity
       * @example cy.verifyCartQuantity(3)
       */
      verifyCartQuantity(quantity: number): Chainable<void>;

      /**
       * Custom command untuk go to single product page
       * @example cy.goToProductPage('smartphone-x')
       */
      goToProductPage(productSlug: string): Chainable<void>;

      /**
       * Custom command untuk select product quantity
       * @example cy.selectQuantity(5)
       */
      selectQuantity(quantity: number): Chainable<void>;

      /**
       * Custom command untuk fill checkout form
       * @example cy.fillCheckoutForm({name: 'John', email: 'john@example.com'})
       */
      fillCheckoutForm(formData: CheckoutFormData): Chainable<void>;

      /**
       * Custom command untuk clear Test category Admin
       * @example cy.clearTestCategory()
       */
      clearTestCategory(): Chainable<void>;

      /**
       * Custom command untuk clear Test Merchant
       * Command ini akan menghapus semua merchant test yang dibuat selama testing
       * kecuali Demo Merchant yang merupakan data seed
       * @example cy.clearTestMerchant()
       */
      clearTestMerchant(): Chainable<void>;

      resetDemoMerchant(): Chainable<void>;

      clearTestBulkUploadBatches(): Chainable<void>;
      clearBulkUploadTestProducts(): Chainable<void>;
      /**
       * Custom command untuk clear Test user Admin
       * @example cy.clearTestCategory()
       */
      clearTestUser(): Chainable<void>;

      /**
       * Custom command untuk wait for page load
       * @example cy.waitForPageLoad()
       */
      waitForPageLoad(): Chainable<void>;

      /**
       * Custom command untuk check if element is visible with retry
       * @example cy.checkVisibility('[data-testid="hero-container"]')
       */
      checkVisibility(selector: string, timeout?: number): Chainable<void>;
    }
  }
}

interface CheckoutFormData {
  name: string;
  lastname: string;
  phone: string;
  email: string;
  company?: string;
  address: string;
  apartment?: string;
  city: string;
  country: string;
  postalCode: string;
  orderNotice?: string;
}

// ============================================================================
// AUTHENTICATION COMMANDS
// ============================================================================

Cypress.Commands.add("login", (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit("/login");
    // Kurangi waktu tunggu dari 1000ms menjadi 500ms
    cy.wait(500);

    cy.get('[data-testid="login-email-input"]').clear().type(email);
    cy.get('[data-testid="login-password-input"]').clear().type(password);
    cy.get('[data-testid="login-submit-button"]').click();

    // Verify redirect after successful login
    cy.url().should("not.include", "/login");
    // Kurangi waktu tunggu dari 500ms menjadi 200ms
    cy.wait(200);
  });
});

Cypress.Commands.add("loginAsUser", () => {
  cy.login(Cypress.env("EMAIL_USER"), Cypress.env("PASSWORD_USER"));
});

Cypress.Commands.add("loginAsAdmin", () => {
  cy.login(Cypress.env("EMAIL_ADMIN"), Cypress.env("PASSWORD_ADMIN"));
});

Cypress.Commands.add(
  "registerUser",
  (name: string, lastname: string, email: string, password: string) => {
    cy.visit("/register");
    // Kurangi waktu tunggu dari 1000ms menjadi 500ms
    cy.wait(500);

    cy.get('[data-testid="register-name-input"]').clear().type(name);
    cy.get('[data-testid="register-lastname-input"]').clear().type(lastname);
    cy.get('[data-testid="register-email-input"]').clear().type(email);
    cy.get('[data-testid="register-password-input"]').clear().type(password);
    cy.get('[data-testid="register-confirm-password-input"]')
      .clear()
      .type(password);
    cy.get('[data-testid="register-terms-checkbox"]').check();
    cy.get('[data-testid="register-submit-button"]').click();
  }
);

Cypress.Commands.add("logout", () => {
  // Check if admin or user
  cy.get("body").then(($body) => {
    if ($body.find('[data-testid="admin-user-profile-trigger"]').length > 0) {
      // Admin logout
      cy.get('[data-testid="admin-user-profile-trigger"]').click();
      cy.get('[data-testid="admin-logout-link"]').click();
    } else {
      // User logout - implement based on your app's logout mechanism
      cy.clearCookies();
      cy.clearLocalStorage();
    }
  });

  // Verify logout
  cy.location("pathname").should("eq", "/login");
});

// ============================================================================
// NAVIGATION COMMANDS
// ============================================================================

Cypress.Commands.add("searchProduct", (query: string) => {
  cy.get('[data-testid="search-input-field"]').clear().type(query);
  cy.get('[data-testid="search-submit-button"]').click();
  cy.url().should("include", "/search");
});

Cypress.Commands.add("goToProductPage", (productSlug: string) => {
  cy.visit(`/product/${productSlug}`);
  // Kurangi waktu tunggu dari 1000ms menjadi 300ms
  cy.wait(300);
  cy.get('[data-testid="single-product-page-container"]').should("be.visible");
});

// ============================================================================
// CART COMMANDS
// ============================================================================

Cypress.Commands.add("addToCart", (productId?: string) => {
  if (productId) {
    cy.get(`[data-testid="product-item-${productId}"]`).within(() => {
      cy.get(`[data-testid="view-product-link-${productId}"]`).click();
    });
  }

  // Assuming we're on product page
  cy.get('[data-testid="single-product-page-container"]').should("be.visible");

  // Find and click Add to Cart button
  cy.contains("button", /add to cart/i).click();

  // Kurangi waktu tunggu dari 1000ms menjadi 500ms
  cy.wait(500);
});

Cypress.Commands.add("clearCart", () => {
  cy.visit("/cart");
  // Kurangi waktu tunggu dari 1000ms menjadi 300ms
  cy.wait(300);

  cy.get("body").then(($body) => {
    if ($body.find('[data-testid^="remove-item-button-"]').length > 0) {
      // Remove all items
      cy.get('[data-testid^="remove-item-button-"]').each(($btn) => {
        cy.wrap($btn).click();
        // Kurangi waktu tunggu dari 500ms menjadi 200ms
        cy.wait(200);
      });
    }
  });
});

Cypress.Commands.add("verifyCartQuantity", (quantity: number) => {
  if (quantity === 0) {
    cy.get('[data-testid="cart-quantity-badge"]').should("not.exist");
  } else {
    cy.get('[data-testid="cart-quantity-badge"]')
      .should("be.visible")
      .and("contain", quantity.toString());
  }
});

// ============================================================================
// PRODUCT COMMANDS
// ============================================================================

Cypress.Commands.add("selectQuantity", (quantity: number) => {
  const currentQuantity = 1;
  const clicksNeeded = quantity - currentQuantity;

  if (clicksNeeded > 0) {
    for (let i = 0; i < clicksNeeded; i++) {
      cy.get('[data-testid="quantity-increment-button"]').click();
      // Kurangi waktu tunggu dari 200ms menjadi 100ms
      cy.wait(200);
    }
  } else if (clicksNeeded < 0) {
    for (let i = 0; i < Math.abs(clicksNeeded); i++) {
      cy.get('[data-testid="quantity-decrement-button"]').click();
      // Kurangi waktu tunggu dari 200ms menjadi 100ms
      cy.wait(200);
    }
  }

  cy.get('[data-testid="quantity-display-input"]').should(
    "have.value",
    quantity.toString()
  );
});

// ============================================================================
// CHECKOUT COMMANDS
// ============================================================================

Cypress.Commands.add("fillCheckoutForm", (formData: CheckoutFormData) => {
  cy.get('[data-testid="checkout-name-input"]').clear().type(formData.name);
  cy.get('[data-testid="checkout-lastname-input"]')
    .clear()
    .type(formData.lastname);
  cy.get('[data-testid="checkout-phone-input"]').clear().type(formData.phone);
  cy.get('[data-testid="checkout-email-input"]').clear().type(formData.email);

  if (formData.company) {
    cy.get('[data-testid="checkout-company-input"]')
      .clear()
      .type(formData.company);
  }

  cy.get('[data-testid="checkout-address-input"]')
    .clear()
    .type(formData.address);

  if (formData.apartment) {
    cy.get('[data-testid="checkout-apartment-input"]')
      .clear()
      .type(formData.apartment);
  }

  cy.get('[data-testid="checkout-city-input"]').clear().type(formData.city);
  cy.get('[data-testid="checkout-country-input"]')
    .clear()
    .type(formData.country);
  cy.get('[data-testid="checkout-postal-code-input"]')
    .clear()
    .type(formData.postalCode);

  if (formData.orderNotice) {
    cy.get('[data-testid="checkout-order-notice-input"]')
      .clear()
      .type(formData.orderNotice);
  }
});

// ============================================================================
// UTILITY COMMANDS
// ============================================================================

Cypress.Commands.add("waitForPageLoad", () => {
  cy.get("body").should("be.visible");
  cy.wait(1000);
});

Cypress.Commands.add("checkVisibility", (selector: string, timeout = 5000) => {
  // Kurangi timeout default dari 10000ms menjadi 5000ms
  cy.get(selector, { timeout }).should("be.visible");
});

// Prevent TypeScript error
export {};

Cypress.Commands.add("clearTestCategory", () => {
  // Ambil semua kategori
  cy.request("GET", "http://localhost:3001/api/categories").then((response) => {
    const testCategories = response.body.filter((cat: any) =>
      cat.name.startsWith("Test ")
    );

    // Hapus satu per satu via API
    testCategories.forEach((cat: any) => {
      cy.request({
        method: "DELETE",
        url: `http://localhost:3001/api/categories/${cat.id}`,
        failOnStatusCode: false, // abaikan error jika sudah dihapus
      });
    });
  });
});

Cypress.Commands.add("clearTestUser", () => {
  cy.request({
    method: "GET",
    url: `http://localhost:3001/api/users`,
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 200) {
      const testUsers = response.body.filter(
        (user: any) =>
          typeof user.email === "string" &&
          user.email.includes("@example.com") &&
          user.email !== "admin@example.com" &&
          user.email !== "user@example.com"
      );

      testUsers.forEach((user: any) => {
        cy.request({
          method: "DELETE",
          url: `http://localhost:3001/api/users/${user.id}`,
          failOnStatusCode: false,
        });
      });
    }
  });
});

Cypress.Commands.add("clearTestMerchant", () => {
  cy.request({
    method: "GET",
    url: `http://localhost:3001/api/merchants`,
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 200 && Array.isArray(response.body)) {
      // Filter merchant yang merupakan test data
      // Exclude Demo Merchant (id: "1" atau name: "Demo Merchant")
      const testMerchants = response.body.filter(
        (merchant: any) =>
          // Jangan hapus merchant dengan id "1" (Demo Merchant seed data)
          merchant.id !== "1" &&
          // Filter berdasarkan pattern name test
          typeof merchant.name === "string" &&
          (merchant.name.includes("Test Merchant") ||
            merchant.name.includes("Updated Merchant") ||
            merchant.name.includes("Delete Test"))
      );

      cy.log(`Found ${testMerchants.length} test merchant(s) to delete`);

      // Hapus setiap test merchant
      testMerchants.forEach((merchant: any) => {
        cy.log(`Deleting merchant: ${merchant.name} (ID: ${merchant.id})`);
        cy.request({
          method: "DELETE",
          url: `http://localhost:3001/api/merchants/${merchant.id}`,
          failOnStatusCode: false,
        }).then((deleteResponse) => {
          if (deleteResponse.status === 200) {
            cy.log(`Successfully deleted merchant ID: ${merchant.id}`);
          }
        });
      });
    }
  });
});

Cypress.Commands.add("resetDemoMerchant", () => {
  cy.request({
    method: "PUT",
    url: `http://localhost:3001/api/merchants/1`,
    failOnStatusCode: false,
    body: {
      name: "Demo Merchant",
      description: "This is demo merchant description",
      email: "merchant@example.com",
      phone: "1234567890",
      address: "123 Demo St, Demo City, DM 12345",
      status: "active",
    },
  });
});

Cypress.Commands.add("clearTestBulkUploadBatches", () => {
  cy.request({
    method: "GET",
    url: `http://localhost:3001/api/bulk-upload`,
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 200 && response.body?.batches) {
      const batches = response.body.batches;
      cy.log(`Found ${batches.length} batch(es) in upload history`);

      // Filter test batches (batches yang dibuat dari test file)
      const testBatches = batches.filter((batch: any) => {
        // Filter berdasarkan filename yang mengandung "bulk-upload-example" atau "test"
        const isTestFile =
          typeof batch.fileName === "string" &&
          (batch.fileName.includes("bulk-upload-example") ||
            batch.fileName.includes("test-") ||
            batch.fileName.includes("bulk-upload-invalid") ||
            batch.fileName.includes("bulk-upload-duplicate") ||
            batch.fileName.includes("bulk-upload-empty") ||
            batch.fileName.includes("bulk-upload-large") ||
            batch.fileName.toLowerCase().includes("test"));

        // Filter berdasarkan uploadedAt yang recent (dalam 2 jam terakhir)
        // untuk menghindari menghapus batch yang legitimate
        const isRecent =
          new Date().getTime() - new Date(batch.uploadedAt).getTime() < 7200000; // 2 hours

        return isTestFile && isRecent;
      });

      cy.log(`Found ${testBatches.length} test batch(es) to delete`);

      // Hapus setiap test batch beserta products-nya
      testBatches.forEach((batch: any) => {
        cy.log(
          `Deleting batch: ${batch.fileName} (ID: ${batch.id}) with ${
            batch.successfulRecords || 0
          } products`
        );

        // Delete batch with products using deleteProducts query param
        cy.request({
          method: "DELETE",
          url: `http://localhost:3001/api/bulk-upload/${batch.id}?deleteProducts=true`,
          failOnStatusCode: false,
        }).then((deleteResponse) => {
          if (deleteResponse.status === 200) {
            cy.log(
              `✅ Successfully deleted batch ID: ${batch.id} with products`
            );
          } else if (deleteResponse.status === 409) {
            // Products are in orders, delete batch only
            cy.log(
              `⚠️ Products in orders, deleting batch only for ID: ${batch.id}`
            );

            cy.request({
              method: "DELETE",
              url: `http://localhost:3001/api/bulk-upload/${batch.id}?deleteProducts=false`,
              failOnStatusCode: false,
            }).then((retryResponse) => {
              if (retryResponse.status === 200) {
                cy.log(
                  `✅ Successfully deleted batch ID (products kept): ${batch.id}`
                );
              }
            });
          } else if (deleteResponse.status === 404) {
            cy.log(`⚠️ Batch not found: ${batch.id}`);
          }
        });
      });
    }
  });
});

Cypress.Commands.add("clearBulkUploadTestProducts", () => {
  cy.request({
    method: "GET",
    url: `http://localhost:3001/api/products`,
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 200 && Array.isArray(response.body)) {
      // Filter products dari bulk upload test berdasarkan slug patterns
      const testProducts = response.body.filter((product: any) => {
        // Filter berdasarkan slug atau title dari CSV test
        const testSlugs = [
          "samsung-galaxy-s24-ultra",
          "apple-macbook-pro-16-m3",
          "sony-wh-1000xm5-headphones",
          "lg-oled-c3-55-smart-tv",
          "canon-eos-r6-mark-ii-camera",
          "test-no-price",
          "test-no-title",
          "test-invalid-stock",
          "duplicate-slug-test",
          "test-invalid-types",
          "test-special-chars",
        ];

        // Check slug
        const hasTestSlug =
          typeof product.slug === "string" &&
          (testSlugs.includes(product.slug) ||
            product.slug.startsWith("test-product-bulk-") ||
            product.slug.startsWith("test-large-") ||
            product.slug.startsWith("test-product-"));

        // Check title patterns
        const hasTestTitle =
          typeof product.title === "string" &&
          (product.title.includes("Samsung Galaxy S24") ||
            product.title.includes("MacBook Pro 16") ||
            product.title.includes("WH-1000XM5") ||
            product.title.includes("LG OLED C3") ||
            product.title.includes("Canon EOS R6") ||
            product.title.startsWith("Test Product"));

        return hasTestSlug || hasTestTitle;
      });

      cy.log(`Found ${testProducts.length} test product(s) to delete`);

      testProducts.forEach((product: any) => {
        cy.log(`Deleting product: ${product.title} (ID: ${product.id})`);
        cy.request({
          method: "DELETE",
          url: `http://localhost:3001/api/products/${product.id}`,
          failOnStatusCode: false,
        }).then((deleteResponse) => {
          if (deleteResponse.status === 200 || deleteResponse.status === 204) {
            cy.log(`✅ Successfully deleted product ID: ${product.id}`);
          } else if (deleteResponse.status === 400) {
            cy.log(
              `⚠️ Cannot delete product ID ${product.id} - may be in orders`
            );
          }
        });
      });
    }
  });
});
