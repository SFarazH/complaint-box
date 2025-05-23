"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Book,
  Calendar,
  ArrowLeft,
  Trash2,
  Sparkles,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import Link from "next/link";
import { useAuth } from "../../context/auth-context";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import axios from "axios";

const BackgroundHeart = ({ id, delay }) => {
  const size = Math.random() * 30 + 10;
  const duration = Math.random() * 20 + 20;
  const startX = Math.random() * 100;
  const startY = Math.random() * 100;
  const endX = Math.random() * 100;
  const endY = Math.random() * 100;
  const rotate = Math.random() * 360;
  const maxOpacity = Math.random() * 0.5 + 0.3;

  return (
    <motion.div
      key={id}
      className="fixed pointer-events-none z-0"
      initial={{
        x: `${startX}vw`,
        y: `${startY}vh`,
        opacity: 0,
        rotate: 0,
      }}
      animate={{
        x: `${endX}vw`,
        y: `${endY}vh`,
        opacity: [0, maxOpacity, 0],
        rotate: rotate,
        scale: [0, 1, 0.8, 0],
      }}
      transition={{
        duration: duration,
        ease: "easeInOut",
        delay: delay,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: Math.random() * 5,
      }}
    >
      <Heart
        className={cn(
          "fill-current",
          Math.random() > 0.7
            ? "text-pink-500"
            : Math.random() > 0.5
            ? "text-pink-400"
            : "text-pink-300"
        )}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          filter: "drop-shadow(0 0 2px rgba(244, 114, 182, 0.3))",
        }}
      />
    </motion.div>
  );
};
const customStyles = `
  .journal-page {
    background-image: linear-gradient(to right, rgba(255, 192, 203, 0.1) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(255, 192, 203, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
  }
  
  .journal-entry {
    position: relative;
  }
  
  .journal-entry::before {
    content: '';
    position: absolute;
    left: -15px;
    top: 50%;
    width: 30px;
    height: 30px;
    background-color: #FBCFE8;
    border-radius: 50%;
    transform: translateY(-50%);
    z-index: -1;
    opacity: 0.5;
  }
  
  .journal-date {
    font-family: 'Courier New', monospace;
    color: #DB2777;
    font-weight: 600;
    letter-spacing: 1px;
  }
  
  .no-complaints {
    background: linear-gradient(135deg, #FBCFE8 0%, #F9A8D4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
`;

export default function JournalPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [complaints, setComplaints] = useState([]);
  const [backgroundHearts, setBackgroundHearts] = useState([]);
  const [isDeleting, setIsDeleting] = useState(null);
  const [temp, setTemp] = useState(0);

  const getComplaints = async () => {
    const res = await axios.get("/api/messages", {
      withCredentials: true,
    });
    console.log(res.data.success);
    if (res.data.success) {
      console.log("ok");
      setComplaints(res.data.messages);
    }
  };

  useEffect(() => {
    getComplaints();
  }, [temp]);

  useEffect(() => {
    const heartCount = 60;
    const hearts = Array.from({ length: heartCount }, (_, i) => i);
    setBackgroundHearts(hearts);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const deleteComplaint = async (id) => {
    const res = await axios.delete(`/api/messages/${id}`, {
      withCredentials: true,
    });
    if (res.data.success) {
      toast.success("Complaint deleted, pookie! 💕");
      setTemp((p) => p + 1);
    } else {
      toast.error("oops!");
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
        <p className="mt-4 text-pink-600 font-medium">
          Loading your journal, sweetie...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 flex flex-col items-center p-4 overflow-hidden relative">
      <style jsx global>
        {customStyles}
      </style>

      {backgroundHearts.map((heart) => (
        <BackgroundHeart key={heart} id={heart} delay={heart * 0.2} />
      ))}

      <div className="w-full max-w-3xl z-10 py-8">
        <div className="flex items-center justify-between mb-3">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-pink-600 hover:text-pink-700 hover:bg-pink-100 rounded-full p-3"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div className="flex items-center">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="bg-pink-100 rounded-full p-3 mr-3"
            >
              <Book className="w-6 h-6 text-pink-500" />
            </motion.div>
            <h1 className="text-3xl font-bold text-pink-600 tracking-tight">
              Pookie Journal
            </h1>
            <motion.div
              whileHover={{ rotate: -10, scale: 1.1 }}
              className="bg-pink-100 rounded-full p-3 ml-3"
            >
              <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
            </motion.div>
          </div>
          <div className="w-12"></div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-8 border-2 border-pink-200 relative overflow-hidden journal-page">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-pink-100 rounded-full opacity-50" />
          <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-purple-100 rounded-full opacity-50" />

          <div className="relative">
            <AnimatePresence mode="popLayout">
              {complaints.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {complaints.map((complaint) => (
                    <AnimatePresence mode="popLayout" key={complaint._id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="bg-pink-50 rounded-2xl p-6 shadow-sm journal-entry"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-pink-400 mr-2" />
                            <span className="journal-date text-sm">
                              {format(
                                new Date(complaint.createdAt),
                                "MMMM d, yyyy 'at' h:mm a"
                              )}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-pink-400 hover:text-pink-600 hover:bg-pink-100 h-8 w-8 p-0 rounded-full"
                            onClick={() => deleteComplaint(complaint._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <p className="text-pink-600 whitespace-pre-wrap">
                              {complaint.message}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 text-center"
                >
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                    className="inline-block mb-4"
                  >
                    <Sparkles className="h-16 w-16 text-pink-400" />
                  </motion.div>
                  <h3 className="text-2xl font-bold no-complaints mb-2">
                    no complaints yet, pookie!
                  </h3>
                  <p className="text-pink-500">
                    Share your thoughts and feelings in the complaint box to see
                    them here 💕
                  </p>
                  <div className="mt-8">
                    <Link href="/">
                      <Button className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl py-6 px-8 font-medium">
                        Go to Complaint Box
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
