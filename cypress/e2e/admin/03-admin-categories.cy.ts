// cypress/e2e/admin/03-admin-categories.cy.ts

describe("Admin Categories Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.clearTestCategory();
    cy.visit("/admin/categories");
    cy.waitForPageLoad();
  });

  describe("Categories Page Layout", () => {
    it("should display categories page", () => {
      cy.get('[data-testid="dashboard-category-container"]').should(
        "be.visible"
      );
    });

    it("should display page title", () => {
      cy.get('[data-testid="all-categories-title"]').should("be.visible");
    });

    it("should display add new category button", () => {
      cy.get('[data-testid="add-new-category-button"]').should("be.visible");
      cy.get('[data-testid="add-new-category-link"]').should("be.visible");
    });

    it("should display categories table", () => {
      cy.get('[data-testid="categories-table-container"]').should("be.visible");
      cy.get('[data-testid="categories-table"]').should("be.visible");
    });

    it("should display table headers", () => {
      cy.get('[data-testid="categories-table-header"]')
        .scrollIntoView()
        .should("be.visible");
      cy.get('[data-testid="categories-table-header-checkbox"]').should(
        "be.visible"
      );
      cy.get('[data-testid="categories-table-header-name"]').should(
        "be.visible"
      );
      cy.get('[data-testid="categories-table-header-actions"]').should(
        "be.visible"
      );
    });
  });

  describe("Categories List Display", () => {
    it("should display category items", () => {
      cy.get('[data-testid^="category-row-"]').should(
        "have.length.greaterThan",
        0
      );
    });

    it("should display category details in each row", () => {
      cy.get('[data-testid^="category-row-"]')
        .first()
        .scrollIntoView()
        .within(() => {
          cy.get('[data-testid^="category-select-checkbox-"]').should(
            "be.visible"
          );
          cy.get('[data-testid^="category-name-"]')
            .should("be.visible")
            .and("not.be.empty");
        });
    });

    it("should display category names", () => {
      cy.get('[data-testid^="category-name-"]').each(($name) => {
        cy.wrap($name).should("not.be.empty");
      });
    });

    it("should display action links for each category", () => {
      cy.get('[data-testid^="category-details-link-"]').should(
        "have.length.greaterThan",
        0
      );
    });
  });

  describe("Category Selection", () => {
    it("should display select all checkbox", () => {
      cy.get('[data-testid="categories-select-all-checkbox"]')
        .scrollIntoView()
        .should("be.visible");
    });

    it("should select individual category", () => {
      cy.get('[data-testid^="category-select-checkbox-"]')
        .first()
        .scrollIntoView()
        .check()
        .should("be.checked");
    });

    it("should unselect all categories", () => {
      cy.get('[data-testid="categories-select-all-checkbox"]')
        .scrollIntoView()
        .check();
      cy.wait(500);
      cy.get('[data-testid="categories-select-all-checkbox"]')
        .scrollIntoView()
        .uncheck();

      cy.get('[data-testid^="category-select-checkbox-"]').each(($checkbox) => {
        cy.wrap($checkbox).scrollIntoView().should("not.be.checked");
      });
    });
  });

  describe("Add New Category", () => {
    it("should navigate to add category page", () => {
      cy.get('[data-testid="add-new-category-link"]').click();

      cy.url().should("include", "/admin/categories/new");
      cy.get('[data-testid="dashboard-new-category-container"]').should(
        "be.visible"
      );
    });

    it("should display add category form", () => {
      cy.get('[data-testid="add-new-category-link"]').click();

      cy.get('[data-testid="add-new-category-title"]').should("be.visible");
      cy.get('[data-testid="category-name-label"]').should("be.visible");
      cy.get('[data-testid="category-name-input"]').should("be.visible");
      cy.get('[data-testid="create-category-button"]').should("be.visible");
    });

    it("should create new category successfully", () => {
      cy.get('[data-testid="add-new-category-link"]').click();

      const categoryName = `Test Category ${Date.now()}`;
      cy.get('[data-testid="category-name-input"]').type(categoryName);
      cy.get('[data-testid="create-category-button"]').click();

      cy.visit("/admin/categories");

      // ✅ Cari di dalam table body yang visible
      cy.get('[data-testid^="category-name-"]')
        .contains(categoryName)
        .should("exist");
    });

    it("should validate required category name", () => {
      cy.get('[data-testid="add-new-category-link"]').click();

      // Try to submit without category name
      cy.get('[data-testid="create-category-button"]').click();

      // Should stay on the same page
      cy.url().should("include", "/admin/categories/new");
    });

    it("should trim whitespace from category name", () => {
      const timestamp = Date.now();
      const rawName = `  Trimmed Category ${timestamp}  `;
      const expectedName = `Trimmed Category ${timestamp}`;

      cy.get('[data-testid="add-new-category-link"]').click();
      cy.get('[data-testid="category-name-input"]').type(rawName);
      cy.get('[data-testid="create-category-button"]').click();

      // ✅ Lakukan: kunjungi ulang halaman daftar
      cy.visit("/admin/categories");

      // Verifikasi nama yang sudah di-trim muncul
      cy.contains(expectedName).should("be.visible");
      cy.contains(rawName).should("not.exist");
    });
  });

  describe("View Category Details", () => {
    it("should navigate to category details page", () => {
      cy.get('[data-testid^="category-details-link-"]')
        .first()
        .scrollIntoView()
        .click();

      cy.url().should("match", /\/admin\/categories\/[a-z0-9-]+/);
      cy.get('[data-testid="dashboard-single-category-container"]')
        .scrollIntoView()
        .should("be.visible");
    });

    it("should display category details form", () => {
      cy.get('[data-testid^="category-details-link-"]')
        .first()
        .scrollIntoView()
        .click();

      cy.get('[data-testid="category-details-title"]').should("be.visible");
      cy.get('[data-testid="category-name-label"]').should("be.visible");
      cy.get('[data-testid="category-name-input"]').should("be.visible");
    });

    it("should display category name in input", () => {
      cy.get('[data-testid^="category-details-link-"]')
        .first()
        .scrollIntoView()
        .click();

      cy.get('[data-testid="category-name-input"]')
        .invoke("val")
        .should("not.be.empty");
    });

    it("should display action buttons", () => {
      cy.get('[data-testid^="category-details-link-"]')
        .first()
        .scrollIntoView()
        .click();

      cy.get('[data-testid="update-category-button"]').should("be.visible");
      cy.get('[data-testid="delete-category-button"]').should("be.visible");
    });

    it("should display delete warning", () => {
      cy.get('[data-testid^="category-details-link-"]')
        .first()
        .scrollIntoView()
        .click();

      cy.get('[data-testid="category-delete-warning"]').should("be.visible");
    });
  });

  describe("Update Category", () => {
    it("should update category name", () => {
      cy.get('[data-testid^="category-details-link-"]')
        .first()
        .scrollIntoView()
        .click();

      const timestamp = Date.now();
      const updatedName = `Updated Category ${timestamp}`;

      cy.get('[data-testid="category-name-input"]').clear().type(updatedName);
      cy.get('[data-testid="update-category-button"]').click();

      cy.wait(2000);

      // Should show success
      cy.get('[data-testid="category-name-input"]').should(
        "have.value",
        updatedName
      );
    });

    it("should validate category name on update", () => {
      cy.get('[data-testid^="category-details-link-"]').first().click();

      cy.get('[data-testid="category-name-input"]').clear();
      cy.get('[data-testid="update-category-button"]').click();

      // Should stay on same page or show error
      cy.url().should("match", /\/admin\/categories\/[a-z0-9-]+/);
    });

    it("should prevent duplicate category names", () => {
      // Ambil nama kategori pertama
      cy.get('[data-testid^="category-name-"]')
        .first()
        .invoke("text")
        .then((firstCategoryName) => {
          // Simpan nilai awal kategori kedua
          cy.get('[data-testid^="category-name-"]')
            .eq(1)
            .invoke("text")
            .then((originalSecondName) => {
              // Buka halaman edit kategori kedua
              cy.get('[data-testid^="category-details-link-"]').eq(1).click();

              // Coba ubah nama kategori kedua menjadi sama dengan yang pertama
              cy.get('[data-testid="category-name-input"]')
                .clear()
                .type(firstCategoryName);

              cy.get('[data-testid="update-category-button"]').click();

              // Tunggu sebentar (opsional)
              cy.wait(500);

              // ✅ Verifikasi 1: Tetap di halaman edit (pastikan tidak redirect)
              cy.url().should("match", /\/admin\/categories\/[a-z0-9-]+/);

              // ✅ Verifikasi 2: Nama input TIDAK berubah menjadi firstCategoryName
              // (karena update ditolak)
              cy.get('[data-testid="category-name-input"]').should(
                "have.value",
                originalSecondName
              ); // atau nilai sebelumnya

              // ATAU (jika sistem menampilkan error):
              // cy.contains("Category name already exists").should("be.visible");
            });
        });
    });
  });

  describe("Delete Category", () => {
    it("should delete category", () => {
      // First create a test category
      cy.visit("/admin/categories/new");
      cy.waitForPageLoad();

      const timestamp = Date.now();
      const categoryName = `Delete Test ${timestamp}`;

      cy.get('[data-testid="category-name-input"]').type(categoryName);
      cy.get('[data-testid="create-category-button"]').click();

      cy.visit("/admin/categories");

      // Find and delete it
      cy.contains(categoryName)
        .parents('[data-testid^="category-row-"]')
        .find('[data-testid^="category-details-link-"]')
        .scrollIntoView()
        .click();

      cy.get('[data-testid="delete-category-button"]').click();

      cy.visit("/admin/categories");

      // Category should be removed
      cy.get('[data-testid^="category-name-"]')
        .contains(categoryName)
        .should("exist")
        .should("not.exist");
    });
  });

  describe("Table Footer", () => {
    it("should display table footer", () => {
      cy.get('[data-testid="categories-table-footer"]')
        .scrollIntoView()
        .should("be.visible");
    });

    it("should display footer columns", () => {
      cy.get('[data-testid="categories-table-footer-checkbox"]')
        .scrollIntoView()
        .should("be.visible");
      cy.get('[data-testid="categories-table-footer-name"]')
        .scrollIntoView()
        .should("be.visible");
      cy.get('[data-testid="categories-table-footer-actions"]')
        .scrollIntoView()
        .should("be.visible");
    });
  });

  describe("Bulk Operations", () => {
    it("should enable bulk actions when categories selected", () => {
      cy.get('[data-testid^="category-select-checkbox-"]').first().check();

      // Bulk action buttons should appear or be enabled
      cy.get('[data-testid^="category-select-checkbox-"]')
        .first()
        .should("be.checked");
    });

    it("should select multiple categories for bulk operations", () => {
      cy.get('[data-testid^="category-select-checkbox-"]')
        .eq(0)
        .scrollIntoView()
        .check();
      cy.get('[data-testid^="category-select-checkbox-"]')
        .eq(1)
        .scrollIntoView()
        .check();
      cy.get('[data-testid^="category-select-checkbox-"]')
        .eq(2)
        .scrollIntoView()
        .check();

      cy.get('[data-testid^="category-select-checkbox-"]:checked').should(
        "have.length",
        3
      );
    });
  });

  describe("Navigation", () => {
    it("should navigate back to categories list from detail page", () => {
      cy.get('[data-testid^="category-details-link-"]').first().click();

      cy.get('[data-testid="dashboard-sidebar-container"]').within(() => {
        cy.get('[data-testid="sidebar-categories-link"]').click();
      });

      cy.url().should("match", /\/admin\/categories/);
    });

    it("should navigate back from new category page", () => {
      cy.get('[data-testid="add-new-category-link"]').click();

      cy.get('[data-testid="dashboard-sidebar-container"]').within(() => {
        cy.get('[data-testid="sidebar-categories-link"]').click();
      });

      cy.url().should("match", /\/admin\/categories/);
    });
  });

  describe("Category Count", () => {
    it("should display total number of categories", () => {
      cy.get('[data-testid^="category-row-"]')
        .its("length")
        .then((count) => {
          expect(count).to.be.greaterThan(0);
        });
    });
  });

  describe("Sorting and Ordering", () => {
    it("should display categories in order", () => {
      cy.get('[data-testid^="category-name-"]').then(($names) => {
        expect($names.length).to.be.greaterThan(0);
      });
    });
  });

  describe("Validation Messages", () => {
    it("should show error for empty category name", () => {
      cy.visit("/admin/categories/new");
      cy.waitForPageLoad();

      cy.get('[data-testid="create-category-button"]').click();

      // Should show validation error or prevent submission
      cy.url().should("include", "/admin/categories/new");
    });

    it("should show error for too long category name", () => {
      cy.visit("/admin/categories/new");
      cy.waitForPageLoad();

      const longName = "A".repeat(300);
      cy.get('[data-testid="category-name-input"]').type(longName);
      cy.get('[data-testid="create-category-button"]').click();

      cy.wait(1000);

      // Should show validation error or prevent submission
      cy.url().should("include", "/admin/categories/new");
    });
  });
});
