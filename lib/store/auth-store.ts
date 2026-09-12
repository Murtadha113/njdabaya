import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface MockAddress {
  id: string
  label: string
  city: string
  details: string
}

interface AuthState {
  isLoggedIn: boolean
  name: string
  email: string
  phone: string
  addresses: MockAddress[]
  login: (email: string, name?: string) => void
  logout: () => void
  updateProfile: (data: Partial<Pick<AuthState, "name" | "email" | "phone">>) => void
  addAddress: (address: Omit<MockAddress, "id">) => void
  removeAddress: (id: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      name: "",
      email: "",
      phone: "",
      addresses: [],
      login: (email, name) =>
        set({ isLoggedIn: true, email, name: name || email.split("@")[0] }),
      logout: () => set({ isLoggedIn: false, name: "", email: "", phone: "" }),
      updateProfile: (data) => set((state) => ({ ...state, ...data })),
      addAddress: (address) =>
        set((state) => ({
          addresses: [...state.addresses, { ...address, id: crypto.randomUUID() }],
        })),
      removeAddress: (id) =>
        set((state) => ({ addresses: state.addresses.filter((a) => a.id !== id) })),
    }),
    { name: "abaya-auth" }
  )
)
