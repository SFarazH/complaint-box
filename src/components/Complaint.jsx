"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../context/auth-context";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Send, Sparkles, LogOut, Book } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { cn } from "../lib/utils";
import { customInputStyles } from "./styles";
import { toast } from "react-hot-toast";
import axios from "axios";
import Link from "next/link";

export default function ComplaintBox() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const [complaint, setComplaint] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [hearts, setHearts] = useState([]);

  const submitMsg = async () => {
    return await axios.post(
      `/api/messages`,
      { message: complaint },
      { withCredentials: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (complaint.trim()) {
      try {
        const res = await submitMsg();

        if (res.status === 201) {
          toast.success("Message submitted successfully!");
          setSubmitted(true);
          setTimeout(() => {
            setSubmitted(false);
            setComplaint("");
          }, 3000);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Something went wrong");
      }
    }
  };

  if (isLoading) {
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <style jsx global>
        {customInputStyles}
      </style>

      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="fixed pointer-events-none z-10"
          initial={{ x: `${heart.x}vw`, y: "100vh", opacity: 0, scale: 0 }}
          animate={{ y: `${heart.y}vh`, opacity: 1, scale: [0, 1.5, 1] }}
          exit={{ opacity: 0, y: "0vh" }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <Heart className="text-pink-400 w-6 h-6 fill-pink-400" />
        </motion.div>
      ))}

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold text-pink-600 mb-3"
          >
            welcome, {user?.name || "Pookie"}! 💕
          </motion.h1>
          <Link href="/journal">
            <Button
              variant="outline"
              className="bg-white/80 border-pink-200 text-pink-600 hover:bg-pink-100 hover:text-pink-700 rounded-xl mb-3"
            >
              <Book className="mr-2 h-5 w-5" />
              View Journal
            </Button>
          </Link>
        </div>
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
                Pookie Complaint Box
              </h1>
              <motion.div
                whileHover={{ rotate: -10, scale: 1.1 }}
                className="bg-pink-100 rounded-full p-3 ml-3"
              >
                <Sparkles className="w-6 h-6 text-pink-500" />
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleSubmit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  className="space-y-4"
                >
                  <h1 className="text-center text-lg font-semibold text-pink-600 tracking-tight">
                    hi babe
                  </h1>

                  <div className="space-y-2">
                    <Label
                      htmlFor="complaint"
                      className="text-pink-700 font-medium"
                    >
                      what's bothering you?
                    </Label>
                    <Textarea
                      id="complaint"
                      value={complaint}
                      onChange={(e) => setComplaint(e.target.value)}
                      className="min-h-[120px] rounded-xl border-pink-200 no-focus-ring pink-focus"
                      placeholder="tell me what's wrong..."
                      required
                      style={{ boxShadow: "none" }}
                    />
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="pt-2"
                  >
                    <Button
                      type="submit"
                      className={cn(
                        "w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500",
                        "text-white rounded-xl py-6 font-medium text-lg shadow-md transition-all no-focus-ring button-no-border button-focus"
                      )}
                      style={{
                        boxShadow: "none",
                        outline: "none",
                        border: "none",
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                      }}
                    >
                      <Send className="mr-2 h-5 w-5" /> Send Complaint
                    </Button>
                  </motion.div>
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
                    Thank you, pookie!
                  </h3>
                  <p className="text-pink-500">
                    your complaint has been received ❤️
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={logout}
              className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl py-6 px-8 font-medium text-lg"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
