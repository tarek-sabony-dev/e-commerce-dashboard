/* for initial data seeding, we will use it later  */

import { insertProduct, listProducts } from "@/actions/actions";

insertProduct(
{
  product: {
    title: "Sample Product",
    description: "This is a sample product.",
    price: "19.99",
    discountedPrice: "14.99",
    reviewsCount: 12,
    stock: 100,
  },
  categories: [
    {
      categoryId: 21,
    },
  ]
  ,
  images: [
    {
      kind: "thumbnail",
      sortOrder: 1,
      url: "/sample-product-thumb.png",
    },
    {
      kind: "preview",
      sortOrder: 2,
      url: "/sample-product-snap.png",
    }
  ],
}
).then(() => {
  console.log("Product added successfully.");
}).catch(error => {
  console.error("Error adding product:", error);
});

// Fetch and log products to verify

listProducts().then(products => {
  console.log("Fetched products:", products);
}).catch(error => {
  console.error("Error fetching products:", error);
});