// Shared Tailwind classes so every page looks the same.
export const ui = {
  input: "rounded border px-3 py-2",
  button: "rounded bg-black px-4 py-2 text-white disabled:opacity-50 dark:bg-white dark:text-black",
  smallButton: "rounded border px-2 py-1 text-sm disabled:opacity-50",
  dangerButton: "rounded border border-red-600 px-2 py-1 text-sm text-red-700 disabled:opacity-50",
  link: "underline",
  table: "w-full border-collapse text-left text-sm",
  th: "border-b px-2 py-2 font-semibold",
  td: "border-b px-2 py-2 align-top",
  error: "text-red-600",
  success: "text-green-700",
};

// What a server action sends back to the form or button that called it.
export type ActionState = { error?: string; message?: string };
