import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { AuthProvider } from "../contexts/AuthContext";
import { GameProvider } from "../contexts/GameContext";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import { TooltipProvider } from "@/components/ui/tooltip";

// Mock Supabase for tests
vi.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithOtp: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      insert: vi.fn(),
      upsert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
    channel: vi.fn(() => ({
      on: vi.fn(() => ({
        subscribe: vi.fn(),
      })),
    })),
    rpc: vi.fn(),
  },
  signInWithEmail: vi.fn(),
  signOut: vi.fn(),
  getCurrentUser: vi.fn(),
  getRandomDestination: vi
    .fn()
    .mockResolvedValue([
      { id: 1, city: "Paris", country: "France", clues: ["Clue 1", "Clue 2"] },
    ]),
  getMultipleDestinations: vi.fn().mockResolvedValue([
    { id: 2, city: "London", country: "UK" },
    { id: 3, city: "Tokyo", country: "Japan" },
    { id: 4, city: "New York", country: "USA" },
  ]),
  checkAnswer: vi.fn().mockResolvedValue({
    correct: true,
    fact: "This is a test fact.",
  }),
  createOrUpdateUserProfile: vi.fn(),
  getUserStats: vi.fn().mockResolvedValue({ correct: 5, total: 10 }),
  updateUserScore: vi.fn(),
  createGameSession: vi.fn(),
  getSessionCreatorStats: vi.fn(),
}));

// Create a custom render method that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <GameProvider>{children}</GameProvider>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from testing-library
export * from "@testing-library/react";

// Override the render method
export { customRender as render };
