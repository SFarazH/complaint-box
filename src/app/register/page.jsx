"use client";

import React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, UserPlus, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { cn } from "../../lib/utils";
import Link from "next/link";
import { useAuth } from "../../context/auth-context";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { customInputStyles } from "../../components/styles";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const { register, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match, sweetie!");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Password should be at least 6 characters, cutie!");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswords()) {
      toast.error(passwordError);
      return;
    }

    if (!name.trim() || !username.trim() || !password.trim()) {
      toast.error("Please fill in all fields, cutie! 💕");
      return;
    }

    setIsSubmitting(true);

    try {
      await register(name, username, password);
      setSuccess(true);

      setName("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="text-pink-500"
        >
          <Heart className="h-16 w-16 fill-pink-500" />
        </motion.div>
        <p className="mt-4 text-pink-600 font-medium">Loading, sweetie...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <style jsx global>
        {customInputStyles}
      </style>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-8 border-2 border-pink-200 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-pink-100 rounded-full opacity-50" />
          <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-purple-100 rounded-full opacity-50" />

          <div className="relative">
            <div className="flex items-center justify-center mb-6">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="bg-pink-100 rounded-full p-3 mr-3"
              >
                <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
              </motion.div>
              <h1 className="text-2xl font-bold text-pink-600 tracking-tight">
                Pookie Register
              </h1>
              <motion.div
                whileHover={{ rotate: -10, scale: 1.1 }}
                className="bg-pink-100 rounded-full p-3 ml-3"
              >
                <Sparkles className="w-6 h-6 text-pink-500" />
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              {!success ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-pink-700 font-medium">
                      your name, cutie
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="rounded-xl border-pink-200 no-focus-ring pink-focus"
                      placeholder="Enter your name..."
                      required
                      style={{ boxShadow: "none" }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="username"
                      className="text-pink-700 font-medium"
                    >
                      username, sweetie
                    </Label>
                    <Input
                      id="username"
                      type="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="rounded-xl border-pink-200 no-focus-ring pink-focus"
                      placeholder="Enter your username..."
                      required
                      style={{ boxShadow: "none" }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-pink-700 font-medium"
                    >
                      password, babe
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-xl border-pink-200 no-focus-ring pink-focus"
                      placeholder="Create a password..."
                      required
                      style={{ boxShadow: "none" }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-pink-700 font-medium"
                    >
                      confirm password, Darling
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="rounded-xl border-pink-200 no-focus-ring pink-focus"
                      placeholder="Confirm your password..."
                      required
                      style={{ boxShadow: "none" }}
                    />
                    {passwordError && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-pink-500 text-sm mt-1"
                      >
                        {passwordError}
                      </motion.p>
                    )}
                  </div>

                  <div className="pt-2">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                          "w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500",
                          "text-white rounded-xl py-6 font-medium text-lg shadow-md transition-all no-focus-ring button-no-border button-focus"
                        )}
                        style={{
                          boxShadow: "none",
                          outline: "none",
                          border: "none",
                        }}
                      >
                        {isSubmitting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            }}
                          >
                            <Sparkles className="mr-2 h-5 w-5" />
                          </motion.div>
                        ) : (
                          <UserPlus className="mr-2 h-5 w-5" />
                        )}
                        {isSubmitting ? "Creating account..." : "Register"}
                      </Button>
                    </motion.div>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-pink-600">
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        className="font-medium text-purple-500 hover:text-purple-600 transition-colors"
                      >
                        <motion.span
                          initial={{ x: 0 }}
                          animate={{ x: [0, -4, 0] }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                          }}
                          className="inline-block mr-1"
                        >
                          <ArrowLeft className="h-4 w-4 inline" />
                        </motion.span>
                        Login here
                      </Link>
                    </p>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center py-10"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                    className="inline-block mb-4"
                  >
                    <Heart className="h-16 w-16 text-pink-500 fill-pink-500" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-pink-600 mb-2">
                    Welcome, pookie!
                  </h3>
                  <p className="text-pink-500">
                    Your account has been created with love ❤️
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
