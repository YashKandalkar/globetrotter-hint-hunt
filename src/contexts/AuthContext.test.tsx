import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, act, renderHook } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";
import { BrowserRouter } from "react-router-dom";
import { getCurrentUser } from "../lib/supabase";

// Mock the Supabase client
vi.mock("../lib/supabase", async () => {
  const actual = await vi.importActual("../lib/supabase");
  return {
    ...actual,
    supabase: {
      auth: {
        onAuthStateChange: vi.fn((callback) => {
          callback("SIGNED_IN", {
            user: { id: "test-user-id", email: "test@example.com" },
          });
          return { data: { subscription: { unsubscribe: vi.fn() } } };
        }),
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
        signOut: vi.fn().mockResolvedValue({ error: null }),
      },
      from: vi.fn((table) => {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: {
                  score: 10,
                  games_played: 5,
                  username: "testuser",
                },
                error: null,
              }),
            })),
          })),
          insert: vi.fn(),
          upsert: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: { username: "testuser" },
                error: null,
              }),
            })),
          })),
        };
      }),
      channel: vi.fn(() => ({
        on: vi.fn(() => ({
          subscribe: vi.fn(),
        })),
      })),
    },
    getCurrentUser: vi.fn(),
    createOrUpdateUserProfile: vi
      .fn()
      .mockResolvedValue({ id: "test-user-id", username: "testuser" }),
  };
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>{children}</AuthProvider>
  </BrowserRouter>
);

describe("AuthContext", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it("should provide user state and auth functions", async () => {
    const mockUser = { id: "test-user-id", email: "test@example.com" };
    (getCurrentUser as any).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for auth state to update
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.user).toEqual(mockUser);
    expect(typeof result.current.signOut).toBe("function");
    expect(typeof result.current.setUsername).toBe("function");
  });

  it("should set username and store it in localStorage", async () => {
    const mockUser = { id: "test-user-id", email: "test@example.com" };
    (getCurrentUser as any).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for auth state to update
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    await act(async () => {
      await result.current.setUsername("newUsername");
    });

    expect(result.current.username).toBe("newUsername");
    expect(localStorage.getItem("globetrotter_username")).toBe("newUsername");
  });

  it("should handle sign out", async () => {
    const mockUser = { id: "test-user-id", email: "test@example.com" };
    (getCurrentUser as any).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for auth state to update
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.user).toEqual(mockUser);

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.username).toBeNull();
    expect(localStorage.getItem("globetrotter_username")).toBeNull();
  });
});
