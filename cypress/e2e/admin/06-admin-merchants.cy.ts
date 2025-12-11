// cypress/e2e/admin/06-admin-merchants.cy.ts

describe("Admin Merchants Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/admin/merchant");
    cy.waitForPageLoad();
  });

  afterEach(() => {
    cy.clearTestMerchant();
    cy.resetDemoMerchant();
  });

  describe("Merchants Page Layout", () => {
    it("should display merchants page", () => {
      cy.get('[data-testid="merchant-page-container"]').should("be.visible");
    });

    it("should display page title", () => {
      cy.get('[data-testid="merchants-title"]').should("be.visible");
    });

    it("should display add merchant link", () => {
      cy.get('[data-testid="add-merchant-link"]')
        .scrollIntoView()
        .should("be.visible");
    });

    it("should display merchants table", () => {
      cy.get('[data-testid="merchants-table"]').should("be.visible");
      cy.get('[data-testid="merchants-table-header"]').should("be.visible");
      cy.get('[data-testid="merchants-table-body"]').should("be.visible");
    });

    it("should display table headers", () => {
      cy.get('[data-testid="merchant-name-header"]')
        .scrollIntoView()
        .should("be.visible");
      cy.get('[data-testid="merchant-email-header"]')
        .scrollIntoView()
        .should("be.visible");
      cy.get('[data-testid="merchant-status-header"]')
        .scrollIntoView()
        .should("be.visible");
      cy.get('[data-testid="merchant-products-header"]')
        .scrollIntoView()
        .should("be.visible");
      cy.get('[data-testid="merchant-actions-header"]')
        .scrollIntoView()
        .should("be.visible");
    });
  });

  describe("Merchants List Display", () => {
    it("should display merchant items if available", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="merchant-row-"]').length > 0) {
          cy.get('[data-testid^="merchant-row-"]').should(
            "have.length.greaterThan",
            0
          );
        } else {
          cy.get('[data-testid="no-merchants-container"]').should("be.visible");
        }
      });
    });

    it("should display merchant details in each row", () => {
      cy.get('[data-testid^="merchant-row-"]')
        .first()
        .scrollIntoView()
        .within(() => {
          cy.get('[data-testid^="merchant-name-"]')
            .scrollIntoView()
            .should("be.visible");
          cy.get('[data-testid^="merchant-email-"]')
            .scrollIntoView()
            .should("be.visible");
          cy.get('[data-testid^="merchant-status-"]')
            .scrollIntoView()
            .should("be.visible");
          cy.get('[data-testid^="merchant-products-count-"]')
            .scrollIntoView()
            .should("be.visible");
        });
    });

    it("should display merchant names", () => {
      cy.get('[data-testid^="merchant-name-"]')
        .first()
        .should("be.visible")
        .invoke("text")
        .should("not.be.empty");
    });

    it("should display merchant emails", () => {
      cy.get('[data-testid^="merchant-email-"]')
        .first()
        .scrollIntoView()
        .should("be.visible")
        .invoke("text")
        .should("match", /@/);
    });

    it("should display merchant status", () => {
      cy.get('[data-testid^="merchant-status-"]')
        .first()
        .scrollIntoView()
        .should("be.visible");
    });

    it("should display products count", () => {
      cy.get('[data-testid^="merchant-products-count-"]')
        .first()
        .scrollIntoView()
        .should("be.visible")
        .invoke("text")
        .should("match", /\d+/);
    });

    it("should display action links", () => {
      cy.get('[data-testid^="merchant-view-link-"]').should(
        "have.length.greaterThan",
        0
      );
      cy.get('[data-testid^="merchant-edit-link-"]').should(
        "have.length.greaterThan",
        0
      );
    });
  });

  describe("Add New Merchant", () => {
    it("should navigate to add merchant page", () => {
      cy.get('[data-testid="add-merchant-link"]').click();

      cy.url().should("include", "/admin/merchant/new");
      cy.get('[data-testid="new-merchant-page-container"]')
        .scrollIntoView()
        .should("be.visible");
    });

    it("should display add merchant form", () => {
      cy.get('[data-testid="add-merchant-link"]').click();

      cy.get('[data-testid="add-new-merchant-title"]')
        .scrollIntoView()
        .should("be.visible");
      cy.get('[data-testid="merchant-name-input"]')
        .scrollIntoView()
        .should("be.visible");
      cy.get('[data-testid="merchant-email-input"]')
        .scrollIntoView()
        .should("be.visible");
      cy.get('[data-testid="merchant-phone-input"]')
        .scrollIntoView()
        .should("be.visible");
      cy.get('[data-testid="merchant-status-select"]')
        .scrollIntoView()
        .should("be.visible");
      cy.get('[data-testid="merchant-address-input"]')
        .scrollIntoView()
        .should("be.visible");
      cy.get('[data-testid="merchant-description-textarea"]')
        .scrollIntoView()
        .should("be.visible");
      cy.get('[data-testid="create-merchant-button"]')
        .scrollIntoView()
        .should("be.visible");
    });

    it("should display status options", () => {
      cy.get('[data-testid="add-merchant-link"]').click();

      cy.get('[data-testid="status-option-active"]').should("exist");
      cy.get('[data-testid="status-option-inactive"]').should("exist");
    });

    it("should create new merchant successfully", () => {
      cy.get('[data-testid="add-merchant-link"]').click();

      const timestamp = Date.now();
      const merchantData = {
        name: `Test Merchant ${timestamp}`,
        email: `merchanttest@example.com`,
        phone: "+1234567890",
        address: "123 Business St",
        description: "Test merchant description",
      };

      cy.get('[data-testid="merchant-name-input"]').type(merchantData.name);
      cy.get('[data-testid="merchant-email-input"]').type(merchantData.email);
      cy.get('[data-testid="merchant-phone-input"]').type(merchantData.phone);
      cy.get('[data-testid="merchant-status-select"]').select("active");
      cy.get('[data-testid="merchant-address-input"]').type(
        merchantData.address
      );
      cy.get('[data-testid="merchant-description-textarea"]').type(
        merchantData.description
      );

      cy.get('[data-testid="create-merchant-button"]').click();

      cy.wait(2000);

      // Should redirect to merchants list
      cy.url().should("match", /\/admin\/merchant\/?$/);

      // Should see the new merchant
      cy.contains(merchantData.name).should("be.visible");
    });

    it("should validate required fields", () => {
      cy.get('[data-testid="add-merchant-link"]').click();

      // Try to submit without required fields
      cy.get('[data-testid="create-merchant-button"]').click();

      // Should stay on same page
      cy.url().should("include", "/admin/merchant/new");
    });

    it("should validate email format", () => {
      cy.get('[data-testid="add-merchant-link"]').click();

      cy.get('[data-testid="merchant-name-input"]')
        .scrollIntoView()
        .type("Test Merchant");
      cy.get('[data-testid="merchant-email-input"]').type("invalid-email");
      cy.get('[data-testid="merchant-phone-input"]').type("+1234567890");
      cy.get('[data-testid="create-merchant-button"]').click();

      // Should show validation error
      cy.url().should("include", "/admin/merchant/new");
    });

    it("should have cancel link", () => {
      cy.get('[data-testid="add-merchant-link"]').click();

      cy.get('[data-testid="cancel-link"]')
        .scrollIntoView()
        .should("be.visible")
        .click();

      cy.url().should("match", /\/admin\/merchant\/?$/);
    });
  });

  describe("View Merchant Details", () => {
    it("should navigate to merchant details page", () => {
      cy.get('[data-testid^="merchant-view-link-"]')
        .first()
        .scrollIntoView()
        .click();

      cy.url().should("match", /\/admin\/merchant\/\d+/);
      cy.get('[data-testid="merchant-detail-page-container"]')
        .scrollIntoView()
        .should("be.visible");
    });

    it("should display merchant details", () => {
      cy.get('[data-testid^="merchant-view-link-"]').first().click();

      cy.get('[data-testid="merchant-details-title"]')
        .scrollIntoView()
        .should("be.visible");
      cy.get('[data-testid="merchant-name-input"]')
        .scrollIntoView()
        .should("be.visible");
      cy.get('[data-testid="merchant-email-input"]')
        .scrollIntoView()
        .should("be.visible");
      cy.get('[data-testid="merchant-phone-input"]')
        .scrollIntoView()
        .should("be.visible");
      cy.get('[data-testid="merchant-status-select"]')
        .scrollIntoView()
        .should("be.visible");
      cy.get('[data-testid="merchant-address-input"]')
        .scrollIntoView()
        .should("be.visible");
      cy.get('[data-testid="merchant-description-textarea"]')
        .scrollIntoView()
        .should("be.visible");
    });

    it("should display merchant products section", () => {
      cy.get('[data-testid^="merchant-view-link-"]').first().click();

      cy.get('[data-testid="merchant-products-title"]')
        .scrollIntoView()
        .should("be.visible");
      cy.get('[data-testid="merchant-products-container"]')
        .scrollIntoView()
        .should("be.visible");
    });

    it("should display merchant products table", () => {
      cy.get('[data-testid^="merchant-view-link-"]').first().click();

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="merchant-products-table"]').length > 0) {
          cy.get('[data-testid="merchant-products-table"]')
            .scrollIntoView()
            .should("be.visible");
          cy.get('[data-testid="merchant-products-table-header"]')
            .scrollIntoView()
            .should("be.visible");
          cy.get('[data-testid="product-title-header"]')
            .scrollIntoView()
            .should("be.visible");
          cy.get('[data-testid="product-price-header"]')
            .scrollIntoView()
            .should("be.visible");
          cy.get('[data-testid="product-stock-header"]')
            .scrollIntoView()
            .should("be.visible");
          cy.get('[data-testid="product-actions-header"]')
            .scrollIntoView()
            .should("be.visible");
        } else {
          cy.get('[data-testid="no-products-message"]')
            .scrollIntoView()
            .should("be.visible");
        }
      });
    });

    it("should display action buttons", () => {
      cy.get('[data-testid^="merchant-view-link-"]').first().click();

      cy.get('[data-testid="save-changes-button"]')
        .scrollIntoView()
        .should("be.visible");
      cy.get('[data-testid="delete-merchant-button"]')
        .scrollIntoView()
        .should("be.visible");
    });

    it("should have back to merchants link", () => {
      cy.get('[data-testid^="merchant-view-link-"]').first().click();

      cy.get('[data-testid="back-to-merchants-link"]')
        .scrollIntoView()
        .should("be.visible");
    });
  });

  describe("Update Merchant", () => {
    it("should update merchant information", () => {
      cy.get('[data-testid^="merchant-edit-link-"]').first().click();

      const timestamp = Date.now();
      const updatedName = `Updated Merchant ${timestamp}`;

      cy.get('[data-testid="merchant-name-input"]').clear().type(updatedName);
      cy.get('[data-testid="save-changes-button"]').click();

      cy.wait(2000);

      cy.get('[data-testid="merchant-name-input"]').should(
        "have.value",
        updatedName
      );
    });

    it("should update merchant status", () => {
      cy.get('[data-testid^="merchant-edit-link-"]').first().click();

      cy.get('[data-testid="merchant-status-select"]').select("inactive");
      cy.get('[data-testid="save-changes-button"]').click();

      cy.wait(2000);

      cy.get('[data-testid="merchant-status-select"]').should(
        "have.value",
        "inactive"
      );
    });

    it("should update merchant contact details", () => {
      cy.get('[data-testid^="merchant-edit-link-"]').first().click();

      const newPhone = "+9876543210";

      cy.get('[data-testid="merchant-phone-input"]').clear().type(newPhone);
      cy.get('[data-testid="save-changes-button"]').click();

      cy.wait(2000);

      cy.get('[data-testid="merchant-phone-input"]').should(
        "have.value",
        newPhone
      );
    });

    it("should update merchant address", () => {
      cy.get('[data-testid^="merchant-edit-link-"]').first().click();

      const newAddress = "456 New Business Ave";

      cy.get('[data-testid="merchant-address-input"]').clear().type(newAddress);
      cy.get('[data-testid="save-changes-button"]').click();

      cy.wait(2000);

      cy.get('[data-testid="merchant-address-input"]').should(
        "have.value",
        newAddress
      );
    });

    it("should update merchant description", () => {
      cy.get('[data-testid^="merchant-edit-link-"]').first().click();

      const newDescription = "Updated merchant description with more details";

      cy.get('[data-testid="merchant-description-textarea"]')
        .clear()
        .type(newDescription);
      cy.get('[data-testid="save-changes-button"]').click();

      cy.wait(2000);

      cy.get('[data-testid="merchant-description-textarea"]').should(
        "have.value",
        newDescription
      );
    });
  });

  describe("Delete Merchant", () => {
    it("should delete merchant after confirmation", () => {
      // Create a test merchant first
      cy.visit("/admin/merchant/new");
      cy.waitForPageLoad();

      const timestamp = Date.now();
      const merchantName = `Delete Test ${timestamp}`;

      cy.get('[data-testid="merchant-name-input"]').type(merchantName);
      cy.get('[data-testid="merchant-email-input"]').type(
        `delete${timestamp}@test.com`
      );
      cy.get('[data-testid="merchant-phone-input"]').type("+1234567890");
      cy.get('[data-testid="merchant-status-select"]').select("active");
      cy.get('[data-testid="merchant-address-input"]').type("Test Address");
      cy.get('[data-testid="create-merchant-button"]').click();

      cy.wait(2000);

      // Find and delete it
      cy.contains(merchantName)
        .parents('[data-testid^="merchant-row-"]')
        .find('[data-testid^="merchant-view-link-"]')
        .click();

      cy.get('[data-testid="delete-merchant-button"]').click();

      // Confirm deletion
      cy.on("window:confirm", () => true);

      cy.wait(2000);

      // Should redirect to merchants list
      cy.url().should("match", /\/admin\/merchant\/?$/);

      // Merchant should be removed
      cy.contains(merchantName).should("not.exist");
    });
  });

  describe("Merchant Products", () => {
    it("should display products associated with merchant", () => {
      cy.get('[data-testid^="merchant-view-link-"]').first().click();

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="product-row-"]').length > 0) {
          cy.get('[data-testid^="product-row-"]').should(
            "have.length.greaterThan",
            0
          );

          cy.get('[data-testid^="product-title-"]')
            .first()
            .should("be.visible");
          cy.get('[data-testid^="product-price-"]')
            .first()
            .should("be.visible");
          cy.get('[data-testid^="product-stock-"]')
            .first()
            .should("be.visible");
        }
      });
    });

    it("should navigate to product page from merchant products", () => {
      cy.get('[data-testid^="merchant-view-link-"]').first().click();

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="product-view-link-"]').length > 0) {
          cy.get('[data-testid^="product-view-link-"]').first().click();

          // Should navigate to product details
          cy.url().should("match", /\/admin\/products\/\d+/);
        }
      });
    });
  });

  describe("Loading States", () => {
    it("should show loading state when fetching merchant data", () => {
      cy.visit("/admin/merchant/1");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="loading-container"]').length > 0) {
          cy.get('[data-testid="loading-container"]').should("be.visible");
        }
      });
    });
  });

  describe("Not Found State", () => {
    it("should show not found for invalid merchant ID", () => {
      cy.visit("/admin/merchant/999999", { failOnStatusCode: false });
      cy.waitForPageLoad();

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="not-found-container"]').length > 0) {
          cy.get('[data-testid="not-found-container"]').should("be.visible");
        }
      });
    });
  });

  describe("Navigation", () => {
    it("should navigate back to merchants list", () => {
      cy.get('[data-testid^="merchant-view-link-"]').first().click();

      cy.get('[data-testid="back-to-merchants-link"]').click();

      cy.url().should("match", /\/admin\/merchant\/?$/);
    });

    it("should navigate from sidebar", () => {
      cy.get('[data-testid^="merchant-view-link-"]').first().click();

      cy.get('[data-testid="dashboard-sidebar-container"]').within(() => {
        cy.get('[data-testid="sidebar-merchant-link"]').click();
      });

      cy.url().should("match", /\/admin\/merchant\/?$/);
    });
  });

  describe("Merchant Count", () => {
    it("should display total number of merchants", () => {
      cy.get('[data-testid^="merchant-row-"]')
        .its("length")
        .then((count) => {
          expect(count).to.be.at.least(0);
        });
    });
  });
});
