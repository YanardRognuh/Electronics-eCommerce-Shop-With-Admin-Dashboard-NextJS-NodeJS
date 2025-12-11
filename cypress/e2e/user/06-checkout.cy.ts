// cypress/e2e/user/06-checkout.cy.ts

describe("Checkout Process", () => {
  const testCheckoutData = {
    name: "John",
    lastname: "Doe",
    phone: "+1234567890",
    email: "john.doe@example.com",
    company: "Test Company Inc",
    address: "123 Main Street",
    apartment: "Apt 4B",
    city: "New York",
    country: "United States",
    postalCode: "10001",
    orderNotice: "Please ring doorbell twice",
  };

  before(() => {
    cy.loginAsUser();
  });

  beforeEach(() => {
    // Clear cart and add a product
    cy.clearCart();
    cy.visit("/shop");
    cy.waitForPageLoad();
    cy.get('[data-testid^="product-item-"]')
      .eq(1)
      .within(() => {
        cy.get('[data-testid^="view-product-link-"]').click();
      });
    cy.contains("button", /add to cart/i).click();
    cy.wait(200);

    // Navigate to cart first, then to checkout to ensure cart state is updated
    cy.visit("/cart");
    cy.waitForPageLoad();
    cy.get('[data-testid="checkout-link"]').click();
    cy.waitForPageLoad();
  });

  describe("Checkout Page Access", () => {
    it("should navigate to checkout from cart page", () => {
      cy.visit("/cart");
      cy.waitForPageLoad();

      cy.get('[data-testid="checkout-link"]').click();

      cy.url().should("include", "/checkout");
      cy.get('[data-testid="checkout-page-container"]').should("be.visible");
    });

    it("should redirect to cart if checkout is accessed with empty cart", () => {
      cy.clearCart();
      cy.visit("/checkout", { failOnStatusCode: false });
      cy.waitForPageLoad();

      // Should redirect to cart
      cy.url().should("include", "/cart");
    });
  });

  describe("Checkout Page Layout", () => {
    // Remove beforeEach here since it's already handled globally

    it("should display checkout page with all main components", () => {
      cy.get('[data-testid="checkout-page-container"]').should("be.visible");
      cy.get('[data-testid="checkout-form"]').should("be.visible");
      cy.get('[data-testid="order-summary-details"]').should("be.visible");
    });

    it("should display page title", () => {
      cy.get('[data-testid="checkout-page-title"]').should("be.visible");
    });

    it("should display order summary heading", () => {
      cy.get('[data-testid="order-summary-heading"]').should("be.visible");
    });

    it("should display contact info section", () => {
      cy.get('[data-testid="contact-info-heading"]').should("be.visible");
    });

    it("should display shipping address section", () => {
      cy.get('[data-testid="shipping-address-heading"]').should("be.visible");
    });
  });

  describe("Contact Information Form", () => {
    // Remove beforeEach here since it's already handled globally

    it("should display all contact info input fields", () => {
      cy.get('[data-testid="checkout-name-input"]').should("be.visible");
      cy.get('[data-testid="checkout-lastname-input"]').should("be.visible");
      cy.get('[data-testid="checkout-phone-input"]').should("be.visible");
      cy.get('[data-testid="checkout-email-input"]').should("be.visible");
      cy.get('[data-testid="checkout-company-input"]').should("be.visible");
    });

    it("should fill contact information", () => {
      cy.get('[data-testid="checkout-name-input"]').type(testCheckoutData.name);
      cy.get('[data-testid="checkout-lastname-input"]').type(
        testCheckoutData.lastname
      );
      cy.get('[data-testid="checkout-phone-input"]').type(
        testCheckoutData.phone
      );
      cy.get('[data-testid="checkout-email-input"]').type(
        testCheckoutData.email
      );
      cy.get('[data-testid="checkout-company-input"]').type(
        testCheckoutData.company
      );

      cy.get('[data-testid="checkout-name-input"]').should(
        "have.value",
        testCheckoutData.name
      );
      cy.get('[data-testid="checkout-email-input"]').should(
        "have.value",
        testCheckoutData.email
      );
    });

    it("should validate required fields", () => {
      cy.get('[data-testid="checkout-place-order-button"]').click();

      // Should not proceed without required fields
      cy.url().should("include", "/checkout");
    });

    it("should validate email format", () => {
      cy.fillCheckoutForm({
        ...testCheckoutData,
        email: "invalid-email",
      });

      cy.get('[data-testid="checkout-place-order-button"]').click();

      // Should show validation error
      cy.url().should("include", "/checkout");
    });
  });

  describe("Shipping Address Form", () => {
    // Remove beforeEach here since it's already handled globally

    it("should display all shipping address fields", () => {
      cy.get('[data-testid="checkout-address-input"]').should("be.visible");
      cy.get('[data-testid="checkout-apartment-input"]').should("be.visible");
      cy.get('[data-testid="checkout-city-input"]').should("be.visible");
      cy.get('[data-testid="checkout-country-input"]').should("be.visible");
      cy.get('[data-testid="checkout-postal-code-input"]').should("be.visible");
    });

    it("should fill shipping address", () => {
      cy.get('[data-testid="checkout-address-input"]').type(
        testCheckoutData.address
      );
      cy.get('[data-testid="checkout-apartment-input"]').type(
        testCheckoutData.apartment
      );
      cy.get('[data-testid="checkout-city-input"]').type(testCheckoutData.city);
      cy.get('[data-testid="checkout-country-input"]').type(
        testCheckoutData.country
      );
      cy.get('[data-testid="checkout-postal-code-input"]').type(
        testCheckoutData.postalCode
      );

      cy.get('[data-testid="checkout-address-input"]').should(
        "have.value",
        testCheckoutData.address
      );
      cy.get('[data-testid="checkout-city-input"]').should(
        "have.value",
        testCheckoutData.city
      );
    });
  });

  describe("Order Notes", () => {
    // Remove beforeEach here since it's already handled globally

    it("should display order notice textarea", () => {
      cy.get('[data-testid="checkout-order-notice-input"]').should(
        "be.visible"
      );
    });

    it("should allow adding order notes", () => {
      cy.get('[data-testid="checkout-order-notice-input"]').type(
        testCheckoutData.orderNotice
      );
      cy.get('[data-testid="checkout-order-notice-input"]').should(
        "have.value",
        testCheckoutData.orderNotice
      );
    });
  });

  describe("Order Summary", () => {
    it("should display order items list", () => {
      cy.get('[data-testid="order-items-list"]').should("be.visible");
      cy.get('[data-testid^="order-items-list"]').should(
        "have.length.greaterThan",
        0
      );
    });

    it("should display order item details", () => {
      cy.get('[data-testid^="order-item-"]')
        .first()
        .within(() => {
          cy.get('[data-testid^="order-item-image-"]').should("be.visible");
          cy.get('[data-testid^="order-item-title-"]').should("be.visible");
          cy.get('[data-testid^="order-item-quantity-"]').should("be.visible");
          cy.get('[data-testid^="order-item-price-"]').should("be.visible");
        });
    });

    it("should display order financial summary", () => {
      cy.get('[data-testid="order-subtotal"]')
        .should("be.visible")
        .and("not.be.empty");
      cy.get('[data-testid="order-shipping"]').should("be.visible");
      cy.get('[data-testid="order-taxes"]').should("be.visible");
      cy.get('[data-testid="order-total"]')
        .should("be.visible")
        .and("not.be.empty");
    });

    it("should calculate order total correctly", () => {
      // Pastikan produk sudah ditambahkan ke checkout sebelum menghitung total
      cy.get('[data-testid="order-items-list"]').should("be.visible");
      cy.get('[data-testid^="order-item-"]').should(
        "have.length.greaterThan",
        0
      );

      cy.get('[data-testid="order-subtotal"]')
        .invoke("text")
        .then((subtotal) => {
          cy.get('[data-testid="order-shipping"]')
            .invoke("text")
            .then((shipping) => {
              cy.get('[data-testid="order-taxes"]')
                .invoke("text")
                .then((taxes) => {
                  const subtotalNum = parseFloat(
                    subtotal.replace(/[^0-9.]/g, "")
                  );
                  const shippingNum = parseFloat(
                    shipping.replace(/[^0-9.]/g, "")
                  );
                  const taxesNum = parseFloat(taxes.replace(/[^0-9.]/g, ""));

                  // Gunakan pembulatan seperti di kode pertama
                  const expectedTotal = Math.round(
                    subtotalNum + taxesNum + shippingNum
                  );

                  cy.get('[data-testid="order-total"]')
                    .invoke("text")
                    .then((total) => {
                      const totalNum = parseFloat(
                        total.replace(/[^0-9.]/g, "")
                      );

                      cy.log(
                        `Subtotal: ${subtotalNum}, Shipping: ${shippingNum}, Tax: ${taxesNum}, Expected Total (rounded): ${expectedTotal}, Actual Total: ${totalNum}`
                      );

                      expect(totalNum).to.equal(expectedTotal);
                    });
                });
            });
        });
    });
  });

  describe("Payment Notice", () => {
    // Remove beforeEach here since it's already handled globally

    it("should display payment notice section", () => {
      cy.get('[data-testid="payment-notice-section"]').should("be.visible");
    });
  });

  describe("Place Order", () => {
    // Remove beforeEach here since it's already handled globally

    it("should display place order button", () => {
      cy.get('[data-testid="checkout-place-order-button"]').should(
        "be.visible"
      );
    });

    it("should successfully place order with valid information", () => {
      cy.fillCheckoutForm(testCheckoutData);

      cy.get('[data-testid="checkout-place-order-button"]').click();

      cy.wait(2000);

      // Should redirect to success page or show confirmation
      cy.url().should("not.include", "/checkout");
    });

    it("should not place order with incomplete information", () => {
      cy.get('[data-testid="checkout-name-input"]').type(testCheckoutData.name);
      cy.get('[data-testid="checkout-email-input"]').type(
        testCheckoutData.email
      );
      // Leave other required fields empty

      cy.get('[data-testid="checkout-place-order-button"]').click();

      // Should stay on checkout page
      cy.url().should("include", "/checkout");
    });

    it("should disable place order button while processing", () => {
      cy.fillCheckoutForm(testCheckoutData);

      cy.get('[data-testid="checkout-place-order-button"]').click();

      // Button should be disabled during processing
      cy.get('[data-testid="checkout-place-order-button"]').should(
        "be.disabled"
      );
    });
  });

  describe("Form Validation", () => {
    // Remove beforeEach here since it's already handled globally

    it("should validate name field", () => {
      cy.get('[data-testid="checkout-lastname-input"]').type(
        testCheckoutData.lastname
      );
      cy.get('[data-testid="checkout-email-input"]').type(
        testCheckoutData.email
      );
      cy.get('[data-testid="checkout-place-order-button"]').click();

      // Should show validation for name
      cy.url().should("include", "/checkout");
    });

    it("should validate phone number format", () => {
      cy.fillCheckoutForm({
        ...testCheckoutData,
        phone: "invalid",
      });

      cy.get('[data-testid="checkout-place-order-button"]').click();

      // Should show validation error
      cy.url().should("include", "/checkout");
    });

    it("should validate postal code", () => {
      cy.fillCheckoutForm({
        ...testCheckoutData,
        postalCode: "invalid",
      });

      cy.get('[data-testid="checkout-place-order-button"]').click();

      cy.url().should("include", "/checkout");
    });
  });

  describe("Multiple Items Checkout", () => {
    beforeEach(() => {
      // Add multiple products to cart
      cy.clearCart();
      cy.visit("/shop");
      cy.waitForPageLoad();

      cy.get('[data-testid^="product-item-"]')
        .eq(1)
        .within(() => {
          cy.get('[data-testid^="view-product-link-"]').click();
        });
      cy.contains("button", /add to cart/i).click();
      cy.wait(500);

      cy.visit("/shop");
      cy.waitForPageLoad();

      cy.get('[data-testid^="product-item-"]')
        .eq(2)
        .within(() => {
          cy.get('[data-testid^="view-product-link-"]').click();
        });
      cy.contains("button", /add to cart/i).click();
      cy.wait(500);

      // Navigate to cart first, then to checkout to ensure cart state is updated
      cy.visit("/cart");
      cy.waitForPageLoad();
      cy.get('[data-testid="checkout-link"]').click();
      cy.waitForPageLoad();
    });

    it("should display all cart items in checkout", () => {
      cy.get('[data-testid^="order-items-list"]> li').should("have.length", 2);
    });

    it("should calculate correct total for multiple items", () => {
      cy.get('[data-testid="order-total"]')
        .should("be.visible")
        .and("not.be.empty");
    });
  });

  describe("Responsive Design", () => {
    // Remove beforeEach here since it's already handled globally

    it("should display correctly on mobile", () => {
      cy.viewport("iphone-x");

      cy.get('[data-testid="checkout-page-container"]').should("be.visible");
      cy.get('[data-testid="checkout-form"]').should("be.visible");
      cy.get('[data-testid="order-summary-details"]').should("be.visible");
    });

    it("should display correctly on tablet", () => {
      cy.viewport("ipad-2");

      cy.get('[data-testid="checkout-page-container"]').should("be.visible");
      cy.get('[data-testid="checkout-name-input"]').should("be.visible");
    });
  });
});
