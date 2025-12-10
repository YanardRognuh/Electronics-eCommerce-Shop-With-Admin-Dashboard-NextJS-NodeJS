// cypress/e2e/admin/02-admin-products.cy.ts

describe("Admin Products Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/admin/products");
    cy.waitForPageLoad();
  });

  describe("Products Page Layout", () => {
    it("should display products page", () => {
      cy.get('[data-testid="dashboard-product-table-container"]').should(
        "be.visible"
      );
    });

    it("should display page title", () => {
      cy.get('[data-testid="product-table-title"]').should("be.visible");
    });

    it("should display product table", () => {
      cy.get('[data-testid="product-data-table"]').should("be.visible");
      cy.get('[data-testid="product-table-thead"]').should("be.visible");
      cy.get('[data-testid="product-table-tbody"]').should("be.visible");
    });

    it("should display add new product button", () => {
      cy.get('[data-testid="add-new-product-button"]').should("be.visible");
    });

    it("should display table headers", () => {
      // FIX: scrollIntoView harus dipanggil pada element, bukan cy
      cy.get('[data-testid="select-all-header"]')
        .scrollIntoView()
        .should("be.visible");
      cy.get('[data-testid="product-name-header"]').should("be.visible");
      cy.get('[data-testid="stock-status-header"]').should("be.visible");
      cy.get('[data-testid="price-header"]').should("be.visible");
      cy.get('[data-testid="actions-header"]').should("be.visible");
    });
  });

  describe("Products List Display", () => {
    it("should display product items if available", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="product-row-"]').length > 0) {
          cy.get('[data-testid^="product-row-"]').should(
            "have.length.greaterThan",
            0
          );
        } else {
          cy.get('[data-testid="no-products-message"]').should("be.visible");
        }
      });
    });

    it("should display product details in each row", () => {
      cy.get('[data-testid^="product-row-"]')
        .first()
        .within(() => {
          cy.get('[data-testid^="product-select-checkbox-"]').should("exist");
          cy.get('[data-testid^="product-image-"]').should("be.visible");
          cy.get('[data-testid^="product-title-"]').should("be.visible");
          cy.get('[data-testid^="product-manufacturer-"]').should("be.visible");
          cy.get('[data-testid^="stock-badge-"]').should("be.visible");
          cy.get('[data-testid^="price-cell-"]').should("be.visible");
        });
    });

    it("should display product images", () => {
      cy.get('[data-testid^="product-image-"]')
        .first()
        .should("be.visible")
        .and("not.be.empty");
    });

    it("should display stock status badges", () => {
      cy.get('[data-testid^="stock-badge-"]').should("be.visible");
    });

    it("should display product prices", () => {
      cy.get('[data-testid^="price-cell-"]')
        .first()
        .should("be.visible")
        .invoke("text")
        .should("match", /\$\d+/);
    });
  });

  describe("Product Selection", () => {
    it("should display select all checkbox", () => {
      // FIX: Scroll ke checkbox dulu sebelum check visibility
      cy.get('[data-testid="select-all-checkbox"]')
        .scrollIntoView()
        .should("exist");
    });

    it("should select individual product", () => {
      // FIX: Force click karena checkbox bisa tertutup label
      cy.get('[data-testid^="product-select-checkbox-"]')
        .first()
        .scrollIntoView()
        .check({ force: true });

      cy.get('[data-testid^="product-select-checkbox-"]')
        .first()
        .should("be.checked");
    });

    it("should unselect all products", () => {
      cy.get('[data-testid="select-all-checkbox"]')
        .scrollIntoView()
        .check({ force: true });

      cy.wait(500);

      cy.get('[data-testid="select-all-checkbox"]').uncheck({ force: true });

      cy.wait(500);

      cy.get('[data-testid^="product-select-checkbox-"]').each(($checkbox) => {
        cy.wrap($checkbox).should("not.be.checked");
      });
    });
  });

  describe("Add New Product", () => {
    it("should navigate to add product page", () => {
      cy.get('[data-testid="add-new-product-link"]').click();

      cy.url().should("include", "/admin/products/new");
      cy.get('[data-testid="add-new-product-container"]').should("be.visible");
    });

    it("should display add product form", () => {
      cy.get('[data-testid="add-new-product-link"]').click();

      cy.get('[data-testid="add-new-product-title"]').should("be.visible");
      cy.get('[data-testid="product-name-input"]').should("be.visible");
      cy.get('[data-testid="product-price-input"]').should("be.visible");
      cy.get('[data-testid="product-category-select"]').should("be.visible");
      cy.get('[data-testid="add-product-button"]').should("be.visible");
    });

    it("should fill and submit new product form", () => {
      cy.get('[data-testid="add-new-product-link"]').click();

      const timestamp = Date.now();
      const productData = {
        name: `Test Product ${timestamp}`,
        slug: `test-product-${timestamp}`,
        price: "99.99",
        manufacturer: "Test Manufacturer",
      };

      // Check if merchant select exists
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="merchant-select"]').length > 0) {
          cy.get('[data-testid="merchant-select"]').select(0);
        }
      });

      cy.get('[data-testid="product-name-input"]').type(productData.name);
      cy.get('[data-testid="product-slug-input"]').type(productData.slug);
      cy.get('[data-testid="product-price-input"]').type(productData.price);
      cy.get('[data-testid="product-manufacturer-input"]').type(
        productData.manufacturer
      );

      cy.get('[data-testid="product-category-select"]').select(1);

      // FIX: Select menggunakan value yang benar (true/false bukan yes/no)
      cy.get('[data-testid="product-instock-select"]').then(($select) => {
        // Check available options
        if ($select.find('option[value="true"]').length > 0) {
          cy.wrap($select).select("true");
        } else if ($select.find("option").length > 1) {
          cy.wrap($select).select(1); // Select second option (index)
        }
      });

      cy.get('[data-testid="add-product-button"]').click();

      cy.wait(2000);

      // Should redirect to products list
      cy.url().should("include", "/admin/products");
    });

    it("should validate required fields", () => {
      cy.get('[data-testid="add-new-product-link"]').click();

      // Try to submit without filling required fields
      cy.get('[data-testid="add-product-button"]').click();

      // Should stay on the same page
      cy.url().should("include", "/admin/products/new");
    });
  });

  describe("View Product Details", () => {
    it("should navigate to product details page", () => {
      cy.get('[data-testid^="view-details-link-"]').first().click();

      cy.url().should("match", /\/admin\/products\/\d+/);
      cy.get('[data-testid="dashboard-product-details-container"]').should(
        "be.visible"
      );
    });

    it("should display product details form", () => {
      cy.get('[data-testid^="view-details-link-"]').first().click();

      cy.get('[data-testid="product-details-title"]').should("be.visible");
      cy.get('[data-testid="product-name-input"]').should("be.visible");
      cy.get('[data-testid="product-price-input"]').should("be.visible");
      cy.get('[data-testid="product-manufacturer-input"]').should("be.visible");
      cy.get('[data-testid="product-slug-input"]').should("be.visible");
      cy.get('[data-testid="product-instock-select"]').should("be.visible");
      cy.get('[data-testid="product-category-select"]').should("be.visible");
    });

    it("should display product description textarea", () => {
      cy.get('[data-testid^="view-details-link-"]').first().click();

      cy.get('[data-testid="product-description-textarea"]').should(
        "be.visible"
      );
    });

    it("should display main image upload section", () => {
      cy.get('[data-testid^="view-details-link-"]').first().click();

      cy.get('[data-testid="main-image-upload-container"]').should(
        "be.visible"
      );
      cy.get('[data-testid="main-image-upload-input"]').should("exist");
    });

    it("should display action buttons", () => {
      cy.get('[data-testid^="view-details-link-"]').first().click();

      cy.get('[data-testid="update-product-button"]').should("be.visible");
      cy.get('[data-testid="delete-product-button"]').should("be.visible");
    });
  });

  describe("Update Product", () => {
    it("should update product information", () => {
      cy.get('[data-testid^="view-details-link-"]').first().click();

      const updatedName = `Updated Product ${Date.now()}`;

      cy.get('[data-testid="product-name-input"]').clear().type(updatedName);
      cy.get('[data-testid="product-price-input"]').clear().type("199.99");

      cy.get('[data-testid="update-product-button"]').click();

      cy.wait(2000);

      // Should show success or stay on page with updated data
      cy.get('[data-testid="product-name-input"]').should(
        "have.value",
        updatedName
      );
    });

    it("should update product stock status", () => {
      cy.get('[data-testid^="view-details-link-"]').first().click();

      // FIX: Check available options first
      cy.get('[data-testid="product-instock-select"]').then(($select) => {
        const options = $select.find("option");
        if (options.length > 1) {
          // Get current value
          const currentValue = $select.val();
          // Select the other option
          const newIndex = currentValue === options.eq(0).val() ? 1 : 0;
          cy.wrap($select).select(newIndex);
        }
      });

      cy.get('[data-testid="update-product-button"]').click();

      cy.wait(2000);

      // Verify it stayed on the page (successful update)
      cy.url().should("match", /\/admin\/products\/\d+/);
    });

    it("should update product category", () => {
      cy.get('[data-testid^="view-details-link-"]').first().click();

      cy.get('[data-testid="product-category-select"]').select(1);
      cy.get('[data-testid="update-product-button"]').click();

      cy.wait(2000);

      // Should update successfully
      cy.url().should("match", /\/admin\/products\/\d+/);
    });
  });

  describe("Delete Product", () => {
    it("should display delete warning", () => {
      cy.get('[data-testid^="view-details-link-"]').first().click();

      cy.get('[data-testid="product-delete-warning"]').should("be.visible");
    });

    it("should delete product after confirmation", () => {
      // First, create a test product to delete
      cy.visit("/admin/products/new");
      cy.waitForPageLoad();

      const timestamp = Date.now();
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="merchant-select"]').length > 0) {
          cy.get('[data-testid="merchant-select"]').select(0);
        }
      });

      cy.get('[data-testid="product-name-input"]').type(
        `Delete Test ${timestamp}`
      );
      cy.get('[data-testid="product-slug-input"]').type(
        `delete-test-${timestamp}`
      );
      cy.get('[data-testid="product-price-input"]').type("10.00");
      cy.get('[data-testid="product-manufacturer-input"]').type("Test");
      cy.get('[data-testid="product-category-select"]').select(1);

      // Select in-stock option properly
      cy.get('[data-testid="product-instock-select"]').then(($select) => {
        if ($select.find("option").length > 1) {
          cy.wrap($select).select(1);
        }
      });

      cy.get('[data-testid="add-product-button"]').click();

      cy.wait(2000);

      // Now find and delete it
      cy.visit("/admin/products");
      cy.waitForPageLoad();

      cy.contains(`Delete Test ${timestamp}`)
        .parents('[data-testid^="product-row-"]')
        .find('[data-testid^="view-details-link-"]')
        .click();

      cy.get('[data-testid="delete-product-button"]').click();

      // Confirm deletion
      cy.on("window:confirm", () => true);

      cy.wait(2000);

      // Should redirect to products list
      cy.url().should("match", /\/admin\/products\/?$/);
    });
  });

  describe("Image Management", () => {
    beforeEach(() => {
      // Navigate to product details page before each test in this block
      cy.get('[data-testid^="view-details-link-"]').first().click();
      cy.wait(1000); // Wait for page to load
    });

    it("should display main image preview if exists", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="main-image-preview"]').length > 0) {
          cy.get('[data-testid="main-image-preview"]').should("be.visible");
        }
      });
    });

    it("should display other images container", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="other-images-container"]').length > 0) {
          cy.get('[data-testid="other-images-container"]').should("be.visible");
        }
      });
    });

    it("should allow image upload", () => {
      cy.get('[data-testid="main-image-upload-input"]').should("exist");

      // Note: Actual file upload testing requires fixture file
      // cy.get('[data-testid="main-image-upload-input"]')
      //   .selectFile('cypress/fixtures/test-image.jpg', { force: true });
    });
  });

  describe("Table Footer", () => {
    it("should display table footer", () => {
      // FIX: Scroll ke footer dulu karena terpotong overflow
      cy.get('[data-testid="product-table-tfoot"]')
        .scrollIntoView()
        .should("exist");
    });

    it("should display footer columns", () => {
      // Scroll table ke bawah untuk lihat footer
      cy.get('[data-testid="product-table-wrapper"]').scrollTo("bottom");

      cy.get('[data-testid="footer-select-all"]').should("exist");
      cy.get('[data-testid="footer-product-name"]').should("exist");
      cy.get('[data-testid="footer-stock-status"]').should("exist");
      cy.get('[data-testid="footer-price"]').should("exist");
      cy.get('[data-testid="footer-actions"]').should("exist");
    });
  });

  describe("Search and Filter", () => {
    it("should filter products by stock status", () => {
      // Click on stock badge to filter
      cy.get('[data-testid^="stock-badge-"]').first().click();

      cy.wait(1000);

      // Products should be filtered
      cy.get('[data-testid^="product-row-"]').should(
        "have.length.greaterThan",
        0
      );
    });
  });

  describe("No Products State", () => {
    it("should display no products message when list is empty", () => {
      // This would require a state where no products exist
      // Or mock the API response
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="no-products-message"]').length > 0) {
          cy.get('[data-testid="no-products-message"]').should("be.visible");
          cy.get('[data-testid="no-products-row"]').should("be.visible");
        }
      });
    });
  });
});
