const loans = [
  { _id: 1, book_id: 1, patron_id: 1, date_borrowed: new Date("2025-03-01"), date_returned: new Date("2025-03-15") },
  { _id: 2, book_id: 5, patron_id: 1, date_borrowed: new Date("2025-03-10"), date_returned: null },
  { _id: 3, book_id: 9, patron_id: 1, date_borrowed: new Date("2025-03-20"), date_returned: null },
  { _id: 4, book_id: 3, patron_id: 2, date_borrowed: new Date("2025-02-01"), date_returned: new Date("2025-02-20") },
  { _id: 5, book_id: 2, patron_id: 3, date_borrowed: new Date("2025-01-15"), date_returned: new Date("2025-02-15") },
  { _id: 6, book_id: 6, patron_id: 3, date_borrowed: new Date("2025-03-05"), date_returned: null },
  { _id: 7, book_id: 8, patron_id: 3, date_borrowed: new Date("2025-03-08"), date_returned: null },
  { _id: 8, book_id: 10, patron_id: 3, date_borrowed: new Date("2025-03-12"), date_returned: new Date("2025-03-25") },
  { _id: 9, book_id: 4, patron_id: 5, date_borrowed: new Date("2025-02-20"), date_returned: new Date("2025-03-10") },
  { _id: 10, book_id: 7, patron_id: 5, date_borrowed: new Date("2025-03-01"), date_returned: null },
]

export default loans
