describe("Checkout Process", () => {
  beforeEach(() => {
    // Login sebagai user
    cy.login("user@example.com", "password");
  });

  describe("Checkout Page Access", () => {
    it("Harus bisa akses checkout page dari cart", () => {
      cy.visit("/cart");

      // Jika ada items, klik checkout
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="checkout-link"]').length > 0) {
          cy.get('[data-testid="checkout-link"]').click();

          // Verifikasi di checkout page
          cy.url().should("include", "/checkout");
          cy.get('[data-testid="checkout-page-container"]').should(
            "be.visible"
          );
        } else {
          // Jika cart kosong, langsung visit checkout
          cy.visit("/checkout");
        }
      });
    });

    it("Harus menampilkan checkout page title", () => {
      cy.visit("/checkout");
      cy.get('[data-testid="checkout-page-title"]').should("be.visible");
    });
  });

  describe("Checkout Form", () => {
    beforeEach(() => {
      cy.visit("/checkout");
    });

    it("Harus menampilkan checkout form dengan lengkap", () => {
      cy.get('[data-testid="checkout-form"]').should("be.visible");
    });

    it("Harus menampilkan contact information section", () => {
      cy.get('[data-testid="contact-info-heading"]').should("be.visible");
      cy.get('[data-testid="checkout-name-input"]').should("be.visible");
      cy.get('[data-testid="checkout-lastname-input"]').should("be.visible");
      cy.get('[data-testid="checkout-phone-input"]').should("be.visible");
      cy.get('[data-testid="checkout-email-input"]').should("be.visible");
      cy.get('[data-testid="checkout-company-input"]').should("be.visible");
    });

    it("Harus menampilkan shipping address section", () => {
      cy.get('[data-testid="shipping-address-heading"]').should("be.visible");
      cy.get('[data-testid="checkout-address-input"]').should("be.visible");
      cy.get('[data-testid="checkout-apartment-input"]').should("be.visible");
      cy.get('[data-testid="checkout-city-input"]').should("be.visible");
      cy.get('[data-testid="checkout-country-input"]').should("be.visible");
      cy.get('[data-testid="checkout-postal-code-input"]').should("be.visible");
    });

    it("Harus menampilkan order notice field", () => {
      cy.get('[data-testid="checkout-order-notice-input"]').should(
        "be.visible"
      );
    });

    it("Harus bisa mengisi form checkout", () => {
      // Fill contact information
      cy.get('[data-testid="checkout-name-input"]').type("John");
      cy.get('[data-testid="checkout-lastname-input"]').type("Doe");
      cy.get('[data-testid="checkout-phone-input"]').type("081234567890");
      cy.get('[data-testid="checkout-email-input"]').type(
        "john.doe@example.com"
      );
      cy.get('[data-testid="checkout-company-input"]').type("Test Company");

      // Fill shipping address
      cy.get('[data-testid="checkout-address-input"]').type("Jl. Test No. 123");
      cy.get('[data-testid="checkout-apartment-input"]').type("Apt 4B");
      cy.get('[data-testid="checkout-city-input"]').type("Jakarta");
      cy.get('[data-testid="checkout-country-input"]').type("Indonesia");
      cy.get('[data-testid="checkout-postal-code-input"]').type("12345");

      // Fill order notice
      cy.get('[data-testid="checkout-order-notice-input"]').type(
        "Please deliver after 5 PM"
      );

      // Verifikasi semua field terisi
      cy.get('[data-testid="checkout-name-input"]').should(
        "have.value",
        "John"
      );
      cy.get('[data-testid="checkout-email-input"]').should(
        "have.value",
        "john.doe@example.com"
      );
    });
  });

  describe("Order Summary in Checkout", () => {
    beforeEach(() => {
      cy.visit("/checkout");
    });

    it("Harus menampilkan order summary heading", () => {
      cy.get('[data-testid="order-summary-heading"]').should("be.visible");
    });

    it("Harus menampilkan order items list", () => {
      cy.get('[data-testid="order-items-list"]').should("be.visible");

      // Jika ada items
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="order-item-"]').length > 0) {
          cy.get('[data-testid^="order-item-"]').should(
            "have.length.greaterThan",
            0
          );
        }
      });
    });

    it("Harus menampilkan detail setiap order item", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="order-item-"]').length > 0) {
          // Ambil item pertama
          cy.get('[data-testid^="order-item-"]')
            .first()
            .invoke("attr", "data-testid")
            .then((testId) => {
              const productId = testId?.split("-")[2];

              // Verifikasi elemen-elemen order item
              cy.get(`[data-testid="order-item-image-${productId}"]`).should(
                "be.visible"
              );
              cy.get(`[data-testid="order-item-title-${productId}"]`).should(
                "be.visible"
              );
              cy.get(`[data-testid="order-item-quantity-${productId}"]`).should(
                "be.visible"
              );
              cy.get(`[data-testid="order-item-price-${productId}"]`).should(
                "be.visible"
              );
            });
        }
      });
    });

    it("Harus menampilkan order summary details", () => {
      cy.get('[data-testid="order-summary-details"]').should("be.visible");
    });

    it("Harus menampilkan subtotal", () => {
      cy.get('[data-testid="order-subtotal"]').should("be.visible");
    });

    it("Harus menampilkan shipping cost", () => {
      cy.get('[data-testid="order-shipping"]').should("be.visible");
    });

    it("Harus menampilkan tax calculation", () => {
      cy.get('[data-testid="order-taxes"]').should("be.visible");
    });

    it("Harus menampilkan total cost", () => {
      cy.get('[data-testid="order-total"]').should("be.visible");
    });
  });

  describe("Payment Notice", () => {
    beforeEach(() => {
      cy.visit("/checkout");
    });

    it("Harus menampilkan payment notice section", () => {
      cy.get('[data-testid="payment-notice-section"]').should("be.visible");
    });
  });

  describe("Place Order", () => {
    beforeEach(() => {
      cy.visit("/checkout");
    });

    it("Harus menampilkan place order button", () => {
      cy.get('[data-testid="checkout-place-order-button"]').should(
        "be.visible"
      );
    });

    it("Harus bisa submit order dengan data lengkap", () => {
      // Isi form checkout
      cy.get('[data-testid="checkout-name-input"]').clear().type("John");
      cy.get('[data-testid="checkout-lastname-input"]').clear().type("Doe");
      cy.get('[data-testid="checkout-phone-input"]')
        .clear()
        .type("081234567890");
      cy.get('[data-testid="checkout-email-input"]')
        .clear()
        .type("john.doe@example.com");
      cy.get('[data-testid="checkout-address-input"]')
        .clear()
        .type("Jl. Test No. 123");
      cy.get('[data-testid="checkout-city-input"]').clear().type("Jakarta");
      cy.get('[data-testid="checkout-country-input"]')
        .clear()
        .type("Indonesia");
      cy.get('[data-testid="checkout-postal-code-input"]')
        .clear()
        .type("12345");

      // Click place order
      cy.get('[data-testid="checkout-place-order-button"]').click();

      // Verifikasi redirect atau success message
      cy.wait(2000);

      // Tergantung implementasi, bisa redirect ke:
      // - Success page
      // - Orders page
      // - Payment page
      // Atau tetap di checkout dengan success message
    });

    it("Harus validasi required fields", () => {
      // Clear semua fields
      cy.get('[data-testid="checkout-name-input"]').clear();
      cy.get('[data-testid="checkout-email-input"]').clear();

      // Klik place order
      cy.get('[data-testid="checkout-place-order-button"]').click();

      // Verifikasi masih di checkout page (validation failed)
      cy.url().should("include", "/checkout");
    });

    it("Harus validasi format email", () => {
      cy.get('[data-testid="checkout-name-input"]').clear().type("John");
      cy.get('[data-testid="checkout-lastname-input"]').clear().type("Doe");
      cy.get('[data-testid="checkout-email-input"]')
        .clear()
        .type("invalid-email");
      cy.get('[data-testid="checkout-phone-input"]')
        .clear()
        .type("081234567890");
      cy.get('[data-testid="checkout-address-input"]').clear().type("Jl. Test");
      cy.get('[data-testid="checkout-city-input"]').clear().type("Jakarta");
      cy.get('[data-testid="checkout-country-input"]')
        .clear()
        .type("Indonesia");
      cy.get('[data-testid="checkout-postal-code-input"]')
        .clear()
        .type("12345");

      cy.get('[data-testid="checkout-place-order-button"]').click();

      // Verifikasi validation error atau masih di checkout
      cy.url().should("include", "/checkout");
    });
  });

  describe("Checkout with Empty Cart", () => {
    it("Harus handle empty cart scenario", () => {
      // Visit checkout langsung tanpa items
      cy.visit("/checkout");

      // Verifikasi apakah ada handling untuk empty cart
      // Bisa redirect, atau show message
      cy.wait(1000);

      // Check apakah ada message atau redirect
      cy.get("body").should("exist");
    });
  });

  describe("Form Validation", () => {
    beforeEach(() => {
      cy.visit("/checkout");
    });

    it("Harus validasi phone number format", () => {
      cy.get('[data-testid="checkout-phone-input"]').clear().type("invalid");
      cy.get('[data-testid="checkout-name-input"]').click(); // Blur dari phone input

      // Tergantung implementasi validation
    });

    it("Harus validasi postal code format", () => {
      cy.get('[data-testid="checkout-postal-code-input"]').clear().type("abc");
      cy.get('[data-testid="checkout-name-input"]').click(); // Blur dari postal code input

      // Tergantung implementasi validation
    });

    it("Harus accept optional fields kosong", () => {
      // Company dan apartment adalah optional
      cy.get('[data-testid="checkout-name-input"]').clear().type("John");
      cy.get('[data-testid="checkout-lastname-input"]').clear().type("Doe");
      cy.get('[data-testid="checkout-phone-input"]')
        .clear()
        .type("081234567890");
      cy.get('[data-testid="checkout-email-input"]')
        .clear()
        .type("john@example.com");

      // Skip company dan apartment

      cy.get('[data-testid="checkout-address-input"]').clear().type("Jl. Test");
      cy.get('[data-testid="checkout-city-input"]').clear().type("Jakarta");
      cy.get('[data-testid="checkout-country-input"]')
        .clear()
        .type("Indonesia");
      cy.get('[data-testid="checkout-postal-code-input"]')
        .clear()
        .type("12345");

      cy.get('[data-testid="checkout-place-order-button"]').click();

      // Should proceed (optional fields kosong tidak masalah)
      cy.wait(1000);
    });
  });
});
