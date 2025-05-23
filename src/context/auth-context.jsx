"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";

const AuthContext = createContext();

async function loginApi(username, password) {
  try {
    const response = await axios.post(
      `/api/users/login`,
      {
        username,
        password,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Login error:", error);
    throw error;
  }
}

async function registerApi(name, username, password) {
  try {
    const response = await fetch(`/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

async function verifyApi() {
  try {
    const response = await axios.get(`/api/users/verify`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Verification error:", error);
    throw error;
  }
}

// Auth Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const verifyUser = async () => {
    try {
      const userData = await verifyApi();
      setUser(userData.user);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const data = await loginApi(username, password);
      localStorage.setItem("auth_token", data.token);
      setUser(data.user);
      toast.success("Welcome back, pookie! 💖");
      router.push("/"); // Redirect to home page
    } catch (error) {
      toast.error(error.message || "Login failed, sweetie 😢");
      throw error;
    } finally {
      setIsLoading(false);
      await verifyUser();
    }
  };

  // Register function
  const register = async (name, username, password) => {
    setIsLoading(true);
    try {
      const data = await registerApi(name, username, password);
      setUser(data.user);
      toast.success("Welcome to the family, cutie! 💕");
      router.push("/");
    } catch (error) {
      toast.error(error.message || "Registration failed, sweetie 😢");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post(`/api/users/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      await verifyUser();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
