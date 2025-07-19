;; contracts/loan-request.clar
;; Manage loan applications in a decentralized microcredit system

;; Error constants
(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-ALREADY-EXISTS u101)
(define-constant ERR-NOT-FOUND u102)
(define-constant ERR-INVALID-STATUS u103)

;; Verified authorities (should be managed by a governance contract in production)
(define-map verified-authorities principal bool)

;; Loan requests map
(define-map loan-requests
  uint ;; loan ID
  {
    borrower: principal,
    amount: uint,
    term: uint, ;; in days
    status: (string-ascii 32)
  }
)

;; Global loan counter
(define-data-var loan-counter uint u0)

;; Private utility: check if caller is a verified authority
(define-private (is-verified-authority (caller principal))
  (default-to false (map-get? verified-authorities caller))
)

;; PUBLIC: Submit a loan request (only verified authorities)
(define-public (submit-loan-request (amount uint) (term uint))
  (begin
    (asserts! (is-verified-authority tx-sender) (err ERR-NOT-AUTHORIZED))
    (let ((id (+ u1 (var-get loan-counter))))
      (map-set loan-requests id {
        borrower: tx-sender,
        amount: amount,
        term: term,
        status: "pending"
      })
      (var-set loan-counter id)
      (ok id)
    )
  )
)

;; PUBLIC: Update loan status (only verified authorities)
(define-public (update-loan-status (id uint) (new-status (string-ascii 32)))
  (let ((request (map-get? loan-requests id)))
    (match request
      ((some entry))
        (begin
          (asserts! (is-verified-authority tx-sender) (err ERR-NOT-AUTHORIZED))
          (map-set loan-requests id {
            borrower: (get borrower entry),
            amount: (get amount entry),
            term: (get term entry),
            status: new-status
          })
          (ok true)
        )
      none
        (err ERR-NOT-FOUND)
    )
  )
)

;; READ-ONLY: Get loan request by ID
(define-read-only (get-loan (id uint))
  (map-get? loan-requests id)
)
