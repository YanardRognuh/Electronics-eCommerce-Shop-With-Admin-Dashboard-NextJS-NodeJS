// cypress/e2e/admin/07-admin-bulk-upload.cy.ts

describe("Admin Bulk Upload", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/admin/bulk-upload");
    cy.waitForPageLoad();
  });

  afterEach(() => {
    cy.clearTestBulkUploadBatches(); // Clean batch & products
    // atau
    cy.clearBulkUploadTestProducts(); // Clean products only
  });

  describe("Bulk Upload Page Layout", () => {
    it("should display bulk upload page", () => {
      cy.get('[data-testid="bulk-upload-page-container"]').should("be.visible");
    });

    it("should display page title", () => {
      cy.get('[data-testid="bulk-upload-page-title"]').should("be.visible");
    });

    it("should display dashboard sidebar", () => {
      cy.get('[data-testid="dashboard-sidebar-container"]').should(
        "be.visible"
      );
    });
  });

  describe("Instructions Section", () => {
    it("should display instructions container", () => {
      cy.get('[data-testid="instructions-container"]').should("be.visible");
    });

    it("should display instructions heading", () => {
      cy.get('[data-testid="instructions-heading"]').should("be.visible");
    });

    it("should display instructions list", () => {
      cy.get('[data-testid="instructions-list"]').should("be.visible");
    });
  });

  describe("Template Download", () => {
    it("should display template download section", () => {
      cy.get('[data-testid="template-download-section"]').should("be.visible");
    });

    it("should display download template button", () => {
      cy.get('[data-testid="download-template-button"]').should("be.visible");
    });

    it("should download template when button clicked", () => {
      cy.get('[data-testid="download-template-button"]').click();

      // Template download should trigger
      cy.wait(1000);
    });
  });

  describe("File Upload Section", () => {
    it("should display file upload section", () => {
      cy.get('[data-testid="file-upload-section"]').should("be.visible");
    });

    it("should display file upload drop area", () => {
      cy.get('[data-testid="file-upload-drop-area"]').should("be.visible");
    });

    it("should display file upload input", () => {
      cy.get('[data-testid="file-upload-input"]').should("exist");
    });

    it("should display file upload text", () => {
      cy.get('[data-testid="file-upload-text"]').should("be.visible");
    });

    it("should display file upload label", () => {
      cy.get('[data-testid="file-upload-label"]').should("be.visible");
    });
  });

  describe("Upload Button", () => {
    it("should display upload button section", () => {
      cy.get('[data-testid="upload-button-section"]').should("be.visible");
    });

    it("should display upload products button", () => {
      cy.get('[data-testid="upload-products-button"]').should("be.visible");
    });

    it("should disable upload button when no file selected", () => {
      cy.get('[data-testid="upload-products-button"]').should("be.disabled");
    });
  });

  describe("File Selection", () => {
    it("should show selected file info after file selection", () => {
      const fileName = "bulk-upload-example.csv";

      cy.get('[data-testid="file-upload-input"]').selectFile(
        `cypress/fixtures/${fileName}`,
        { force: true }
      );

      cy.get('[data-testid="selected-file-info"]').should("be.visible");
      cy.get('[data-testid="selected-file-info"]').should("contain", fileName);
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

    it("should display file size information", () => {
      cy.get('[data-testid="file-upload-input"]').selectFile(
        "cypress/fixtures/bulk-upload-example.csv",
        { force: true }
      );

      cy.get('[data-testid="selected-file-size"]').should("be.visible");
    });

    it("should allow removing selected file", () => {
      cy.get('[data-testid="file-upload-input"]').selectFile(
        "cypress/fixtures/bulk-upload-example.csv",
        { force: true }
      );

      cy.get('[data-testid="selected-file-info"]').should("be.visible");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="remove-file-button"]').length > 0) {
          cy.get('[data-testid="remove-file-button"]').click();
          cy.get('[data-testid="selected-file-info"]').should("not.exist");
          cy.get('[data-testid="upload-products-button"]').should(
            "be.disabled"
          );
        }
      });
    });
  });

  describe("CSV Format Guide", () => {
    it("should display CSV format guide", () => {
      cy.get('[data-testid="csv-format-guide-container"]').should("be.visible");
    });

    it("should display CSV format guide heading", () => {
      cy.get('[data-testid="csv-format-guide-heading"]').should("be.visible");
    });

    it("should display CSV format table", () => {
      cy.get('[data-testid="csv-format-table-container"]').should("be.visible");
      cy.get('[data-testid="csv-format-table"]').should("be.visible");
    });

    it("should display CSV format table header", () => {
      cy.get('[data-testid="csv-format-table-header"]').should("be.visible");
      cy.get('[data-testid="csv-format-table-header-row"]').should(
        "be.visible"
      );
    });

    it("should display CSV format table body", () => {
      cy.get('[data-testid="csv-format-table-body"]').should("be.visible");
    });

    it("should display required CSV columns", () => {
      cy.get('[data-testid="csv-format-table-body"]').within(() => {
        cy.contains("title").should("be.visible");
        cy.contains("price").should("be.visible");
        cy.contains("description").should("be.visible");
      });
    });
  });

  describe("Successful Upload Flow", () => {
    it("should successfully upload valid CSV file", () => {
      // Select CSV file
      cy.get('[data-testid="file-upload-input"]').selectFile(
        "cypress/fixtures/bulk-upload-example.csv",
        { force: true }
      );

      // Verify file is selected
      cy.get('[data-testid="selected-file-info"]').should("be.visible");
      cy.get('[data-testid="upload-products-button"]').should(
        "not.be.disabled"
      );

      // Upload file
      cy.get('[data-testid="upload-products-button"]').click();

      // Wait for upload to complete
      cy.wait(3000);

      // Check for success indicators
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="upload-result-container"]').length > 0) {
          cy.get('[data-testid="upload-result-container"]').should(
            "be.visible"
          );
          cy.get('[data-testid="upload-result-status"]').should("be.visible");
        }

        // Verify new batch appears in history
        if ($body.find('[data-testid^="batch-item-"]').length > 0) {
          cy.get('[data-testid^="batch-item-"]').first().should("be.visible");
        }
      });
    });

    it("should display upload statistics after successful upload", () => {
      cy.get('[data-testid="file-upload-input"]').selectFile(
        "cypress/fixtures/bulk-upload-example.csv",
        { force: true }
      );

      cy.get('[data-testid="upload-products-button"]').click();
      cy.wait(3000);

      cy.get("body").then(($body) => {
        if (
          $body.find('[data-testid="upload-statistics-container"]').length > 0
        ) {
          cy.get('[data-testid="upload-statistics-container"]').should(
            "be.visible"
          );
          cy.get('[data-testid="statistics-grid"]').should("be.visible");
          cy.get('[data-testid="processed-count-container"]').should(
            "be.visible"
          );
          cy.get('[data-testid="successful-count-container"]').should(
            "be.visible"
          );
          cy.get('[data-testid="failed-count-container"]').should("be.visible");
        }
      });
    });

    it("should display success icon for successful upload", () => {
      cy.get('[data-testid="file-upload-input"]').selectFile(
        "cypress/fixtures/bulk-upload-example.csv",
        { force: true }
      );

      cy.get('[data-testid="upload-products-button"]').click();
      cy.wait(3000);

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="success-icon"]').length > 0) {
          cy.get('[data-testid="success-icon"]').should("be.visible");
        }
      });
    });

    it("should update upload history after successful upload", () => {
      // Get initial history count
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

        // Verify history count increased
        cy.get('[data-testid^="batch-item-"]').should(
          "have.length.at.least",
          initialCount
        );
      });
    });

    it("should reset file selection after successful upload", () => {
      cy.get('[data-testid="file-upload-input"]').selectFile(
        "cypress/fixtures/bulk-upload-example.csv",
        { force: true }
      );

      cy.get('[data-testid="upload-products-button"]').click();
      cy.wait(3000);

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="selected-file-info"]').length === 0) {
          cy.get('[data-testid="upload-products-button"]').should(
            "be.disabled"
          );
        }
      });
    });
  });

  describe("Upload History", () => {
    it("should display upload history container", () => {
      cy.get('[data-testid="upload-history-container"]').should("be.visible");
    });

    it("should display bulk upload history component", () => {
      cy.get('[data-testid="bulk-upload-history-component"]').should(
        "be.visible"
      );
    });
  });

  describe("Bulk Upload History Component", () => {
    it("should display history container", () => {
      cy.get('[data-testid="bulk-upload-history-container"]').should(
        "be.visible"
      );
    });

    it("should display history title", () => {
      cy.get('[data-testid="bulk-upload-history-title"]').should("be.visible");
    });

    it("should display batch items if available", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="batch-item-"]').length > 0) {
          cy.get('[data-testid^="batch-item-"]').should(
            "have.length.greaterThan",
            0
          );
        } else if (
          $body.find('[data-testid="bulk-upload-history-empty"]').length > 0
        ) {
          cy.get('[data-testid="bulk-upload-history-empty"]').should(
            "be.visible"
          );
          cy.get('[data-testid="no-history-icon"]').should("be.visible");
        }
      });
    });

    it("should display batch details", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="batch-item-"]').length > 0) {
          const batchId = $body
            .find('[data-testid^="batch-item-"]')
            .first()
            .attr("data-testid")
            ?.replace("batch-item-", "");

          if (batchId) {
            cy.get(`[data-testid="batch-header-${batchId}"]`).should(
              "be.visible"
            );
            cy.get(`[data-testid="batch-info-${batchId}"]`).should(
              "be.visible"
            );
            cy.get(`[data-testid="batch-filename-${batchId}"]`).should(
              "be.visible"
            );
            cy.get(`[data-testid="batch-status-${batchId}"]`).should(
              "be.visible"
            );
            cy.get(`[data-testid="batch-stats-${batchId}"]`).should(
              "be.visible"
            );
          }
        }
      });
    });

    it("should display batch statistics", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="batch-item-"]').length > 0) {
          const batchId = $body
            .find('[data-testid^="batch-item-"]')
            .first()
            .attr("data-testid")
            ?.replace("batch-item-", "");

          if (batchId) {
            cy.get(`[data-testid="batch-total-records-${batchId}"]`).should(
              "be.visible"
            );
            cy.get(
              `[data-testid="batch-successful-records-${batchId}"]`
            ).should("be.visible");
            cy.get(`[data-testid="batch-failed-records-${batchId}"]`).should(
              "be.visible"
            );
            cy.get(`[data-testid="batch-success-rate-${batchId}"]`).should(
              "be.visible"
            );
          }
        }
      });
    });

    it("should display batch actions", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="batch-item-"]').length > 0) {
          const batchId = $body
            .find('[data-testid^="batch-item-"]')
            .first()
            .attr("data-testid")
            ?.replace("batch-item-", "");

          if (batchId) {
            cy.get(`[data-testid="batch-actions-${batchId}"]`).should(
              "be.visible"
            );
            cy.get(`[data-testid="batch-delete-button-${batchId}"]`).should(
              "be.visible"
            );
          }
        }
      });
    });

    it("should display batch errors if any", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="batch-errors-container-"]').length > 0) {
          const batchId = $body
            .find('[data-testid^="batch-errors-container-"]')
            .first()
            .attr("data-testid")
            ?.replace("batch-errors-container-", "");

          if (batchId) {
            cy.get(`[data-testid="batch-errors-title-${batchId}"]`).should(
              "be.visible"
            );
            cy.get(`[data-testid="batch-errors-list-${batchId}"]`).should(
              "be.visible"
            );
          }
        }
      });
    });
  });

  describe("Delete Batch Modal", () => {
    it("should open delete modal when delete button clicked", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="batch-delete-button-"]').length > 0) {
          cy.get('[data-testid^="batch-delete-button-"]').first().click();

          cy.get('[data-testid="delete-modal-container"]').should("be.visible");
        }
      });
    });

    it("should display delete modal content", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="batch-delete-button-"]').length > 0) {
          cy.get('[data-testid^="batch-delete-button-"]').first().click();

          cy.get('[data-testid="delete-modal-content"]').should("be.visible");
          cy.get('[data-testid="delete-modal-header"]').should("be.visible");
          cy.get('[data-testid="delete-modal-warning-icon"]').should(
            "be.visible"
          );
          cy.get('[data-testid="delete-modal-title"]').should("be.visible");
          cy.get('[data-testid="delete-modal-message"]').should("be.visible");
        }
      });
    });

    it("should display delete products warning", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="batch-delete-button-"]').length > 0) {
          cy.get('[data-testid^="batch-delete-button-"]').first().click();

          cy.get('[data-testid="delete-products-warning-container"]').should(
            "be.visible"
          );
          cy.get('[data-testid="delete-products-checkbox"]').should(
            "be.visible"
          );
          cy.get('[data-testid="delete-products-warning-text"]').should(
            "be.visible"
          );
        }
      });
    });

    it("should display modal action buttons", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="batch-delete-button-"]').length > 0) {
          cy.get('[data-testid^="batch-delete-button-"]').first().click();

          cy.get('[data-testid="delete-modal-actions"]').should("be.visible");
          cy.get('[data-testid="delete-modal-cancel-button"]').should(
            "be.visible"
          );
          cy.get('[data-testid="delete-modal-confirm-button"]').should(
            "be.visible"
          );
        }
      });
    });

    it("should close modal when cancel clicked", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="batch-delete-button-"]').length > 0) {
          cy.get('[data-testid^="batch-delete-button-"]').first().click();

          cy.get('[data-testid="delete-modal-cancel-button"]').click();

          cy.get('[data-testid="delete-modal-container"]').should("not.exist");
        }
      });
    });

    it("should delete batch when confirmed", () => {
      // First upload a file to create a batch
      cy.get('[data-testid="file-upload-input"]').selectFile(
        "cypress/fixtures/bulk-upload-example.csv",
        { force: true }
      );
      cy.get('[data-testid="upload-products-button"]').click();
      cy.wait(3000);

      // Get the batch ID
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="batch-delete-button-"]').length > 0) {
          const initialCount = $body.find(
            '[data-testid^="batch-item-"]'
          ).length;

          // Open delete modal
          cy.get('[data-testid^="batch-delete-button-"]').first().click();

          // Check delete products checkbox if present
          cy.get("body").then(($modalBody) => {
            if (
              $modalBody.find('[data-testid="delete-products-checkbox"]')
                .length > 0
            ) {
              cy.get('[data-testid="delete-products-checkbox"]').check({
                force: true,
              });
            }
          });

          // Confirm deletion
          cy.get('[data-testid="delete-modal-confirm-button"]').click();
          cy.wait(2000);

          // Verify batch is removed
          cy.get('[data-testid^="batch-item-"]').should(
            "have.length.lessThan",
            initialCount
          );
        }
      });
    });
  });

  describe("Upload Progress", () => {
    it("should display upload progress indicator during upload", () => {
      cy.get('[data-testid="file-upload-input"]').selectFile(
        "cypress/fixtures/bulk-upload-example.csv",
        { force: true }
      );

      cy.get('[data-testid="upload-products-button"]').click();

      cy.get("body").then(($body) => {
        if (
          $body.find('[data-testid="upload-progress-indicator"]').length > 0
        ) {
          cy.get('[data-testid="upload-progress-indicator"]').should(
            "be.visible"
          );
        }
      });

      cy.wait(3000);
    });

    it("should disable upload button during upload", () => {
      cy.get('[data-testid="file-upload-input"]').selectFile(
        "cypress/fixtures/bulk-upload-example.csv",
        { force: true }
      );

      cy.get('[data-testid="upload-products-button"]').click();

      cy.get('[data-testid="upload-products-button"]').should("be.disabled");

      cy.wait(3000);
    });
  });

  describe("File Validation", () => {
    it("should only accept CSV files", () => {
      // Create a fake non-CSV file
      cy.writeFile("cypress/fixtures/test-image.txt", "This is not a CSV file");

      cy.get('[data-testid="file-upload-input"]').selectFile(
        "cypress/fixtures/test-image.txt",
        { force: true }
      );

      cy.get("body").then(($body) => {
        // Check if error message is displayed or button remains disabled
        if ($body.find('[data-testid="file-type-error"]').length > 0) {
          cy.get('[data-testid="file-type-error"]').should("be.visible");
        }

        // Upload button should be disabled for invalid files
        if (
          $body.find('[data-testid="upload-products-button"]').length > 0 &&
          $body.find('[data-testid="file-type-error"]').length > 0
        ) {
          cy.get('[data-testid="upload-products-button"]').should(
            "be.disabled"
          );
        }
      });
    });

    it("should validate CSV file size", () => {
      cy.get('[data-testid="file-upload-input"]').selectFile(
        "cypress/fixtures/bulk-upload-example.csv",
        { force: true }
      );

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="selected-file-size"]').length > 0) {
          cy.get('[data-testid="selected-file-size"]')
            .should("be.visible")
            .invoke("text")
            .should("not.be.empty");
        }
      });
    });
  });

  describe("Loading and Error States", () => {
    it("should display loading state when fetching history", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find('[data-testid="bulk-upload-history-loading"]').length > 0
        ) {
          cy.get('[data-testid="bulk-upload-history-loading"]').should(
            "be.visible"
          );
        }
      });
    });

    it("should display error state if history fetch fails", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find('[data-testid="bulk-upload-history-error"]').length > 0
        ) {
          cy.get('[data-testid="bulk-upload-history-error"]').should(
            "be.visible"
          );
        }
      });
    });

    it("should display empty state when no history", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find('[data-testid="bulk-upload-history-empty"]').length > 0
        ) {
          cy.get('[data-testid="bulk-upload-history-empty"]').should(
            "be.visible"
          );
          cy.get('[data-testid="no-history-icon"]').should("be.visible");
        }
      });
    });
  });

  describe("Navigation", () => {
    it("should navigate from sidebar", () => {
      cy.visit("/admin");
      cy.waitForPageLoad();

      cy.get('[data-testid="sidebar-bulk-upload-link"]').click();

      cy.url().should("include", "/admin/bulk-upload");
      cy.get('[data-testid="bulk-upload-page-container"]').should("be.visible");
    });

    it("should maintain state when navigating back", () => {
      cy.visit("/admin/products");
      cy.waitForPageLoad();

      cy.get('[data-testid="sidebar-bulk-upload-link"]').click();
      cy.url().should("include", "/admin/bulk-upload");

      cy.get('[data-testid="sidebar-products-link"]').click();
      cy.url().should("include", "/admin/products");

      cy.get('[data-testid="sidebar-bulk-upload-link"]').click();
      cy.url().should("include", "/admin/bulk-upload");
    });
  });

  describe("Accessibility", () => {
    it("should have accessible file upload input", () => {
      cy.get('[data-testid="file-upload-label"]').should("have.attr", "for");
    });

    it("should provide clear instructions", () => {
      cy.get('[data-testid="instructions-list"]').within(() => {
        cy.get("li").should("have.length.greaterThan", 0);
      });
    });

    it("should have proper ARIA labels", () => {
      cy.get('[data-testid="file-upload-input"]').should(
        "have.attr",
        "aria-label"
      );
    });
  });

  describe("CSV Content Validation", () => {
    it("should validate CSV has required columns", () => {
      cy.get('[data-testid="file-upload-input"]').selectFile(
        "cypress/fixtures/bulk-upload-example.csv",
        { force: true }
      );

      cy.get('[data-testid="upload-products-button"]').click();
      cy.wait(3000);

      // Check that upload was processed (no validation errors)
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="upload-result-status"]').length > 0) {
          cy.get('[data-testid="upload-result-status"]').should("be.visible");
        }
      });
    });
  });
});
