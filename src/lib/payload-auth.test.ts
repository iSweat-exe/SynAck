import type { Payload } from "payload";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const supabase = vi.hoisted(() => ({
  getUser: vi.fn(),
  rpc: vi.fn(),
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: () => ({
    auth: { getUser: supabase.getUser },
    rpc: supabase.rpc,
  }),
  parseCookieHeader: () => [],
}));

import { supabaseStrategy } from "@/lib/payload-auth";

function fakePayload(existing: unknown[] = [], emailCount = 0) {
  return {
    find: vi.fn().mockResolvedValue({ docs: existing }),
    count: vi.fn().mockResolvedValue({ totalDocs: emailCount }),
    create: vi
      .fn()
      .mockImplementation(async ({ data }) => ({ id: 7, ...data })),
  };
}

function run(payload: ReturnType<typeof fakePayload>) {
  return supabaseStrategy.authenticate({
    headers: new Headers(),
    payload: payload as unknown as Payload,
  } as Parameters<typeof supabaseStrategy.authenticate>[0]);
}

const signedIn = {
  data: {
    user: {
      id: "u-1",
      email: "ada@example.test",
      user_metadata: { user_name: "ada" },
    },
  },
  error: null,
};

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54321");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon");
  supabase.getUser.mockReset();
  supabase.rpc.mockReset();
});

afterEach(() => vi.unstubAllEnvs());

describe("supabaseStrategy", () => {
  it("denies when Supabase is not configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    expect((await run(fakePayload())).user).toBeNull();
  });

  it("denies a visitor without a Supabase session", async () => {
    supabase.getUser.mockResolvedValue({ data: { user: null }, error: null });
    const payload = fakePayload();
    expect((await run(payload)).user).toBeNull();
    expect(payload.create).not.toHaveBeenCalled();
  });

  it("denies a member without cms.access and creates nothing", async () => {
    supabase.getUser.mockResolvedValue(signedIn);
    supabase.rpc.mockResolvedValue({
      data: ["exercises.run"],
      error: null,
    });
    const payload = fakePayload();
    expect((await run(payload)).user).toBeNull();
    expect(payload.create).not.toHaveBeenCalled();
  });

  it("denies when the permission lookup fails", async () => {
    supabase.getUser.mockResolvedValue(signedIn);
    supabase.rpc.mockResolvedValue({ data: null, error: { message: "boom" } });
    expect((await run(fakePayload())).user).toBeNull();
  });

  it("creates the Payload user on the first sign-in of an editor", async () => {
    supabase.getUser.mockResolvedValue(signedIn);
    supabase.rpc.mockResolvedValue({
      data: ["cms.access", "courses.create", "not.in_the_list"],
      error: null,
    });
    const payload = fakePayload();
    const { user } = await run(payload);

    expect(payload.create).toHaveBeenCalledOnce();
    expect(payload.create.mock.calls[0][0].data).toMatchObject({
      supabaseId: "u-1",
      email: "ada@example.test",
      name: "ada",
    });
    expect(user).toMatchObject({
      collection: "users",
      permissions: ["cms.access", "courses.create"],
    });
  });

  it("reuses the Payload user on the next sign-ins", async () => {
    supabase.getUser.mockResolvedValue(signedIn);
    supabase.rpc.mockResolvedValue({ data: ["cms.access"], error: null });
    const payload = fakePayload([{ id: 3, supabaseId: "u-1" }]);
    const { user } = await run(payload);

    expect(payload.create).not.toHaveBeenCalled();
    expect(user).toMatchObject({ id: 3, permissions: ["cms.access"] });
  });

  it("uses a placeholder e-mail when the real one is already taken", async () => {
    supabase.getUser.mockResolvedValue(signedIn);
    supabase.rpc.mockResolvedValue({ data: ["cms.access"], error: null });
    const payload = fakePayload([], 1);
    await run(payload);

    expect(payload.create.mock.calls[0][0].data.email).toBe(
      "u-1@sso.synack.invalid",
    );
  });
});
