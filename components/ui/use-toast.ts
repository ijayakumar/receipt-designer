import { create } from "zustand"

type ToastProps = {
  id: string
  title?: string
  description?: string
  duration?: number
  variant?: "default" | "destructive" | "success"
  className?: string
}

type ToastStore = {
  toasts: ToastProps[]
  addToast: (toast: Omit<ToastProps, "id">) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9)
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }))
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }))
    }, toast.duration || 5000)
  },
  removeToast: (id) =>
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      })),
}))

export const useToast = () => {
  const { addToast } = useToastStore()
  return { toast: addToast }
}

export const toast = (props: Omit<ToastProps, "id">) => {
  const { addToast } = useToastStore.getState()
  addToast(props)
}

