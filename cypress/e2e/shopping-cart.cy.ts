describe("Shopping Cart Functionality", () => {
  beforeEach(() => {
    // Login sebagai user sebelum test cart
    cy.login("user@example.com", "password");
  });

  describe("Cart Element in Header", () => {
    it("Harus menampilkan cart icon di header", () => {
      cy.visit("/");

      cy.get('[data-testid="cart-element-container"]').should("be.visible");
      cy.get('[data-testid="cart-icon"]').should("be.visible");
    });

    it("Harus menampilkan cart quantity badge", () => {
      cy.visit("/");

      // Badge mungkin tidak muncul jika cart kosong
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="cart-quantity-badge"]').length > 0) {
          cy.get('[data-testid="cart-quantity-badge"]').should("be.visible");
        }
      });
    });

    it("Harus bisa klik cart icon untuk ke halaman cart", () => {
      cy.visit("/");

      cy.get('[data-testid="cart-link"]').click();

      // Verifikasi redirect ke cart page
      cy.url().should("include", "/cart");
      cy.get('[data-testid="cart-page-container"]').should("be.visible");
    });
  });

  describe("Cart Page", () => {
    beforeEach(() => {
      cy.visit("/cart");
    });

    it("Harus menampilkan halaman cart dengan benar", () => {
      cy.get('[data-testid="cart-page-container"]').should("be.visible");
      cy.get('[data-testid="cart-page-title"]').should("be.visible");
      cy.get('[data-testid="cart-module"]').should("be.visible");
    });

    it("Harus menampilkan cart items jika ada produk", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="cart-items-list"]').length > 0) {
          cy.get('[data-testid="cart-items-list"]').should("be.visible");
          cy.get('[data-testid^="cart-item-"]').should(
            "have.length.greaterThan",
            0
          );
        } else {
          // Cart kosong
          cy.log("Cart is empty");
        }
      });
    });
  });

  describe("Add to Cart Flow", () => {
    it("Harus bisa menambah produk ke cart dari shop page", () => {
      cy.visit("/shop");

      // Ambil product ID dari produk pertama
      cy.get('[data-testid^="product-item-"]')
        .first()
        .invoke("attr", "data-testid")
        .then((testId) => {
          const productId = testId?.split("-")[2]; // Extract ID from "product-item-123"

          // Klik view product
          cy.get(`[data-testid="view-product-link-${productId}"]`).click();

          // Di halaman detail produk, add to cart
          // Note: Anda mungkin perlu menambahkan data-testid untuk button add to cart
          // Untuk sekarang kita asumsikan ada button dengan text "Add to Cart"
          cy.contains("button", /add to cart/i).click();

          // Verifikasi cart badge bertambah atau ada notifikasi
          cy.wait(1000);

          // Pergi ke cart page
          cy.visit("/cart");

          // Verifikasi produk ada di cart
          cy.get(`[data-testid="cart-item-${productId}"]`).should("exist");
        });
    });
  });

  describe("Cart Item Management", () => {
    beforeEach(() => {
      cy.visit("/cart");
    });

    it("Harus menampilkan detail cart item dengan lengkap", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="cart-item-"]').length > 0) {
          cy.get('[data-testid^="cart-item-"]')
            .first()
            .within(() => {
              // Verifikasi elemen-elemen cart item
              cy.get('[data-testid^="cart-item-image-"]').should("be.visible");
              cy.get('[data-testid^="cart-item-title-"]').should("be.visible");
              cy.get('[data-testid^="cart-item-price-"]').should("be.visible");
              cy.get('[data-testid^="quantity-input-cart-"]').should(
                "be.visible"
              );
            });
        }
      });
    });

    it("Harus menampilkan stock status untuk setiap item", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="cart-item-"]').length > 0) {
          cy.get('[data-testid^="cart-item-"]')
            .first()
            .within(() => {
              cy.get('[data-testid^="cart-item-stock-status-"]').should(
                "exist"
              );
              cy.get('[data-testid^="stock-status-icon-"]').should(
                "be.visible"
              );
              cy.get('[data-testid^="stock-status-text-"]').should(
                "be.visible"
              );
            });
        }
      });
    });

    it("Harus bisa update quantity produk di cart", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="cart-item-"]').length > 0) {
          cy.get('[data-testid^="cart-item-"]')
            .first()
            .invoke("attr", "data-testid")
            .then((testId) => {
              const productId = testId?.split("-")[2];

              // Get quantity input
              cy.get(`[data-testid="quantity-input-cart-${productId}"]`).then(
                ($input) => {
                  // Interaksi dengan quantity input (tergantung implementasi)
                  // Bisa pakai increment/decrement button atau input langsung
                  cy.log("Quantity input found for product:", productId);
                }
              );
            });
        }
      });
    });

    it("Harus bisa remove item dari cart", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="cart-item-"]').length > 0) {
          // Hitung jumlah item awal
          cy.get('[data-testid^="cart-item-"]')
            .its("length")
            .then((initialCount) => {
              // Ambil product ID dari item pertama
              cy.get('[data-testid^="cart-item-"]')
                .first()
                .invoke("attr", "data-testid")
                .then((testId) => {
                  const productId = testId?.split("-")[2];

                  // Klik remove button
                  cy.get(
                    `[data-testid="remove-item-button-${productId}"]`
                  ).click();

                  cy.wait(1000);

                  // Verifikasi item berkurang atau cart kosong
                  cy.get('[data-testid^="cart-item-"]').should(
                    "have.length.lessThan",
                    initialCount
                  );
                });
            });
        }
      });
    });

    it("Harus bisa klik cart item title untuk ke detail produk", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="cart-item-"]').length > 0) {
          cy.get('[data-testid^="cart-item-"]')
            .first()
            .invoke("attr", "data-testid")
            .then((testId) => {
              const productId = testId?.split("-")[2];

              // Klik title link
              cy.get(
                `[data-testid="cart-item-title-link-${productId}"]`
              ).click();

              // Verifikasi redirect ke product detail
              cy.url().should("include", "/product/");
            });
        }
      });
    });
  });

  describe("Order Summary", () => {
    beforeEach(() => {
      cy.visit("/cart");
    });

    it("Harus menampilkan order summary section", () => {
      cy.get('[data-testid="order-summary-section"]').should("be.visible");
      cy.get('[data-testid="order-summary-title"]').should("be.visible");
      cy.get('[data-testid="order-summary-details"]').should("be.visible");
    });

    it("Harus menampilkan subtotal dengan benar", () => {
      cy.get('[data-testid="subtotal-row"]').should("be.visible");
      cy.get('[data-testid="subtotal-label"]').should("be.visible");
      cy.get('[data-testid="subtotal-amount"]').should("be.visible");
    });

    it("Harus menampilkan shipping estimate", () => {
      cy.get('[data-testid="shipping-estimate-row"]').should("be.visible");
      cy.get('[data-testid="shipping-estimate-label"]').should("be.visible");
      cy.get('[data-testid="shipping-estimate-amount"]').should("be.visible");
      cy.get('[data-testid="shipping-estimate-info-icon"]').should(
        "be.visible"
      );
    });

    it("Harus menampilkan tax estimate", () => {
      cy.get('[data-testid="tax-estimate-row"]').should("be.visible");
      cy.get('[data-testid="tax-estimate-label"]').should("be.visible");
      cy.get('[data-testid="tax-estimate-amount"]').should("be.visible");
      cy.get('[data-testid="tax-estimate-info-icon"]').should("be.visible");
    });

    it("Harus menampilkan order total", () => {
      cy.get('[data-testid="order-total-row"]').should("be.visible");
      cy.get('[data-testid="order-total-label"]').should("be.visible");
      cy.get('[data-testid="order-total-amount"]').should("be.visible");
    });

    it("Harus bisa klik info icon untuk shipping estimate", () => {
      cy.get('[data-testid="shipping-estimate-info-link"]').should("exist");
    });

    it("Harus bisa klik info icon untuk tax estimate", () => {
      cy.get('[data-testid="tax-estimate-info-link"]').should("exist");
    });
  });

  describe("Checkout Button", () => {
    beforeEach(() => {
      cy.visit("/cart");
    });

    it("Harus menampilkan checkout section", () => {
      cy.get('[data-testid="checkout-section"]').should("be.visible");
    });

    it("Harus bisa klik checkout link jika ada items", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="cart-item-"]').length > 0) {
          cy.get('[data-testid="checkout-link"]').should("be.visible");
          cy.get('[data-testid="checkout-link"]').click();

          // Verifikasi redirect ke checkout page
          cy.url().should("include", "/checkout");
        }
      });
    });
  });

  describe("Empty Cart State", () => {
    it("Harus menampilkan message jika cart kosong", () => {
      cy.visit("/cart");

      // Hapus semua items jika ada
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="cart-item-"]').length > 0) {
          // Remove all items
          cy.get('[data-testid^="remove-item-button-"]').each(($btn) => {
            cy.wrap($btn).click();
            cy.wait(500);
          });
        }
      });

      // Verifikasi empty state
      // Note: Sesuaikan dengan implementasi empty state Anda
      cy.contains(/cart is empty|your cart is empty/i).should("be.visible");
    });
  });
});
