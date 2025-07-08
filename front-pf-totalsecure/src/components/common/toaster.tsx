import { Toaster as Toast } from "react-hot-toast";
import { useTheme } from "next-themes";

const Toaster = () => {
  const { theme } = useTheme();
  return (
    <Toast
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        style: {
          background: theme === "dark" ? "#18181b" : "#fff",
          color: theme === "dark" ? "#fff" : "#18181b",
          border: theme === "dark" ? "1px solid #27272a" : "1px solid #e5e7eb",
        },
        success: {
          iconTheme: {
            primary: theme === "dark" ? "#22c55e" : "#22c55e",
            secondary: theme === "dark" ? "#18181b" : "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: theme === "dark" ? "#ef4444" : "#ef4444",
            secondary: theme === "dark" ? "#18181b" : "#fff",
          },
        },
      }}
    />
  );
};

export default Toaster;
