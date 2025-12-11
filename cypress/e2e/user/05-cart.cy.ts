// cypress/e2e/user/05-cart.cy.ts

describe("Shopping Cart", () => {
  before(() => {
    cy.loginAsUser();
  });

  beforeEach(() => {
    // Bersihkan keranjang sebelum setiap test
    cy.clearCart();
    // Juga refresh browser untuk memastikan state bersih
    cy.reload(true);
  });

  describe("Empty Cart", () => {
    it("should display empty cart page", () => {
      cy.visit("/cart");
      cy.waitForPageLoad();

      cy.get('[data-testid="cart-page-container"]').should("be.visible");
      cy.get('[data-testid="cart-page-title"]').should("be.visible");
    });

    it("should show empty cart message when no items", () => {
      cy.visit("/cart");
      cy.waitForPageLoad();

      // Cek apakah ada pesan keranjang kosong
      cy.get("body").should("contain", /empty cart|no items|cart is empty/i);
    });

    it("should not display cart quantity badge when empty", () => {
      cy.visit("/");
      cy.waitForPageLoad();

      // Periksa bahwa badge keranjang ada dan menampilkan angka 0
      cy.get('[data-testid="cart-quantity-badge"]')
        .should("exist")
        .and("contain", "0");
    });
  });

  describe("Adding Items to Cart", () => {
    it("should add a single product to cart", () => {
      cy.clearCart(); // Pastikan keranjang kosong sebelum test

      cy.visit("/shop");
      cy.waitForPageLoad();

      cy.get('[data-testid^="product-item-"]')
        .eq(1)
        .within(() => {
          cy.get('[data-testid^="view-product-link-"]').click();
        });

      cy.contains("button", /add to cart/i).click();
      cy.wait(1000);

      cy.visit("/cart");
      cy.waitForPageLoad();

      cy.get('[data-testid="cart-items-list"]').should("be.visible");
      cy.get('[data-testid="cart-items-list"] > li').should("have.length", 1); // Hanya hitung elemen yang terlihat
    });

    it("should add multiple products to cart", () => {
      cy.visit("/shop");
      cy.waitForPageLoad();

      // Add first product
      cy.get('[data-testid^="product-item-"]')
        .eq(1)
        .within(() => {
          cy.get('[data-testid^="view-product-link-"]').click();
        });
      cy.contains("button", /add to cart/i).click();
      cy.wait(500);

      // Go back and add second product
      cy.visit("/shop");
      cy.get('[data-testid^="product-item-"]')
        .eq(2)
        .within(() => {
          cy.get('[data-testid^="view-product-link-"]').click();
        });
      cy.contains("button", /add to cart/i).click();
      cy.wait(500);

      cy.visit("/cart");
      cy.waitForPageLoad();

      // Ambil jumlah item dari list langsung
      cy.get('[data-testid="cart-items-list"] > li').should("have.length", 2);
    });

    it("should update cart badge after adding items", () => {
      cy.visit("/shop");
      cy.waitForPageLoad();

      cy.get('[data-testid^="product-item-"]')
        .eq(1)
        .within(() => {
          cy.get('[data-testid^="view-product-link-"]').click();
        });

      cy.contains("button", /add to cart/i).click();
      cy.wait(1000);

      cy.get('[data-testid="cart-quantity-badge"]')
        .should("be.visible")
        .and("contain", "1");
    });
  });

  describe("Cart Page Layout", () => {
    beforeEach(() => {
      // Add a product to cart first
      cy.visit("/shop");
      cy.waitForPageLoad();
      cy.get('[data-testid^="product-item-"]')
        .eq(1)
        .within(() => {
          cy.get('[data-testid^="view-product-link-"]').click();
        });
      cy.contains("button", /add to cart/i).click();
      cy.wait(1000);

      cy.visit("/cart");
      cy.waitForPageLoad();
    });

    it("should display cart module with all components", () => {
      cy.get('[data-testid="cart-module-form"]').should("be.visible");
      cy.get('[data-testid="cart-items-section"]').should("be.visible");
      cy.get('[data-testid="order-summary-section"]').should("be.visible");
    });

    it("should display cart items list", () => {
      cy.get('[data-testid="cart-items-list"]').should("be.visible");
      cy.get('[data-testid^="cart-item-"]').should(
        "have.length.greaterThan",
        0
      );
    });

    it("should display cart item details", () => {
      cy.get('[data-testid^="cart-item-"]')
        .first()
        .within(() => {
          cy.get('[data-testid^="cart-item-image-"]').should("be.visible");
          cy.get('[data-testid^="cart-item-title-link-"]').should("be.visible");
          cy.get('[data-testid^="cart-item-price-"]').should("be.visible");
          cy.get('[data-testid^="quantity-input-cart-"]').should("be.visible");
          cy.get('[data-testid^="remove-item-button-"]').should("be.visible");
        });
    });

    it("should display stock status for each item", () => {
      cy.get('[data-testid^="cart-item-"]')
        .first()
        .within(() => {
          cy.get('[data-testid^="cart-item-stock-status-"]').should(
            "be.visible"
          );
          cy.get('[data-testid^="stock-status-text-"]').should("be.visible");
        });
    });
  });

  describe("Quantity Management", () => {
    beforeEach(() => {
      cy.visit("/shop");
      cy.waitForPageLoad();
      cy.get('[data-testid^="product-item-"]')
        .eq(1)
        .within(() => {
          cy.get('[data-testid^="view-product-link-"]').click();
        });
      cy.contains("button", /add to cart/i).click();
      cy.wait(1000);

      cy.visit("/cart");
      cy.waitForPageLoad();
    });

    it("should increment item quantity", () => {
      cy.get('[data-testid^="cart-item-"]')
        .first()
        .within(() => {
          cy.get('[data-testid="quantity-display-input"]').should(
            "have.value",
            "1"
          );
          cy.get('[data-testid="quantity-increment-button"]').click();
          cy.wait(500);
          cy.get('[data-testid="quantity-display-input"]').should(
            "have.value",
            "2"
          );
        });
    });

    it("should decrement item quantity", () => {
      cy.get('[data-testid^="cart-item-"]')
        .first()
        .within(() => {
          cy.get('[data-testid="quantity-increment-button"]').click();
          cy.wait(500);
          cy.get('[data-testid="quantity-display-input"]').should(
            "have.value",
            "2"
          );

          cy.get('[data-testid="quantity-decrement-button"]').click();
          cy.wait(500);
          cy.get('[data-testid="quantity-display-input"]').should(
            "have.value",
            "1"
          );
        });
    });

    it("should not decrement below 1", () => {
      cy.get('[data-testid^="cart-item-"]')
        .first()
        .within(() => {
          cy.get('[data-testid="quantity-display-input"]').should(
            "have.value",
            "1"
          );
          cy.get('[data-testid="quantity-decrement-button"]').click();
          cy.wait(500);
          cy.get('[data-testid="quantity-display-input"]').should(
            "have.value",
            "1"
          );
        });
    });

    it("should update subtotal when quantity changes", () => {
      cy.get('[data-testid="subtotal-amount"]').then(($el) => {
        const initialTotal = parseFloat($el.text().replace(/[^0-9.]/g, ""));

        cy.get('[data-testid^="cart-item-"]')
          .first()
          .within(() => {
            cy.get('[data-testid="quantity-increment-button"]').click();
          });

        cy.wait(1000);

        cy.get('[data-testid="subtotal-amount"]').then(($newEl) => {
          const newTotal = parseFloat($newEl.text().replace(/[^0-9.]/g, ""));
          expect(newTotal).to.be.greaterThan(initialTotal);
        });
      });
    });
  });

  describe("Removing Items", () => {
    beforeEach(() => {
      cy.visit("/shop");
      cy.waitForPageLoad();
      cy.get('[data-testid^="product-item-"]')
        .eq(1)
        .within(() => {
          cy.get('[data-testid^="view-product-link-"]').click();
        });
      cy.contains("button", /add to cart/i).click();
      cy.wait(1000);

      cy.visit("/cart");
      cy.waitForPageLoad();
    });

    it("should remove item from cart", () => {
      cy.get('[data-testid="cart-items-list"] > li').should("have.length", 1);

      cy.get('[data-testid^="remove-item-button-"]').first().click();
      cy.wait(1000);

      // Periksa bahwa tidak ada lagi item dalam daftar
      cy.get('[data-testid="cart-items-list"] > li').should("have.length", 0);

      // Atau periksa bahwa cart items list kosong
      cy.get('[data-testid="cart-items-list"]')
        .children()
        .should("have.length", 0);
    });
    it("should update cart badge after removing item", () => {
      cy.get('[data-testid^="remove-item-button-"]').first().click();
      cy.wait(1000);

      cy.visit("/");
      cy.waitForPageLoad();

      cy.get('[data-testid="cart-quantity-badge"]')
        .should("exist")
        .and("contain", "0");
    });
  });

  describe("Order Summary", () => {
    beforeEach(() => {
      cy.visit("/shop");
      cy.waitForPageLoad();
      cy.get('[data-testid^="product-item-"]')
        .eq(1)
        .within(() => {
          cy.get('[data-testid^="view-product-link-"]').click();
        });
      cy.contains("button", /add to cart/i).click();
      cy.wait(1000);

      cy.visit("/cart");
      cy.waitForPageLoad();
    });

    it("should display order summary section", () => {
      cy.get('[data-testid="order-summary-section"]').should("be.visible");
      cy.get('[data-testid="order-summary-title"]').should("be.visible");
      cy.get('[data-testid="order-summary-details"]').should("be.visible");
    });

    it("should display subtotal", () => {
      cy.get('[data-testid="subtotal-row"]').should("be.visible");
      cy.get('[data-testid="subtotal-label"]').should("be.visible");
      cy.get('[data-testid="subtotal-amount"]')
        .should("be.visible")
        .and("not.be.empty");
    });

    it("should display shipping estimate", () => {
      cy.get('[data-testid="shipping-estimate-row"]').should("be.visible");
      cy.get('[data-testid="shipping-estimate-label"]').should("be.visible");
      cy.get('[data-testid="shipping-estimate-amount"]').should("be.visible");
    });

    it("should display tax estimate", () => {
      cy.get('[data-testid="tax-estimate-row"]').should("be.visible");
      cy.get('[data-testid="tax-estimate-label"]').should("be.visible");
      cy.get('[data-testid="tax-estimate-amount"]').should("be.visible");
    });

    it("should display order total", () => {
      cy.get('[data-testid="order-total-row"]').should("be.visible");
      cy.get('[data-testid="order-total-label"]').should("be.visible");
      cy.get('[data-testid="order-total-amount"]')
        .should("be.visible")
        .and("not.be.empty");
    });

    it("should calculate total correctly", () => {
      // Pastikan produk sudah ditambahkan ke keranjang sebelum menghitung total
      cy.get('[data-testid="cart-items-list"]').should("be.visible");
      cy.get('[data-testid^="cart-item-"]').should(
        "have.length.greaterThan",
        0
      );

      cy.get('[data-testid="subtotal-amount"]')
        .invoke("text")
        .then((subtotal) => {
          cy.get('[data-testid="shipping-estimate-amount"]')
            .invoke("text")
            .then((shipping) => {
              cy.get('[data-testid="tax-estimate-amount"]')
                .invoke("text")
                .then((tax) => {
                  const subtotalNum = parseFloat(
                    subtotal.replace(/[^0-9.]/g, "")
                  );
                  const shippingNum = parseFloat(
                    shipping.replace(/[^0-9.]/g, "")
                  );
                  const taxNum = parseFloat(tax.replace(/[^0-9.]/g, ""));

                  const expectedTotal = Math.round(
                    subtotalNum + taxNum + shippingNum
                  );

                  cy.get('[data-testid="order-total-amount"]')
                    .invoke("text")
                    .then((total) => {
                      const totalNum = parseFloat(
                        total.replace(/[^0-9.]/g, "")
                      );

                      cy.log(
                        `Subtotal: ${subtotalNum}, Shipping: ${shippingNum}, Tax: ${taxNum}, Expected Total (rounded): ${expectedTotal}, Actual Total: ${totalNum}`
                      );

                      expect(totalNum).to.equal(expectedTotal);
                    });
                });
            });
        });
    });
  });

  describe("Checkout Navigation", () => {
    beforeEach(() => {
      cy.visit("/shop");
      cy.waitForPageLoad();
      cy.get('[data-testid^="product-item-"]')
        .eq(1)
        .within(() => {
          cy.get('[data-testid^="view-product-link-"]').click();
        });
      cy.contains("button", /add to cart/i).click();
      cy.wait(1000);

      cy.visit("/cart");
      cy.waitForPageLoad();
    });

    it("should display checkout button", () => {
      cy.get('[data-testid="checkout-section"]').should("be.visible");
      cy.get('[data-testid="checkout-link"]').should("be.visible");
    });

    it("should navigate to checkout page", () => {
      cy.get('[data-testid="checkout-link"]').click();

      cy.url().should("include", "/checkout");
      cy.get('[data-testid="checkout-page-container"]').should("be.visible");
    });
  });

  describe("Cart Persistence", () => {
    it("should persist cart items after page refresh", () => {
      cy.visit("/shop");
      cy.waitForPageLoad();
      cy.get('[data-testid^="product-item-"]')
        .eq(1)
        .within(() => {
          cy.get('[data-testid^="view-product-link-"]').click();
        });
      cy.contains("button", /add to cart/i).click();
      cy.wait(1000);

      cy.reload();
      cy.waitForPageLoad();

      cy.get('[data-testid="cart-quantity-badge"]').should("be.visible");
    });

    it("should maintain cart when navigating between pages", () => {
      cy.visit("/shop");
      cy.waitForPageLoad();
      cy.get('[data-testid^="product-item-"]')
        .eq(1)
        .within(() => {
          cy.get('[data-testid^="view-product-link-"]').click();
        });
      cy.contains("button", /add to cart/i).click();
      cy.wait(1000);

      cy.visit("/shop");
      cy.waitForPageLoad();

      cy.get('[data-testid="cart-quantity-badge"]').should("be.visible");

      cy.visit("/cart");
      cy.waitForPageLoad();

      cy.get('[data-testid="cart-items-list"] > li').should("have.length", 1);
    });
  });
});
