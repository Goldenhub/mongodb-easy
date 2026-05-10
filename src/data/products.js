const products = [
  { _id: 1, name: "Ergonomic Keyboard", category: "electronics", price: 89.99, stock: 25, tags: ["keyboard", "wireless", "ergonomic"], reviews: [{ user: "alice", rating: 5, text: "Best keyboard ever!" }, { user: "bob", rating: 4, text: "Great but expensive" }] },
  { _id: 2, name: "Mechanical Mouse", category: "electronics", price: 49.99, stock: 40, tags: ["mouse", "wired"], reviews: [{ user: "carol", rating: 3, text: "Average mouse" }] },
  { _id: 3, name: "Notebook Pro", category: "stationery", price: 4.99, stock: 200, tags: ["paper", "lined"], reviews: [{ user: "dave", rating: 5, text: "Perfect for notes" }, { user: "eve", rating: 4, text: "Nice quality" }] },
  { _id: 4, name: "Desk Lamp", category: "furniture", price: 34.99, stock: 15, tags: ["lighting", "LED"], reviews: [{ user: "alice", rating: 4, text: "Bright and energy efficient" }] },
  { _id: 5, name: "Monitor Stand", category: "furniture", price: 59.99, stock: 0, tags: ["stand", "adjustable"], reviews: [{ user: "bob", rating: 2, text: "Wobbly" }, { user: "carol", rating: 3, text: "Does the job" }] },
  { _id: 6, name: "USB-C Hub", category: "electronics", price: 29.99, stock: 60, tags: ["hub", "USB-C", "ports"], reviews: [{ user: "dave", rating: 5, text: "All the ports I need" }] },
  { _id: 7, name: "Wireless Headphones", category: "electronics", price: 149.99, stock: 10, tags: ["audio", "wireless", "noise-canceling"], reviews: [{ user: "eve", rating: 5, text: "Amazing sound quality" }, { user: "alice", rating: 4, text: "Comfortable for long use" }] },
  { _id: 8, name: "Coffee Mug", category: "kitchen", price: 12.99, stock: 100, tags: ["ceramic", "dishwasher-safe"], reviews: [] },
]

export default products
