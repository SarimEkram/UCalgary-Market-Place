import { test } from "node:test";
import assert from "node:assert/strict";

process.env.JWT_SECRET = "test-secret-for-ci";
const { signToken } = await import("../src/utils/token.js");
const { requireAuth, requireAdmin } = await import("../src/middleware/auth.js");

// Minimal Express res double capturing status()/json().
function mockRes() {
    return {
        statusCode: null,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(payload) {
            this.body = payload;
            return this;
        },
    };
}

test("requireAuth rejects a request with no token (401)", () => {
    const res = mockRes();
    let nextCalled = false;
    requireAuth({ cookies: {} }, res, () => {
        nextCalled = true;
    });
    assert.equal(res.statusCode, 401);
    assert.equal(nextCalled, false);
});

test("requireAuth accepts a valid token and populates req.user", () => {
    const req = { cookies: { token: signToken({ id: 7, role: "user" }) } };
    const res = mockRes();
    let nextCalled = false;
    requireAuth(req, res, () => {
        nextCalled = true;
    });
    assert.equal(nextCalled, true);
    assert.equal(req.user.id, 7);
});

test("requireAuth rejects an invalid token (401)", () => {
    const res = mockRes();
    requireAuth({ cookies: { token: "garbage" } }, res, () => {});
    assert.equal(res.statusCode, 401);
});

test("requireAdmin blocks non-admin users (403)", () => {
    const req = { cookies: { token: signToken({ id: 7, role: "user" }) } };
    const res = mockRes();
    let nextCalled = false;
    requireAdmin(req, res, () => {
        nextCalled = true;
    });
    assert.equal(res.statusCode, 403);
    assert.equal(nextCalled, false);
});

test("requireAdmin allows admin users through", () => {
    const req = { cookies: { token: signToken({ id: 1, role: "admin" }) } };
    const res = mockRes();
    let nextCalled = false;
    requireAdmin(req, res, () => {
        nextCalled = true;
    });
    assert.equal(nextCalled, true);
    assert.equal(res.statusCode, null);
});
