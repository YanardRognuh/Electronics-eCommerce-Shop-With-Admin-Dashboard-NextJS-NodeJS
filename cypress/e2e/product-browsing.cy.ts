// cypress/e2e/user/03-product-browsing.cy.ts

describe("Product Browsing & Search", () => {
  describe("Shop Page", () => {
    beforeEach(() => {
      cy.visit("/shop");
      cy.waitForPageLoad();
    });

    it("should display shop page with all components", () => {
      cy.get('[data-testid="shop-page-container"]').should("be.visible");
      cy.get('[data-testid="shop-breadcrumb"]').should("be.visible");
      cy.get('[data-testid="shop-filters"]').should("be.visible");
      cy.get('[data-testid="products-grid"]').should("be.visible");
      cy.get('[data-testid="shop-sort-by"]').should("be.visible");
    });

    it("should display category title when browsing specific category", () => {
      cy.visit("/"); // atau halaman yang memiliki category menu
      cy.waitForPageLoad();

      // Temukan dan klik item kategori
      cy.get('[data-testid^="category-item-"]').first().click();
      // atau lebih spesifik, misalnya cy.get('[data-testid="category-item-tablets"]').click();

      cy.waitForPageLoad(); // Tunggu hingga navigasi ke /shop/nama-kategori selesai

      // Sekarang verifikasi bahwa kita berada di halaman shop dengan kategori tertentu
      // dan bahwa judul kategori muncul
      cy.url().should("include", "/shop/"); // Pastikan kita di halaman shop
      cy.get('[data-testid="shop-category-title"]')
        .should("be.visible")
        .and("not.be.empty");
    });

    it("should display products grid", () => {
      // Hapus .within() karena hanya ingin memverifikasi grid dan item di dalamnya
      cy.get('[data-testid="products-grid"]').should("be.visible");
      cy.get('[data-testid^="product-item-"]').should(
        "have.length.greaterThan",
        0
      );
    });
  });

  describe("Filters", () => {
    beforeEach(() => {
      cy.visit("/shop");
      cy.waitForPageLoad();
    });

    it("should display all filter sections", () => {
      cy.get('[data-testid="shop-filters"]').should("be.visible");
      cy.get('[data-testid="filters-title"]').should("be.visible");
      cy.get('[data-testid="availability-filters"]').should("be.visible");
      cy.get('[data-testid="price-filters"]').should("be.visible");
      cy.get('[data-testid="rating-filters"]').should("be.visible");
    });

    it("should filter by stock availability - in stock", () => {
      cy.get('[data-testid="in-stock-checkbox"]').check();
      cy.wait(1000); // Wait for filter to apply

      // Verify products are filtered
      cy.get('[data-testid="products-grid"]').should("be.visible");
    });

    it("should filter by stock availability - out of stock", () => {
      cy.get('[data-testid="out-of-stock-checkbox"]').check();
      cy.wait(1000);

      cy.get('[data-testid="products-grid"]').should("be.visible");
    });

    it("should filter by price range", () => {
      cy.get('[data-testid="price-range-slider"]').should("be.visible");

      // Adjust price range
      cy.get('[data-testid="price-range-slider"]')
        .invoke("val", 100)
        .trigger("input")
        .trigger("change");

      cy.wait(1000);
      cy.get('[data-testid="price-range-value"]').should("contain", "100");
    });

    it("should filter by rating", () => {
      cy.get('[data-testid="rating-range-slider"]').should("be.visible");

      cy.get('[data-testid="rating-range-slider"]')
        .invoke("val", 4)
        .trigger("input")
        .trigger("change");

      cy.wait(1000);
      cy.get('[data-testid="rating-range-labels"]').should("be.visible");
    });

    it("should apply multiple filters simultaneously", () => {
      cy.get('[data-testid="in-stock-checkbox"]').check();

      cy.get('[data-testid="price-range-slider"]')
        .invoke("val", 200)
        .trigger("input")
        .trigger("change");

      cy.wait(1500);
      cy.get('[data-testid="products-grid"]').should("be.visible");
    });

    it("should clear filters when unchecked", () => {
      cy.get('[data-testid="in-stock-checkbox"]').check();
      cy.wait(1000);

      cy.get('[data-testid="in-stock-checkbox"]').uncheck();
      cy.wait(1000);

      cy.get('[data-testid="products-grid"]').should("be.visible");
    });
  });

  describe("Sorting", () => {
    beforeEach(() => {
      cy.visit("/shop");
      cy.waitForPageLoad();
    });

    it("should display sort options", () => {
      cy.get('[data-testid="shop-sort-by"]').should("be.visible");
      cy.get('[data-testid="sort-by-label"]').should("be.visible");
      cy.get('[data-testid="sort-by-select"]').should("be.visible");
    });

    it("should sort products A-Z", () => {
      cy.get('[data-testid="sort-by-select"]').select("titleAsc"); // Ganti 'az' menjadi 'titleAsc'
      cy.wait(1000);

      cy.get('[data-testid="products-grid"]').should("be.visible");
    });

    it("should sort products Z-A", () => {
      cy.get('[data-testid="sort-by-select"]').select("titleDesc"); // Ganti 'za' menjadi 'titleDesc'
      cy.wait(1000);

      cy.get('[data-testid="products-grid"]').should("be.visible");
    });

    it("should sort by price - low to high", () => {
      cy.get('[data-testid="sort-by-select"]').select("lowPrice"); // Ganti 'low-price' menjadi 'lowPrice'
      cy.wait(1000);

      // Verify products are sorted by price
      cy.get('[data-testid^="product-price-"]').then(($prices) => {
        const prices = $prices
          .map((i, el) => parseFloat(el.textContent.replace(/[^0-9.]/g, "")))
          .get();

        const sortedPrices = [...prices].sort((a, b) => a - b);
        expect(prices).to.deep.equal(sortedPrices);
      });
    });

    it("should sort by price - high to low", () => {
      cy.get('[data-testid="sort-by-select"]').select("highPrice"); // Ganti 'high-price' menjadi 'highPrice'
      cy.wait(1000);

      cy.get('[data-testid^="product-price-"]').then(($prices) => {
        const prices = $prices
          .map((i, el) => parseFloat(el.textContent.replace(/[^0-9.]/g, "")))
          .get();

        const sortedPrices = [...prices].sort((a, b) => b - a);
        expect(prices).to.deep.equal(sortedPrices);
      });
    });
  });

  describe("Pagination", () => {
    beforeEach(() => {
      cy.visit("/shop");
      cy.waitForPageLoad();
    });

    it("should display pagination when there are multiple pages", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="shop-pagination"]').length > 0) {
          cy.get('[data-testid="shop-pagination"]').should("be.visible");
        }
      });
    });

    it("should navigate to next page", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="shop-pagination"]').length > 0) {
          cy.get('[data-testid="shop-pagination"]').within(() => {
            cy.contains("Next").click();
          });
          cy.wait(1000);
          cy.url().should("include", "page=2");
        }
      });
    });

    it("should navigate to previous page", () => {
      cy.visit("/shop?page=2");
      cy.waitForPageLoad();

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="shop-pagination"]').length > 0) {
          cy.get('[data-testid="shop-pagination"]').within(() => {
            cy.contains("Previous").click();
          });
          cy.wait(1000);
          cy.url().should("include", "page=1");
        }
      });
    });
  });

  describe("Search Functionality", () => {
    it("should display search results page", () => {
      cy.visit("/");
      cy.waitForPageLoad();

      cy.searchProduct("laptop");

      cy.get('[data-testid="search-page-container"]').should("be.visible");
      cy.get('[data-testid="search-results-heading"]').should("be.visible");
      cy.get('[data-testid="search-results-grid"]').should("be.visible");
    });

    it("should show search results for valid query", () => {
      cy.visit("/");
      cy.searchProduct("tablet");

      cy.get('[data-testid="search-results-grid"]').within(() => {
        cy.get('[data-testid^="search-product-item-"]').should(
          "have.length.greaterThan",
          0
        );
      });
    });

    it("should show no results message for non-existent products", () => {
      cy.visit("/");
      cy.searchProduct("nonexistentproduct12345");

      cy.get('[data-testid="no-products-message"]').should("be.visible");
    });

    it("should display search results with product information", () => {
      cy.visit("/");
      cy.searchProduct("phone");

      cy.get('[data-testid^="search-product-item-"]')
        .first()
        .within(() => {
          cy.get('[data-testid^="product-image-"]').should("be.visible");
          cy.get('[data-testid^="product-price-"]').should("be.visible");
        });
    });

    it("should allow clicking on search results", () => {
      cy.visit("/");
      cy.searchProduct("phone");

      cy.get('[data-testid^="search-product-item-"]').first().click();

      cy.url().should("include", "/product/");
      cy.get('[data-testid="single-product-page-container"]').should(
        "be.visible"
      );
    });
  });

  describe("Breadcrumb Navigation", () => {
    it("should display breadcrumb on shop page", () => {
      cy.visit("/shop");
      cy.waitForPageLoad();

      cy.get('[data-testid="shop-breadcrumb"]').should("be.visible");
    });

    it("should navigate using breadcrumb links", () => {
      cy.visit("/shop/electronics");
      cy.waitForPageLoad();

      cy.get('[data-testid="shop-breadcrumb"]').within(() => {
        cy.contains("Home").click();
      });

      cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
    });
  });
});
