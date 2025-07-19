import { describe, it, expect, beforeEach } from "vitest"

const mockLoanContract = {
  verifiedAuthorities: new Map<string, boolean>(),
  loanRequests: new Map<number, any>(),
  loanCounter: 0,

  isVerifiedAuthority(caller: string) {
    return this.verifiedAuthorities.has(caller)
  },

  submitLoanRequest(caller: string, amount: number, term: number) {
    if (!this.isVerifiedAuthority(caller)) return { error: 100 }

    const id = this.loanCounter + 1
    this.loanRequests.set(id, {
      borrower: caller,
      amount,
      term,
      status: "pending"
    })
    this.loanCounter = id
    return { value: id }
  },

  updateLoanStatus(caller: string, id: number, newStatus: string) {
    const request = this.loanRequests.get(id)
    if (!request) return { error: 102 }
    if (!this.isVerifiedAuthority(caller)) return { error: 100 }

    this.loanRequests.set(id, {
      ...request,
      status: newStatus
    })

    return { value: true }
  },

  getLoan(id: number) {
    return this.loanRequests.get(id) || null
  }
}

describe("Loan Request Contract", () => {
  const authority = "ST1AUTH999999999999999999999999999999999"
  const user = "ST2USER111111111111111111111111111111111"

  beforeEach(() => {
    mockLoanContract.verifiedAuthorities = new Map()
    mockLoanContract.loanRequests = new Map()
    mockLoanContract.loanCounter = 0
    mockLoanContract.verifiedAuthorities.set(authority, true)
  })

  it("allows a verified authority to submit a loan request", () => {
    const result = mockLoanContract.submitLoanRequest(authority, 5000, 30)
    expect(result).toHaveProperty("value", 1)

    const loan = mockLoanContract.getLoan(1)
    expect(loan).toMatchObject({
      borrower: authority,
      amount: 5000,
      term: 30,
      status: "pending"
    })
  })

  it("prevents unverified user from submitting a loan request", () => {
    const result = mockLoanContract.submitLoanRequest(user, 3000, 15)
    expect(result).toEqual({ error: 100 })
  })

  it("allows verified authority to update loan status", () => {
    mockLoanContract.submitLoanRequest(authority, 1000, 10)
    const result = mockLoanContract.updateLoanStatus(authority, 1, "approved")
    expect(result).toEqual({ value: true })

    const updated = mockLoanContract.getLoan(1)
    expect(updated?.status).toBe("approved")
  })

  it("rejects status update by non-authority", () => {
    mockLoanContract.submitLoanRequest(authority, 1000, 10)
    const result = mockLoanContract.updateLoanStatus(user, 1, "approved")
    expect(result).toEqual({ error: 100 })
  })

  it("returns error for unknown loan ID", () => {
    const result = mockLoanContract.updateLoanStatus(authority, 99, "rejected")
    expect(result).toEqual({ error: 102 })
  })
})
