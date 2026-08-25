import { test } from "node:test";
import assert from "node:assert/strict";

// token.js reads JWT_SECRET at import time, so set it before importing.
process.env.JWT_SECRET = "test-secret-for-ci";
const { signToken, verifyToken } = await import("../src/utils/token.js");

test("signToken + verifyToken round-trips the payload", () => {
    const token = signToken({ id: 42, role: "user", email: "a@b.com" });
    const decoded = verifyToken(token);
    assert.equal(decoded.id, 42);
    assert.equal(decoded.role, "user");
    assert.equal(decoded.email, "a@b.com");
});

test("verifyToken throws on a malformed token", () => {
    assert.throws(() => verifyToken("not.a.jwt"));
});

test("verifyToken throws when the token was signed with a different secret", async () => {
    const jwt = (await import("jsonwebtoken")).default;
    const foreign = jwt.sign({ id: 1 }, "some-other-secret");
    assert.throws(() => verifyToken(foreign));
});

test("signToken sets a 24h expiry", () => {
    const decoded = verifyToken(signToken({ id: 1 }));
    assert.equal(decoded.exp - decoded.iat, 24 * 60 * 60);
});
