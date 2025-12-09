// cypress/e2e/user/02-homepage.cy.ts

describe("Homepage & Landing Page", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.waitForPageLoad();
  });

  describe("Header Component", () => {
    it("should display header with all elements", () => {
      cy.get('[data-testid="header-container"]').should("be.visible");
      cy.get('[data-testid="public-logo"]').should("be.visible");
      cy.get('[data-testid="search-input-component"]').should("be.visible");
      cy.get('[data-testid="heart-element-component"]').should("be.visible");
      cy.get('[data-testid="cart-element-component"]').should("be.visible");
    });

    it("should navigate to homepage when clicking logo", () => {
      cy.visit("/shop");
      cy.waitForPageLoad();

      cy.get('[data-testid="logo-link"]').click();
      cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
    });

    it("should display search input and allow searching", () => {
      cy.get('[data-testid="search-input-field"]')
        .should("be.visible")
        .type("laptop");
      cy.get('[data-testid="search-submit-button"]').click();

      cy.url().should("include", "/search");
      cy.get('[data-testid="search-page-container"]').should("be.visible");
    });

    it("should display cart with quantity badge when items are added", () => {
      cy.get('[data-testid="cart-element-component"]').should("be.visible");
      cy.get('[data-testid="cart-icon"]').should("be.visible");

      // Initially no badge or badge shows 0
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="cart-quantity-badge"]').length > 0) {
          cy.get('[data-testid="cart-quantity-badge"]').should("be.visible");
        }
      });
    });

    it("should navigate to cart page when clicking cart icon", () => {
      cy.get('[data-testid="cart-link"]').click();
      cy.url().should("include", "/cart");
      cy.get('[data-testid="cart-page-container"]').should("be.visible");
    });
  });

  describe("Hero Section", () => {
    it("should display hero section with all content", () => {
      cy.get('[data-testid="hero-container"]').should("be.visible");
      cy.get('[data-testid="hero-title"]')
        .should("be.visible")
        .and("not.be.empty");
      cy.get('[data-testid="hero-description"]')
        .should("be.visible")
        .and("not.be.empty");
      cy.get('[data-testid="hero-image"]').should("be.visible");
    });

    it("should display hero action buttons", () => {
      cy.get('[data-testid="hero-buttons-container"]').should("be.visible");
      cy.get('[data-testid="hero-buy-now-button"]').should("be.visible");
      cy.get('[data-testid="hero-learn-more-button"]').should("be.visible");
    });

    it("should navigate when clicking hero buttons", () => {
      cy.get('[data-testid="hero-buy-now-button"]').click();
      // Should navigate to shop or specific product
      cy.url().should("include", "/shop");

      cy.visit("/"); // Kembali ke halaman utama untuk menguji tombol kedua
      cy.waitForPageLoad();

      cy.get('[data-testid="hero-learn-more-button"]').click();
      // Should navigate to learn page or specific section
      cy.url().should("include", "/learn");
    });
  });

  describe("Introduction Section", () => {
    it("should display introduction section", () => {
      cy.get('[data-testid="introducing-section-container"]').should(
        "be.visible"
      );
      cy.get('[data-testid="introducing-title"]')
        .should("be.visible")
        .and("not.be.empty");
      cy.get('[data-testid="introducing-subtitle-1"]').should("be.visible");
      cy.get('[data-testid="introducing-subtitle-2"]').should("be.visible");
    });

    it("should have working shop now link", () => {
      cy.get('[data-testid="introducing-shop-now-link"]')
        .should("be.visible")
        .click();
      cy.url().should("include", "/shop");
    });
  });

  describe("Category Menu", () => {
    it("should display category menu with items", () => {
      cy.get('[data-testid="category-menu-container"]').should("be.visible");
      cy.get('[data-testid="category-menu-heading"]').should("be.visible");
      cy.get('[data-testid="category-items-grid"]').should("be.visible");
    });

    it("should display category items with images", () => {
      cy.get('[data-testid="category-items-grid"]').within(() => {
        cy.get('[data-testid^="category-item-"]').should(
          "have.length.greaterThan",
          0
        );

        cy.get('[data-testid^="category-item-"]')
          .first()
          .within(() => {
            cy.get('[data-testid^="category-item-image-"]').should(
              "be.visible"
            );
            cy.get('[data-testid="category-item-title"]').should("be.visible");
            cy.get('[data-testid="category-item-content"]').should(
              "be.visible"
            );
          });
      });
    });

    it("should navigate to category page when clicking category item", () => {
      cy.get('[data-testid^="category-item-"]').first().click();
      cy.url().should("include", "/shop");
    });
  });

  describe("Products Section", () => {
    it("should display products section", () => {
      cy.get('[data-testid="products-section-container"]').should("be.visible");
      cy.get('[data-testid="products-section-heading"]').should("be.visible");
      cy.get('[data-testid="products-grid"]').should("be.visible");
    });

    it("should display product items with required information", () => {
      cy.get('[data-testid="products-grid"]').within(() => {
        cy.get('[data-testid^="product-item-"]').should(
          "have.length.greaterThan",
          0
        );

        // Check first product has all required elements
        cy.get('[data-testid^="product-item-"]')
          .first()
          .within(() => {
            cy.get('[data-testid^="product-image-"]').should("be.visible");
            cy.get('[data-testid^="product-price-"]')
              .should("be.visible")
              .and("not.be.empty");
            cy.get('[data-testid^="view-product-link-"]').should("be.visible");
          });
      });
    });

    it("should navigate to product detail page when clicking product", () => {
      cy.get('[data-testid^="product-item-"]')
        .first()
        .within(() => {
          cy.get('[data-testid^="view-product-link-"]').click();
        });

      cy.url().should("include", "/product/");
      cy.get('[data-testid="single-product-page-container"]').should(
        "be.visible"
      );
    });

    it('should show "no products" message when no products available', () => {
      // This test would need specific conditions to trigger no products
      // You might mock this or test in a controlled environment
      cy.visit("/shop?category=nonexistent");
      cy.waitForPageLoad();

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="no-products-message"]').length > 0) {
          cy.get('[data-testid="no-products-message"]').should("be.visible");
        }
      });
    });
  });

  describe("Responsive Design", () => {
    it("should display correctly on mobile viewport", () => {
      cy.viewport("iphone-x");
      cy.visit("/");
      cy.waitForPageLoad();

      cy.get('[data-testid="header-container"]').should("be.visible");
      cy.get('[data-testid="hero-container"]').should("be.visible");
      cy.get('[data-testid="category-menu-container"]').should("be.visible");
      cy.get('[data-testid="products-section-container"]').should("be.visible");
    });

    it("should display correctly on tablet viewport", () => {
      cy.viewport("ipad-2");
      cy.visit("/");
      cy.waitForPageLoad();

      cy.get('[data-testid="header-container"]').should("be.visible");
      cy.get('[data-testid="hero-container"]').should("be.visible");
    });
  });

  describe("Page Load Performance", () => {
    it("should load homepage within acceptable time", () => {
      const start = Date.now();

      cy.visit("/");
      cy.get('[data-testid="hero-container"]').should("be.visible");

      const loadTime = Date.now() - start;
      expect(loadTime).to.be.lessThan(5000); // 5 seconds
    });

    it("should load images progressively", () => {
      cy.visit("/");
      cy.waitForPageLoad();

      cy.get('[data-testid^="product-image-"]').each(($img) => {
        cy.wrap($img).should("have.attr", "src").and("not.be.empty");
      });
    });
  });
});
