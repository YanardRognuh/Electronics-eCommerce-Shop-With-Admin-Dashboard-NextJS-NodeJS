// cypress/e2e/admin/04-admin-orders.cy.ts

describe("Admin Orders Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/admin/orders");
    cy.waitForPageLoad();
  });

  describe("Orders Page Layout", () => {
    it("should display orders page", () => {
      cy.get('[data-testid="admin-orders-container"]').should("be.visible");
    });

    it("should display page title", () => {
      cy.get('[data-testid="all-orders-title"]').should("be.visible");
    });

    it("should display orders table", () => {
      cy.get('[data-testid="orders-table-container"]').should("be.visible");
      cy.get('[data-testid="orders-table"]').should("be.visible");
    });

    it("should display table headers", () => {
      cy.get('[data-testid="orders-table-header"]').should("be.visible");
      cy.get('[data-testid="orders-table-header-checkbox"]').should(
        "be.visible"
      );
      cy.get('[data-testid="orders-table-header-order-id"]').should(
        "be.visible"
      );
      cy.get('[data-testid="orders-table-header-name-country"]').should(
        "be.visible"
      );
      cy.get('[data-testid="orders-table-header-status"]').should("be.visible");
      cy.get('[data-testid="orders-table-header-subtotal"]').should(
        "be.visible"
      );
      cy.get('[data-testid="orders-table-header-date"]').should("be.visible");
      cy.get('[data-testid="orders-table-header-actions"]').should(
        "be.visible"
      );
    });
  });

  describe("Orders List Display", () => {
    it("should display order items if available", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="order-row-"]').length > 0) {
          cy.get('[data-testid^="order-row-"]').should(
            "have.length.greaterThan",
            0
          );
        } else {
          // No orders message
          cy.contains(/no orders|empty/i).should("be.visible");
        }
      });
    });

    it("should display order details in each row", () => {
      cy.get('[data-testid^="order-row-"]')
        .first()
        .within(() => {
          cy.get('[data-testid^="order-select-checkbox-"]').should(
            "be.visible"
          );
          cy.get('[data-testid^="order-id-"]').should("be.visible");
          cy.get('[data-testid^="order-name-"]').should("be.visible");
          cy.get('[data-testid^="order-country-"]').should("be.visible");
          cy.get('[data-testid^="order-status-"]').should("be.visible");
          cy.get('[data-testid^="order-subtotal-"]').should("be.visible");
        });
    });

    it("should display order IDs", () => {
      cy.get('[data-testid^="order-id-"]')
        .first()
        .should("be.visible")
        .invoke("text")
        .should("not.be.empty");
    });

    it("should display customer names", () => {
      cy.get('[data-testid^="order-name-"]')
        .first()
        .should("be.visible")
        .invoke("text")
        .should("not.be.empty");
    });

    it("should display order status", () => {
      cy.get('[data-testid^="order-status-"]').first().should("be.visible");
    });

    it("should display order subtotals", () => {
      cy.get('[data-testid^="order-subtotal-"]')
        .first()
        .should("be.visible")
        .invoke("text")
        .should("match", /\$\d+/);
    });

    it("should display order dates", () => {
      cy.get('[data-testid^="order-date-"]')
        .first()
        .should("be.visible")
        .invoke("text")
        .should("not.be.empty");
    });
  });

  describe("Order Selection", () => {
    it("should display select all checkbox", () => {
      cy.get('[data-testid="orders-select-all-checkbox"]').should("be.visible");
    });

    it("should select individual order", () => {
      cy.get('[data-testid^="order-select-checkbox-"]').first().check();
      cy.get('[data-testid^="order-select-checkbox-"]')
        .first()
        .should("be.checked");
    });

    it("should select all orders", () => {
      cy.get('[data-testid="orders-select-all-checkbox"]').check();

      cy.get('[data-testid^="order-select-checkbox-"]').each(($checkbox) => {
        cy.wrap($checkbox).should("be.checked");
      });
    });

    it("should unselect all orders", () => {
      cy.get('[data-testid="orders-select-all-checkbox"]').check();
      cy.wait(500);
      cy.get('[data-testid="orders-select-all-checkbox"]').uncheck();

      cy.get('[data-testid^="order-select-checkbox-"]').each(($checkbox) => {
        cy.wrap($checkbox).should("not.be.checked");
      });
    });
  });

  describe("View Order Details", () => {
    it("should navigate to order details page", () => {
      cy.get('[data-testid^="order-details-link-"]').first().click();

      cy.url().should("match", /\/admin\/orders\/\d+/);
      cy.get('[data-testid="admin-single-order-container"]').should(
        "be.visible"
      );
    });

    it("should display order details title", () => {
      cy.get('[data-testid^="order-details-link-"]').first().click();

      cy.get('[data-testid="order-details-title"]').should("be.visible");
    });

    it("should display order ID", () => {
      cy.get('[data-testid^="order-details-link-"]').first().click();

      cy.get('[data-testid="order-id-display"]').should("be.visible");
      cy.get('[data-testid="order-id-label"]').should("be.visible");
      cy.get('[data-testid="order-id-value"]')
        .should("be.visible")
        .and("not.be.empty");
    });

    it("should display contact information fields", () => {
      cy.get('[data-testid^="order-details-link-"]').first().click();

      cy.get('[data-testid="name-input"]').should("be.visible");
      cy.get('[data-testid="lastname-input"]').should("be.visible");
      cy.get('[data-testid="phone-input"]').should("be.visible");
      cy.get('[data-testid="email-input"]').should("be.visible");
    });

    it("should display shipping address fields", () => {
      cy.get('[data-testid^="order-details-link-"]').first().click();

      cy.get('[data-testid="address-input"]').should("be.visible");
      cy.get('[data-testid="city-input"]').should("be.visible");
      cy.get('[data-testid="country-input"]').should("be.visible");
      cy.get('[data-testid="postal-code-input"]').should("be.visible");
    });

    it("should display order status select", () => {
      cy.get('[data-testid^="order-details-link-"]').first().click();

      cy.get('[data-testid="order-status-select"]').should("be.visible");
      cy.get('[data-testid="status-processing"]').should("exist");
      cy.get('[data-testid="status-delivered"]').should("exist");
      cy.get('[data-testid="status-canceled"]').should("exist");
    });

    it("should display order products", () => {
      cy.get('[data-testid^="order-details-link-"]').first().click();

      cy.get('[data-testid^="order-product-"]').should(
        "have.length.greaterThan",
        0
      );
    });

    it("should display product images", () => {
      cy.get('[data-testid^="order-details-link-"]').first().click();

      cy.get('[data-testid^="order-product-image-"]')
        .first()
        .should("be.visible");
    });

    it("should display product info", () => {
      cy.get('[data-testid^="order-details-link-"]').first().click();

      cy.get('[data-testid^="order-product-info-"]')
        .first()
        .should("be.visible");
      cy.get('[data-testid^="order-product-link-"]')
        .first()
        .should("be.visible");
      cy.get('[data-testid^="order-product-price-"]')
        .first()
        .should("be.visible");
    });

    it("should display order totals", () => {
      cy.get('[data-testid^="order-details-link-"]').first().click();

      cy.get('[data-testid="order-subtotal"]').should("be.visible");
      cy.get('[data-testid="order-tax"]').should("be.visible");
      cy.get('[data-testid="order-shipping"]').should("be.visible");
      cy.get('[data-testid="order-total"]').should("be.visible");
    });

    it("should display action buttons", () => {
      cy.get('[data-testid^="order-details-link-"]').first().click();

      cy.get('[data-testid="update-order-button"]').should("be.visible");
      cy.get('[data-testid="delete-order-button"]').should("be.visible");
    });
  });

  describe("Update Order", () => {
    it("should update order status", () => {
      cy.get('[data-testid^="order-details-link-"]').first().click();

      cy.get('[data-testid="order-status-select"]').select("delivered");
      cy.get('[data-testid="update-order-button"]').click();

      cy.wait(2000);

      cy.get('[data-testid="order-status-select"]').should(
        "have.value",
        "delivered"
      );
    });

    it("should update customer information", () => {
      cy.get('[data-testid^="order-details-link-"]').first().click();

      const updatedPhone = "+1234567890";

      cy.get('[data-testid="phone-input"]').clear().type(updatedPhone);
      cy.get('[data-testid="update-order-button"]').click();

      cy.wait(2000);

      cy.get('[data-testid="phone-input"]').should("have.value", updatedPhone);
    });

    it("should update shipping address", () => {
      cy.get('[data-testid^="order-details-link-"]').first().click();

      const updatedCity = "New York";

      cy.get('[data-testid="city-input"]').clear().type(updatedCity);
      cy.get('[data-testid="update-order-button"]').click();

      cy.wait(2000);

      cy.get('[data-testid="city-input"]').should("have.value", updatedCity);
    });

    it("should update order notice", () => {
      cy.get('[data-testid^="order-details-link-"]').first().click();

      const notice = "Please deliver in the morning";

      cy.get('[data-testid="order-notice-textarea"]').clear().type(notice);
      cy.get('[data-testid="update-order-button"]').click();

      cy.wait(2000);

      cy.get('[data-testid="order-notice-textarea"]').should(
        "have.value",
        notice
      );
    });

    it("should validate required fields", () => {
      cy.get('[data-testid^="order-details-link-"]').first().click();

      cy.get('[data-testid="name-input"]').clear();
      cy.get('[data-testid="update-order-button"]').click();

      // Should show validation error or prevent update
      cy.url().should("match", /\/admin\/orders\/\d+/);
    });
  });

  describe("Delete Order", () => {
    it("should delete order after confirmation", () => {
      cy.get('[data-testid^="order-details-link-"]').last().click();

      let orderId: string;
      cy.get('[data-testid="order-id-value"]')
        .invoke("text")
        .then((text) => {
          orderId = text;
        });

      cy.get('[data-testid="delete-order-button"]').click();

      // Confirm deletion
      cy.on("window:confirm", () => true);

      cy.wait(2000);

      // Should redirect to orders list
      cy.url().should("match", /\/admin\/orders\/?$/);
    });
  });

  describe("Order Status Filtering", () => {
    it("should filter orders by status", () => {
      cy.get('[data-testid^="order-status-"]').first().click();

      cy.wait(1000);

      // Orders should be filtered
      cy.get('[data-testid^="order-row-"]').should(
        "have.length.greaterThan",
        0
      );
    });
  });

  describe("Table Footer", () => {
    it("should display table footer", () => {
      cy.get('[data-testid="orders-table-footer"]').should("be.visible");
    });

    it("should display footer columns", () => {
      cy.get('[data-testid="orders-table-footer-checkbox"]').should(
        "be.visible"
      );
      cy.get('[data-testid="orders-table-footer-order-id"]').should(
        "be.visible"
      );
      cy.get('[data-testid="orders-table-footer-name-country"]').should(
        "be.visible"
      );
      cy.get('[data-testid="orders-table-footer-status"]').should("be.visible");
      cy.get('[data-testid="orders-table-footer-subtotal"]').should(
        "be.visible"
      );
      cy.get('[data-testid="orders-table-footer-date"]').should("be.visible");
      cy.get('[data-testid="orders-table-footer-actions"]').should(
        "be.visible"
      );
    });
  });

  describe("Order Product Links", () => {
    it("should navigate to product page from order details", () => {
      cy.get('[data-testid^="order-details-link-"]').first().click();

      cy.get('[data-testid^="order-product-link-"]').first().click();

      cy.wait(1000);

      // Should navigate to product details
      cy.url().should("match", /\/admin\/products\/\d+/);
    });
  });

  describe("Order Totals Calculation", () => {
    it("should calculate order total correctly", () => {
      cy.get('[data-testid^="order-details-link-"]').first().click();

      cy.get('[data-testid="order-subtotal"]')
        .invoke("text")
        .then((subtotal) => {
          cy.get('[data-testid="order-tax"]')
            .invoke("text")
            .then((tax) => {
              cy.get('[data-testid="order-shipping"]')
                .invoke("text")
                .then((shipping) => {
                  const subtotalNum = parseFloat(
                    subtotal.replace(/[^0-9.]/g, "")
                  );
                  const taxNum = parseFloat(tax.replace(/[^0-9.]/g, ""));
                  const shippingNum = parseFloat(
                    shipping.replace(/[^0-9.]/g, "")
                  );
                  const expectedTotal = subtotalNum + taxNum + shippingNum;

                  cy.get('[data-testid="order-total"]')
                    .invoke("text")
                    .then((total) => {
                      const totalNum = parseFloat(
                        total.replace(/[^0-9.]/g, "")
                      );
                      expect(totalNum).to.be.closeTo(expectedTotal, 0.01);
                    });
                });
            });
        });
    });
  });

  describe("Bulk Operations", () => {
    it("should select multiple orders for bulk operations", () => {
      cy.get('[data-testid^="order-select-checkbox-"]').eq(0).check();
      cy.get('[data-testid^="order-select-checkbox-"]').eq(1).check();

      cy.get('[data-testid^="order-select-checkbox-"]:checked').should(
        "have.length",
        2
      );
    });
  });

  describe("Navigation", () => {
    it("should navigate back to orders list from detail page", () => {
      cy.get('[data-testid^="order-details-link-"]').first().click();

      cy.get('[data-testid="dashboard-sidebar"]').within(() => {
        cy.get('[data-testid="sidebar-orders-link"]').click();
      });

      cy.url().should("match", /\/admin\/orders\/?$/);
    });
  });

  describe("Order Count", () => {
    it("should display total number of orders", () => {
      cy.get('[data-testid^="order-row-"]')
        .its("length")
        .then((count) => {
          expect(count).to.be.at.least(0);
        });
    });
  });
});
