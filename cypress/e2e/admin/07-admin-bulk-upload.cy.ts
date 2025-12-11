// cypress/e2e/admin/07-admin-bulk-upload-strict.cy.ts
// STRICT VERSION - Tests will FAIL if upload doesn't work

describe("Admin Bulk Upload - STRICT Tests", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/admin/bulk-upload");
    cy.waitForPageLoad();
  });

  afterEach(() => {
    cy.clearTestBulkUploadBatches();
    cy.clearBulkUploadTestProducts();
  });

  describe("Page Layout (Should Always Pass)", () => {
    it("should display bulk upload page", () => {
      cy.get('[data-testid="bulk-upload-page-container"]').should("be.visible");
    });

    it("should display page title", () => {
      cy.get('[data-testid="bulk-upload-page-title"]').should("be.visible");
    });

    it("should display file upload section", () => {
      cy.get('[data-testid="file-upload-section"]').should("be.visible");
    });

    it("should display upload button", () => {
      cy.get('[data-testid="upload-products-button"]').should("be.visible");
    });

    it("should disable upload button when no file selected", () => {
      cy.get('[data-testid="upload-products-button"]').should("be.disabled");
    });
  });

  describe("File Selection (Should Always Pass - Frontend Only)", () => {
    it("should show selected file info after file selection", () => {
      cy.get('[data-testid="file-upload-input"]').selectFile(
        "cypress/fixtures/bulk-upload-example.csv",
        { force: true }
      );

      cy.get('[data-testid="selected-file-info"]').should("be.visible");
      cy.get('[data-testid="selected-file-info"]').should(
        "contain",
        "bulk-upload-example.csv"
      );
    });

    it("should enable upload button when file is selected", () => {
      cy.get('[data-testid="file-upload-input"]').selectFile(
        "cypress/fixtures/bulk-upload-example.csv",
        { force: true }
      );

      cy.get('[data-testid="upload-products-button"]').should(
        "not.be.disabled"
      );
    });
  });

  describe("Successful Upload Flow (WILL FAIL if backend has errors)", () => {
    it("STRICT: should successfully upload valid CSV file", () => {
      cy.get('[data-testid="file-upload-input"]').selectFile(
        "cypress/fixtures/bulk-upload-example.csv",
        { force: true }
      );

      cy.get('[data-testid="upload-products-button"]').click();
      cy.wait(3000);

      // ❌ WILL FAIL: Assert upload result MUST exist
      cy.get('[data-testid="upload-result-container"]').should("be.visible");
      cy.get('[data-testid="upload-result-status"]').should("be.visible");

      // ❌ WILL FAIL: New batch MUST appear in history
      cy.get('[data-testid^="batch-item-"]').should("exist");
      cy.get('[data-testid^="batch-item-"]').first().should("be.visible");
    });

    it("STRICT: should display upload statistics after successful upload", () => {
      cy.get('[data-testid="file-upload-input"]').selectFile(
        "cypress/fixtures/bulk-upload-example.csv",
        { force: true }
      );

      cy.get('[data-testid="upload-products-button"]').click();
      cy.wait(3000);

      // ❌ WILL FAIL: Statistics MUST be visible
      cy.get('[data-testid="upload-statistics-container"]').should(
        "be.visible"
      );
      cy.get('[data-testid="statistics-grid"]').should("be.visible");
      cy.get('[data-testid="processed-count-container"]').should("be.visible");
      cy.get('[data-testid="successful-count-container"]').should("be.visible");
      cy.get('[data-testid="failed-count-container"]').should("be.visible");
    });

    it("STRICT: should display success icon for successful upload", () => {
      cy.get('[data-testid="file-upload-input"]').selectFile(
        "cypress/fixtures/bulk-upload-example.csv",
        { force: true }
      );

      cy.get('[data-testid="upload-products-button"]').click();
      cy.wait(3000);

      // ❌ WILL FAIL: Success icon MUST exist
      cy.get('[data-testid="success-icon"]').should("be.visible");
    });

    it("STRICT: should create batch in upload history", () => {
      // Get initial count
      cy.get("body").then(($body) => {
        const initialCount =
          $body.find('[data-testid^="batch-item-"]').length || 0;

        // Upload file
        cy.get('[data-testid="file-upload-input"]').selectFile(
          "cypress/fixtures/bulk-upload-example.csv",
          { force: true }
        );

        cy.get('[data-testid="upload-products-button"]').click();
        cy.wait(3000);

        // ❌ WILL FAIL: History count MUST increase
        cy.get('[data-testid^="batch-item-"]').should(
          "have.length.greaterThan",
          initialCount
        );
      });
    });

    it("STRICT: should display batch with correct filename", () => {
      cy.get('[data-testid="file-upload-input"]').selectFile(
        "cypress/fixtures/bulk-upload-example.csv",
        { force: true }
      );

      cy.get('[data-testid="upload-products-button"]').click();
      cy.wait(3000);

      // ❌ WILL FAIL: Batch filename MUST be visible
      cy.get('[data-testid^="batch-filename-"]')
        .first()
        .should("be.visible")
        .should("contain", "bulk-upload-example.csv");
    });
  });

  describe("Upload History Component (WILL FAIL if no batches exist)", () => {
    beforeEach(() => {
      // Upload a file first to create a batch
      cy.get('[data-testid="file-upload-input"]').selectFile(
        "cypress/fixtures/bulk-upload-example.csv",
        { force: true }
      );
      cy.get('[data-testid="upload-products-button"]').click();
      cy.wait(3000);
    });

    it("STRICT: should display batch items", () => {
      // ❌ WILL FAIL: Batch items MUST exist
      cy.get('[data-testid^="batch-item-"]').should("exist");
      cy.get('[data-testid^="batch-item-"]').should(
        "have.length.greaterThan",
        0
      );
    });

    it("STRICT: should display batch details", () => {
      // ❌ WILL FAIL: Batch details MUST be visible
      cy.get('[data-testid^="batch-item-"]').first().should("be.visible");

      cy.get('[data-testid^="batch-item-"]')
        .first()
        .invoke("attr", "data-testid")
        .then((testid) => {
          const batchId = testid?.replace("batch-item-", "");

          cy.get(`[data-testid="batch-header-${batchId}"]`).should(
            "be.visible"
          );
          cy.get(`[data-testid="batch-info-${batchId}"]`).should("be.visible");
          cy.get(`[data-testid="batch-filename-${batchId}"]`).should(
            "be.visible"
          );
          cy.get(`[data-testid="batch-status-${batchId}"]`).should(
            "be.visible"
          );
        });
    });

    it("STRICT: should display batch statistics", () => {
      // ❌ WILL FAIL: Statistics MUST exist
      cy.get('[data-testid^="batch-item-"]')
        .first()
        .invoke("attr", "data-testid")
        .then((testid) => {
          const batchId = testid?.replace("batch-item-", "");

          cy.get(`[data-testid="batch-total-records-${batchId}"]`).should(
            "be.visible"
          );
          cy.get(`[data-testid="batch-successful-records-${batchId}"]`).should(
            "be.visible"
          );
          cy.get(`[data-testid="batch-failed-records-${batchId}"]`).should(
            "be.visible"
          );
          cy.get(`[data-testid="batch-success-rate-${batchId}"]`).should(
            "be.visible"
          );
        });
    });

    it("STRICT: should display batch actions", () => {
      // ❌ WILL FAIL: Action buttons MUST exist
      cy.get('[data-testid^="batch-item-"]')
        .first()
        .invoke("attr", "data-testid")
        .then((testid) => {
          const batchId = testid?.replace("batch-item-", "");

          cy.get(`[data-testid="batch-actions-${batchId}"]`).should(
            "be.visible"
          );
          cy.get(`[data-testid="batch-delete-button-${batchId}"]`).should(
            "be.visible"
          );
        });
    });

    it("STRICT: should have numeric statistics values", () => {
      // ❌ WILL FAIL: Statistics must have valid numbers
      cy.get('[data-testid^="batch-total-records-"]')
        .first()
        .invoke("text")
        .should("match", /\d+/);

      cy.get('[data-testid^="batch-successful-records-"]')
        .first()
        .invoke("text")
        .should("match", /\d+/);
    });
  });

  describe("Delete Batch Modal (WILL FAIL if no batches exist)", () => {
    beforeEach(() => {
      // Upload a file first to create a batch
      cy.get('[data-testid="file-upload-input"]').selectFile(
        "cypress/fixtures/bulk-upload-example.csv",
        { force: true }
      );
      cy.get('[data-testid="upload-products-button"]').click();
      cy.wait(3000);
    });

    it("STRICT: should open delete modal when delete button clicked", () => {
      // ❌ WILL FAIL: Delete button MUST exist
      cy.get('[data-testid^="batch-delete-button-"]')
        .first()
        .should("be.visible")
        .click();

      // ❌ WILL FAIL: Modal MUST appear
      cy.get('[data-testid="delete-modal-container"]').should("be.visible");
    });

    it("STRICT: should display delete modal content", () => {
      cy.get('[data-testid^="batch-delete-button-"]').first().click();

      // ❌ WILL FAIL: All modal elements MUST be visible
      cy.get('[data-testid="delete-modal-content"]').should("be.visible");
      cy.get('[data-testid="delete-modal-header"]').should("be.visible");
      cy.get('[data-testid="delete-modal-warning-icon"]').should("be.visible");
      cy.get('[data-testid="delete-modal-title"]').should("be.visible");
      cy.get('[data-testid="delete-modal-message"]').should("be.visible");
    });

    it("STRICT: should display delete products warning", () => {
      cy.get('[data-testid^="batch-delete-button-"]').first().click();

      // ❌ WILL FAIL: Warning elements MUST exist
      cy.get('[data-testid="delete-products-warning-container"]').should(
        "be.visible"
      );
      cy.get('[data-testid="delete-products-checkbox"]').should("be.visible");
      cy.get('[data-testid="delete-products-warning-text"]').should(
        "be.visible"
      );
    });

    it("STRICT: should display modal action buttons", () => {
      cy.get('[data-testid^="batch-delete-button-"]').first().click();

      // ❌ WILL FAIL: Action buttons MUST exist
      cy.get('[data-testid="delete-modal-actions"]').should("be.visible");
      cy.get('[data-testid="delete-modal-cancel-button"]').should("be.visible");
      cy.get('[data-testid="delete-modal-confirm-button"]').should(
        "be.visible"
      );
    });

    it("STRICT: should close modal when cancel clicked", () => {
      cy.get('[data-testid^="batch-delete-button-"]').first().click();

      cy.get('[data-testid="delete-modal-cancel-button"]').click();

      // ❌ WILL FAIL: Modal MUST close
      cy.get('[data-testid="delete-modal-container"]').should("not.exist");
    });

    it("STRICT: should delete batch when confirmed", () => {
      const initialCount = Cypress.$('[data-testid^="batch-item-"]').length;

      // ❌ WILL FAIL: Must have at least one batch to delete
      expect(initialCount).to.be.greaterThan(0);

      cy.get('[data-testid^="batch-delete-button-"]').first().click();

      cy.get('[data-testid="delete-products-checkbox"]').check({
        force: true,
      });

      cy.get('[data-testid="delete-modal-confirm-button"]').click();
      cy.wait(2000);

      // ❌ WILL FAIL: Batch count MUST decrease
      cy.get('[data-testid^="batch-item-"]').should(
        "have.length.lessThan",
        initialCount
      );
    });
  });

  describe("CSV Content Validation (WILL FAIL if backend errors)", () => {
    it("STRICT: should validate CSV has required columns and upload successfully", () => {
      cy.get('[data-testid="file-upload-input"]').selectFile(
        "cypress/fixtures/bulk-upload-example.csv",
        { force: true }
      );

      cy.get('[data-testid="upload-products-button"]').click();
      cy.wait(3000);

      // ❌ WILL FAIL: Upload result status MUST be visible
      cy.get('[data-testid="upload-result-status"]').should("be.visible");

      // ❌ WILL FAIL: Should have successful records
      cy.get('[data-testid="successful-count-container"]')
        .should("be.visible")
        .invoke("text")
        .then((text) => {
          const count = parseInt(text.replace(/\D/g, ""));
          expect(count).to.be.greaterThan(0);
        });
    });

    it("STRICT: should create products in database", () => {
      cy.get('[data-testid="file-upload-input"]').selectFile(
        "cypress/fixtures/bulk-upload-example.csv",
        { force: true }
      );

      cy.get('[data-testid="upload-products-button"]').click();
      cy.wait(3000);

      // ❌ WILL FAIL: Verify products were created via API
      cy.request("GET", "http://localhost:3001/api/products").then(
        (response) => {
          expect(response.status).to.equal(200);

          // Check if test products exist
          const testProducts = response.body.filter(
            (p: any) =>
              p.slug === "samsung-galaxy-s24-ultra" ||
              p.slug === "apple-macbook-pro-16-m3"
          );

          // ❌ WILL FAIL: Products MUST be created
          expect(testProducts.length).to.be.greaterThan(0);
        }
      );
    });
  });

  describe("Upload Progress Indicators (May pass/fail depending on implementation)", () => {
    it("should disable upload button during upload", () => {
      cy.get('[data-testid="file-upload-input"]').selectFile(
        "cypress/fixtures/bulk-upload-example.csv",
        { force: true }
      );

      cy.get('[data-testid="upload-products-button"]').click();

      // Should be disabled immediately
      cy.get('[data-testid="upload-products-button"]').should("be.disabled");

      cy.wait(3000);
    });
  });

  describe("Verify Backend Integration (WILL FAIL if backend broken)", () => {
    it("STRICT: should receive 201 response from upload API", () => {
      cy.intercept("POST", "**/api/bulk-upload*").as("bulkUpload");

      cy.get('[data-testid="file-upload-input"]').selectFile(
        "cypress/fixtures/bulk-upload-example.csv",
        { force: true }
      );

      cy.get('[data-testid="upload-products-button"]').click();

      cy.wait("@bulkUpload").then((interception) => {
        // ❌ WILL FAIL: API must return 201 Created
        expect(interception.response?.statusCode).to.equal(201);

        // ❌ WILL FAIL: Response must have batchId
        expect(interception.response?.body).to.have.property("batchId");
        expect(interception.response?.body).to.have.property("status");
      });
    });

    it("STRICT: should fetch batches list successfully", () => {
      cy.intercept("GET", "**/api/bulk-upload*").as("getBatches");

      cy.reload();
      cy.waitForPageLoad();

      cy.wait("@getBatches").then((interception) => {
        // ❌ WILL FAIL: API must return 200
        expect(interception.response?.statusCode).to.equal(200);

        // ❌ WILL FAIL: Response must have batches array
        expect(interception.response?.body).to.have.property("batches");
        expect(interception.response?.body.batches).to.be.an("array");
      });
    });
  });

  describe("Error Scenarios (Should show error states)", () => {
    it("STRICT: should display error when upload fails", () => {
      // Intercept and force error
      cy.intercept("POST", "**/api/bulk-upload*", {
        statusCode: 500,
        body: { error: "Internal server error" },
      }).as("uploadError");

      cy.get('[data-testid="file-upload-input"]').selectFile(
        "cypress/fixtures/bulk-upload-example.csv",
        { force: true }
      );

      cy.get('[data-testid="upload-products-button"]').click();

      cy.wait("@uploadError");

      // ❌ WILL FAIL: Error message MUST be displayed
      cy.get('[data-testid="upload-error-message"]', { timeout: 5000 }).should(
        "be.visible"
      );
    });
  });
});
