import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import app from "../src/app.js";

let server, baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise(r => server.once("listening", r));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise(r => server.close(r));
});

test("health check", async () => {
  const r = await fetch(`${baseUrl}/api/health`);
  assert.equal(r.status, 200);
  assert.equal((await r.json()).status, "healthy");
});

test("readiness check", async () => {
  const r = await fetch(`${baseUrl}/api/ready`);
  assert.equal(r.status, 200);
});

test("security headers", async () => {
  const r = await fetch(`${baseUrl}/api/health`);
  assert.ok(r.headers.get("content-security-policy"));
  assert.ok(r.headers.get("x-content-type-options"));
});

test("invalid data rejected", async () => {
  const r = await fetch(`${baseUrl}/api/applications`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({name:"",email:"bad",phone:"x",course:"Invalid",message:"bad"})
  });
  assert.equal(r.status, 400);
  assert.ok((await r.json()).errors);
});

test("valid application created", async () => {
  const r = await fetch(`${baseUrl}/api/applications`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      name:"Regression Student",
      email:"regression@example.com",
      phone:"9876543210",
      course:"Full Stack Development",
      message:"Testing the production-ready capstone."
    })
  });
  assert.equal(r.status, 201);
  assert.ok((await r.json()).data.id);
});

test("applications list", async () => {
  const r = await fetch(`${baseUrl}/api/applications`);
  assert.equal(r.status, 200);
  assert.ok(Array.isArray((await r.json()).data));
});

test("unknown API route", async () => {
  const r = await fetch(`${baseUrl}/api/not-found`);
  assert.equal(r.status, 404);
});
