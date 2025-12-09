// cypress/e2e/user/04-product-detail.cy.ts

describe("Product Detail Page", () => {
  before(() => {
    cy.loginAsUser();
  });

  beforeEach(() => {
    // Navigate to a product via shop page to ensure valid product
    cy.visit("/shop");
    cy.waitForPageLoad();

    // Pilih produk kedua jika produk pertama out of stock
    cy.get('[data-testid^="product-item-"]')
      .eq(1)
      .within(() => {
        cy.get('[data-testid^="view-product-link-"]').click();
      });
    cy.waitForPageLoad();
  });

  describe("Page Layout & Information", () => {
    it("should display product page with all main components", () => {
      cy.get('[data-testid="single-product-page-container"]').should(
        "be.visible"
      );
      cy.get('[data-testid="product-images-container"]').should("be.visible");
      cy.get('[data-testid="product-details-container"]').should("be.visible");
    });

    it("should display product title", () => {
      cy.get('[data-testid="product-title"]')
        .should("be.visible")
        .and("not.be.empty");
    });

    it("should display product price", () => {
      cy.get('[data-testid="product-price"]')
        .should("be.visible")
        .and("not.be.empty");
    });

    it("should display product SKU", () => {
      cy.get('[data-testid="product-sku"]').should("be.visible");
    });

    it("should display stock availability status", () => {
      cy.get('[data-testid="product-stock-availability"]').should("be.visible");
    });

    it("should display main product image", () => {
      cy.get('[data-testid="product-images-container"]').within(() => {
        cy.get("img")
          .should("be.visible")
          .and("have.attr", "src")
          .and("not.be.empty");
      });
    });

    it("should display additional product images", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find('[data-testid^="product-additional-image-"]').length > 0
        ) {
          cy.get('[data-testid^="product-additional-image-"]').should(
            "be.visible"
          );
        }
      });
    });
  });

  describe("Product Tabs", () => {
    it("should display product tabs", () => {
      cy.get('[data-testid="product-tabs"]').should("be.visible");
      cy.get('[data-testid="product-description-tab"]').should("be.visible");
      cy.get('[data-testid="product-additional-info-tab"]').should(
        "be.visible"
      );
    });

    it("should switch to description tab", () => {
      cy.get('[data-testid="product-description-tab"]').click();
      cy.get('[data-testid="product-description-content"]')
        .should("be.visible")
        .and("not.be.empty");
    });

    it("should switch to additional info tab", () => {
      cy.get('[data-testid="product-additional-info-tab"]').click();
      cy.get('[data-testid="product-additional-info-content"]').should(
        "be.visible"
      );
    });

    it("should display additional info table with details", () => {
      cy.get('[data-testid="product-additional-info-tab"]').click();

      cy.get('[data-testid="product-additional-info-table"]').should(
        "be.visible"
      );

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="product-manufacturer-row"]').length > 0) {
          cy.get('[data-testid="product-manufacturer-label"]').should(
            "be.visible"
          );
          cy.get('[data-testid="product-manufacturer-value"]').should(
            "be.visible"
          );
        }

        if ($body.find('[data-testid="product-category-row"]').length > 0) {
          cy.get('[data-testid="product-category-label"]').should("be.visible");
          cy.get('[data-testid="product-category-value"]').should("be.visible");
        }
      });
    });
  });

  describe("Quantity Selection", () => {
    it("should display quantity input container", () => {
      cy.get('[data-testid="quantity-input-container"]').should("be.visible");
      cy.get('[data-testid="quantity-label"]').should("be.visible");
    });

    it("should display quantity controls", () => {
      cy.get('[data-testid="quantity-controls-container"]').should(
        "be.visible"
      );
      cy.get('[data-testid="quantity-display-input"]').should("be.visible");
      cy.get('[data-testid="quantity-decrement-button"]').should("be.visible");
      cy.get('[data-testid="quantity-increment-button"]').should("be.visible");
    });

    it("should display initial quantity value", () => {
      cy.get('[data-testid="quantity-display-input"]').should(
        "have.value",
        "1"
      );
    });

    it("should increment quantity", () => {
      cy.get('[data-testid="quantity-display-input"]').should(
        "have.value",
        "1"
      );

      cy.get('[data-testid="quantity-increment-button"]').click();
      cy.get('[data-testid="quantity-display-input"]').should(
        "have.value",
        "2"
      );

      cy.get('[data-testid="quantity-increment-button"]').click();
      cy.get('[data-testid="quantity-display-input"]').should(
        "have.value",
        "3"
      );
    });

    it("should decrement quantity", () => {
      cy.get('[data-testid="quantity-increment-button"]').click();
      cy.get('[data-testid="quantity-increment-button"]').click();
      cy.get('[data-testid="quantity-display-input"]').should(
        "have.value",
        "3"
      );

      cy.get('[data-testid="quantity-decrement-button"]').click();
      cy.get('[data-testid="quantity-display-input"]').should(
        "have.value",
        "2"
      );
    });

    it("should not decrement below 1", () => {
      cy.get('[data-testid="quantity-display-input"]').should(
        "have.value",
        "1"
      );

      cy.get('[data-testid="quantity-decrement-button"]').click();
      cy.get('[data-testid="quantity-display-input"]').should(
        "have.value",
        "1"
      );
    });

    it("should not allow manual quantity input because input is disabled", () => {
      cy.get('[data-testid="quantity-display-input"]').should(
        "have.attr",
        "disabled"
      );
      // Test ini hanya mengkonfirmasi bahwa input disabled
      cy.get('[data-testid="quantity-display-input"]').should("be.disabled");
    });
  });

  describe("Color Selection", () => {
    it("should display color selection if available", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="color-input-container"]').length > 0) {
          cy.get('[data-testid="color-input-container"]').should("be.visible");
          cy.get('[data-testid="selected-color-display"]').should("be.visible");
          cy.get('[data-testid="color-options-container"]').should(
            "be.visible"
          );
        }
      });
    });

    it("should select different color options", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="color-option-blue"]').length > 0) {
          cy.get('[data-testid="color-option-blue"]').click();
          cy.get('[data-testid="selected-color-value"]').should(
            "contain",
            "blue"
          );
        }
      });
    });
  });

  describe("Social Sharing", () => {
    it("should display social sharing buttons", () => {
      cy.get('[data-testid="share-facebook"]').should("be.visible");
      cy.get('[data-testid="share-twitter"]').should("be.visible");
      cy.get('[data-testid="share-pinterest"]').should("be.visible");
    });

    it("should have working share links", () => {
      cy.get('[data-testid="share-facebook"]')
        .should("have.attr", "href")
        .and("include", "facebook");
      cy.get('[data-testid="share-twitter"]')
        .should("have.attr", "href")
        .and("include", "twitter");
      cy.get('[data-testid="share-pinterest"]')
        .should("have.attr", "href")
        .and("include", "pinterest");
    });
  });

  describe("Payment Methods", () => {
    it("should display payment methods", () => {
      cy.get('[data-testid="payment-methods-container"]').should("be.visible");
    });
  });

  describe("Add to Cart", () => {
    it("should add product to cart with default quantity", () => {
      cy.get('[data-testid="add-to-cart-button"]').should("be.visible").click();

      cy.wait(1000);
      cy.get('[data-testid="cart-quantity-badge"]').should("be.visible");
    });

    it("should add product to cart with incremented quantity", () => {
      cy.get('[data-testid="quantity-increment-button"]').click();
      cy.get('[data-testid="quantity-increment-button"]').click();
      cy.get('[data-testid="quantity-display-input"]').should(
        "have.value",
        "3"
      );

      cy.get('[data-testid="add-to-cart-button"]').click();

      cy.wait(1000);
      cy.get('[data-testid="cart-quantity-badge"]').should("be.visible");
    });

    it("should update cart quantity when adding same product multiple times", () => {
      cy.get('[data-testid="add-to-cart-button"]').click();
      cy.wait(500);

      cy.get('[data-testid="add-to-cart-button"]').click();
      cy.wait(500);

      cy.get('[data-testid="cart-quantity-badge"]').should("be.visible");
    });
  });

  describe("Buy Now", () => {
    it("should display buy now button", () => {
      cy.get('[data-testid="buy-now-button"]').should("be.visible");
    });

    it("should navigate to checkout when clicking buy now", () => {
      cy.get('[data-testid="buy-now-button"]').click();

      // Should redirect to checkout or cart
      cy.url().should("match", /(checkout|cart)/);
    });
  });

  describe("Dynamic Fields", () => {
    it("should display dynamic fields container", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find('[data-testid="product-dynamic-fields-container"]')
            .length > 0
        ) {
          cy.get('[data-testid="product-dynamic-fields-container"]').should(
            "be.visible"
          );
        }
      });
    });
  });

  describe("Product Not Found", () => {
    it("should show 404 page for non-existent product", () => {
      cy.visit("/product/nonexistent-product-12345", {
        failOnStatusCode: false,
      });
      cy.waitForPageLoad();

      // Should show 404 or not found message
      cy.get("body").should("contain", "404");
    });
  });

  describe("Responsive Design", () => {
    it("should display correctly on mobile", () => {
      cy.viewport("iphone-x");

      cy.get('[data-testid="single-product-page-container"]').should(
        "be.visible"
      );
      cy.get('[data-testid="product-title"]').should("be.visible");
      cy.get('[data-testid="product-price"]').should("be.visible");
    });

    it("should display correctly on tablet", () => {
      cy.viewport("ipad-2");

      cy.get('[data-testid="single-product-page-container"]').should(
        "be.visible"
      );
      cy.get('[data-testid="product-images-container"]').should("be.visible");
      cy.get('[data-testid="product-details-container"]').should("be.visible");
    });
  });
});
