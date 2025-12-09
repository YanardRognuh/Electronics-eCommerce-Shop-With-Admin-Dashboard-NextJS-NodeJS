// cypress/support/commands.ts

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
    cy.wait(1000);

    cy.get('[data-testid="login-email-input"]').clear().type(email);
    cy.get('[data-testid="login-password-input"]').clear().type(password);
    cy.get('[data-testid="login-submit-button"]').click();

    // Verify redirect after successful login
    cy.url().should("not.include", "/login");
    cy.wait(500);
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
    cy.wait(1000);

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
  cy.url().should("match", /\/(login)?$/);
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
  cy.wait(1000);
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

  // Wait for cart update
  cy.wait(1000);
});

Cypress.Commands.add("clearCart", () => {
  cy.visit("/cart");
  cy.wait(1000);

  cy.get("body").then(($body) => {
    if ($body.find('[data-testid^="remove-item-button-"]').length > 0) {
      // Remove all items
      cy.get('[data-testid^="remove-item-button-"]').each(($btn) => {
        cy.wrap($btn).click();
        cy.wait(500);
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
      cy.wait(200);
    }
  } else if (clicksNeeded < 0) {
    for (let i = 0; i < Math.abs(clicksNeeded); i++) {
      cy.get('[data-testid="quantity-decrement-button"]').click();
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
  cy.wait(500); // Small delay for Next.js hydration
});

Cypress.Commands.add("checkVisibility", (selector: string, timeout = 10000) => {
  cy.get(selector, { timeout }).should("be.visible");
});

// Prevent TypeScript error
export {};
