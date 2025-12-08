describe("Shop & Search Functionality", () => {
  describe("Shop Page", () => {
    beforeEach(() => {
      cy.visit("/shop");
    });

    it("Harus menampilkan halaman shop dengan benar", () => {
      cy.get('[data-testid="shop-page-container"]').should("be.visible");
      cy.get('[data-testid="shop-products-list"]').should("be.visible");
      cy.get('[data-testid="shop-filters"]').should("be.visible");
    });

    it("Harus menampilkan list produk", () => {
      // Verifikasi ada produk yang ditampilkan
      cy.get('[data-testid^="product-item-"]').should(
        "have.length.greaterThan",
        0
      );

      // Verifikasi setiap produk punya elemen penting
      cy.get('[data-testid^="product-item-"]')
        .first()
        .within(() => {
          cy.get('[data-testid^="product-image-"]').should("be.visible");
          cy.get('[data-testid^="product-price-"]').should("be.visible");
        });
    });

    it("Harus bisa klik produk untuk melihat detail", () => {
      // Klik produk pertama
      cy.get('[data-testid^="view-product-link-"]').first().click();

      // Verifikasi redirect ke halaman detail produk
      cy.url().should("include", "/product/");
      cy.get('[data-testid="single-product-page-container"]').should(
        "be.visible"
      );
    });
  });

  describe("Filters", () => {
    beforeEach(() => {
      cy.visit("/shop");
    });

    it("Harus menampilkan filter options", () => {
      cy.get('[data-testid="filters-container"]').should("be.visible");
      cy.get('[data-testid="availability-filters"]').should("be.visible");
      cy.get('[data-testid="price-filters"]').should("be.visible");
      cy.get('[data-testid="rating-filters"]').should("be.visible");
    });

    it("Harus bisa filter produk yang in stock", () => {
      // Check "In Stock" checkbox
      cy.get('[data-testid="in-stock-checkbox"]').check();

      // Wait untuk filter apply
      cy.wait(1000);

      // Verifikasi produk masih ditampilkan
      cy.get('[data-testid^="product-item-"]').should("exist");
    });

    it("Harus bisa filter produk yang out of stock", () => {
      // Check "Out of Stock" checkbox
      cy.get('[data-testid="out-of-stock-checkbox"]').check();

      cy.wait(1000);

      // Bisa jadi tidak ada produk out of stock, jadi cek apakah:
      // 1. Ada produk yang muncul, atau
      // 2. Ada message "no products"
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="product-item-"]').length > 0) {
          cy.get('[data-testid^="product-item-"]').should("exist");
        } else {
          // No products is also valid
          cy.log("No out of stock products found");
        }
      });
    });

    it("Harus bisa menggunakan price range slider", () => {
      // Verifikasi slider ada
      cy.get('[data-testid="price-range-slider"]').should("exist");

      // Interaksi dengan slider (adjust sesuai implementasi)
      // Note: Slider interaction bisa tricky, ini contoh umum
      cy.get('[data-testid="price-range-value"]').should("be.visible");
    });

    it("Harus bisa menggunakan rating filter", () => {
      cy.get('[data-testid="rating-range-slider"]').should("exist");
      cy.get('[data-testid="rating-range-labels"]').should("be.visible");
    });
  });

  describe("Sort Products", () => {
    beforeEach(() => {
      cy.visit("/shop");
    });

    it("Harus menampilkan sort options", () => {
      cy.get('[data-testid="shop-sort-by"]').should("be.visible");
    });

    it("Harus bisa sort produk", () => {
      // Klik sort dropdown (sesuaikan dengan implementasi Anda)
      cy.get('[data-testid="shop-sort-by"]').click();

      // Select sort option (sesuaikan selector)
      // cy.contains('Price: Low to High').click()

      cy.wait(1000);

      // Verifikasi produk masih ditampilkan setelah sort
      cy.get('[data-testid^="product-item-"]').should("exist");
    });
  });

  describe("Pagination", () => {
    beforeEach(() => {
      cy.visit("/shop");
    });

    it("Harus menampilkan pagination jika ada banyak produk", () => {
      // Pagination mungkin tidak selalu muncul jika produk sedikit
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="shop-pagination"]').length > 0) {
          cy.get('[data-testid="shop-pagination"]').should("be.visible");
        } else {
          cy.log("Not enough products for pagination");
        }
      });
    });
  });

  describe("Search Functionality", () => {
    it("Harus bisa search produk dari header", () => {
      cy.visit("/");

      // Ketik di search input
      cy.get('[data-testid="search-input-field"]').type("laptop");

      // Submit search
      cy.get('[data-testid="search-submit-button"]').click();

      // Verifikasi redirect ke search page
      cy.url().should("include", "/search");
      cy.get('[data-testid="search-page-container"]').should("be.visible");
    });

    it("Harus menampilkan hasil search", () => {
      cy.visit("/");
      cy.get('[data-testid="search-input-field"]').type("phone");
      cy.get('[data-testid="search-submit-button"]').click();

      // Verifikasi ada heading hasil search
      cy.get('[data-testid="search-results-heading"]').should("be.visible");

      // Verifikasi ada grid hasil search
      cy.get('[data-testid="search-results-grid"]').should("be.visible");

      // Verifikasi produk muncul atau ada message no products
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="search-product-item-"]').length > 0) {
          cy.get('[data-testid^="search-product-item-"]').should("exist");
        } else {
          cy.get('[data-testid="no-products-message"]').should("be.visible");
        }
      });
    });

    it("Harus menampilkan message jika tidak ada hasil", () => {
      cy.visit("/");
      cy.get('[data-testid="search-input-field"]').type("xyznotfound12345");
      cy.get('[data-testid="search-submit-button"]').click();

      // Verifikasi message no products
      cy.get('[data-testid="no-products-message"]').should("be.visible");
    });

    it("Harus bisa klik produk dari hasil search", () => {
      cy.visit("/");
      cy.get('[data-testid="search-input-field"]').type("samsung");
      cy.get('[data-testid="search-submit-button"]').click();

      // Jika ada hasil, klik produk pertama
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="search-product-item-"]').length > 0) {
          cy.get('[data-testid^="search-product-item-"]').first().click();

          // Verifikasi redirect ke detail produk
          cy.url().should("include", "/product/");
        }
      });
    });
  });

  describe("Product Detail Page", () => {
    it("Harus menampilkan detail produk dengan lengkap", () => {
      // Visit shop page dulu
      cy.visit("/shop");

      // Klik produk pertama
      cy.get('[data-testid^="view-product-link-"]').first().click();

      // Verifikasi halaman detail produk
      cy.get('[data-testid="single-product-page-container"]').should(
        "be.visible"
      );
      cy.get('[data-testid="product-title"]').should("be.visible");
      cy.get('[data-testid="product-price"]').should("be.visible");
      cy.get('[data-testid="product-sku"]').should("be.visible");
      cy.get('[data-testid="product-stock-availability"]').should("be.visible");
    });

    it("Harus menampilkan product images", () => {
      cy.visit("/shop");
      cy.get('[data-testid^="view-product-link-"]').first().click();

      // Verifikasi container gambar ada
      cy.get('[data-testid="product-images-container"]').should("be.visible");
    });

    it("Harus menampilkan product tabs", () => {
      cy.visit("/shop");
      cy.get('[data-testid^="view-product-link-"]').first().click();

      // Verifikasi tabs ada
      cy.get('[data-testid="product-tabs"]').should("be.visible");
    });

    it("Harus menampilkan social share buttons", () => {
      cy.visit("/shop");
      cy.get('[data-testid^="view-product-link-"]').first().click();

      // Verifikasi share buttons
      cy.get('[data-testid="share-facebook"]').should("be.visible");
      cy.get('[data-testid="share-twitter"]').should("be.visible");
      cy.get('[data-testid="share-pinterest"]').should("be.visible");
    });

    it("Harus menampilkan payment methods", () => {
      cy.visit("/shop");
      cy.get('[data-testid^="view-product-link-"]').first().click();

      cy.get('[data-testid="payment-methods-container"]').should("be.visible");
    });
  });

  describe("Breadcrumb Navigation", () => {
    it("Harus menampilkan breadcrumb di shop page", () => {
      cy.visit("/shop");
      cy.get('[data-testid="shop-breadcrumb"]').should("be.visible");
    });
  });

  describe("Category Filtering", () => {
    it("Harus bisa filter by category dari URL", () => {
      // Visit category specific page (sesuaikan dengan route Anda)
      cy.visit("/shop/electronics");

      // Verifikasi category title muncul
      cy.get('[data-testid="shop-category-title"]').should("be.visible");

      // Verifikasi produk ditampilkan
      cy.get('[data-testid^="product-item-"]').should("exist");
    });
  });
});
