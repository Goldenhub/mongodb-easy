const patrons = [
  { _id: 1, name: "Alice Johnson", email: "alice@example.com", membership: "premium", joined: new Date("2023-01-15"), borrowed_books: [1, 5, 9] },
  { _id: 2, name: "Bob Smith", email: "bob@example.com", membership: "basic", joined: new Date("2023-03-20"), borrowed_books: [3] },
  { _id: 3, name: "Carol Williams", email: "carol@example.com", membership: "premium", joined: new Date("2022-11-01"), borrowed_books: [2, 6, 8, 10] },
  { _id: 4, name: "Dave Brown", email: "dave@example.com", membership: "basic", joined: new Date("2024-02-10"), borrowed_books: [] },
  { _id: 5, name: "Eve Davis", email: "eve@example.com", membership: "premium", joined: new Date("2023-07-05"), borrowed_books: [4, 7] },
]

export default patrons
