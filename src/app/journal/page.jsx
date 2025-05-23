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
  Share2,
  Users,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
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

  .shared-badge {
    background: linear-gradient(135deg, #A855F7 0%, #EC4899 100%);
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  button:focus {
    outline: none !important;
    box-shadow: none !important;
  }
  
  button:focus-visible {
    outline: none !important;
    box-shadow: none !important;
  }
  
  [data-state="open"] {
    outline: none !important;
    box-shadow: none !important;
  }
  `;

export default function JournalPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [complaints, setComplaints] = useState([]);
  const [backgroundHearts, setBackgroundHearts] = useState([]);
  const [sharedComplaints, setSharedComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [viewMode, setViewMode] = useState("personal");
  const [temp, setTemp] = useState(0);

  const getComplaints = async () => {
    const res = await axios.get("/api/messages", {
      withCredentials: true,
    });
    if (res.data.success) {
      setComplaints(res.data.messages);
    }
  };

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

  const getUsersList = async (id) => {
    const res = await axios.get("/api/users/list");
    if (res.data.success) {
      const users = res.data.users
        .filter((user) => user._id !== id)
        .map((user) => {
          user.avatar = user.name[0];
          return user;
        });
      setUsers(users);
    }
  };

  const getSharedComplaints = async () => {
    const res = await axios.get("/api/messages/shared", {
      withCredentials: true,
    });
    if (res.data.success) {
      setSharedComplaints(res.data.messages);
    }
  };

  useEffect(() => {
    getSharedComplaints();
  }, []);

  const shareWithUser = async (id) => {
    const res = await axios.put(
      "/api/users/share",
      {
        shareId: id,
      },
      { withCredentials: true }
    );
  };

  useEffect(() => {
    getComplaints();
  }, [temp]);

  useEffect(() => {
    user && getUsersList(user._id);
  }, [user]);

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

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant={viewMode === "personal" ? "default" : "outline"}
              onClick={() => setViewMode("personal")}
              className={cn(
                "rounded-xl px-6 py-3 font-medium transition-all duration-200",
                viewMode === "personal"
                  ? "bg-pink-400 hover:bg-pink-500 text-white shadow-lg shadow-pink-200 border-pink-400"
                  : "border-pink-300 text-pink-600 hover:bg-pink-50 hover:border-pink-400"
              )}
            >
              My Journal
            </Button>
            <Button
              variant={viewMode === "sharedWithMe" ? "default" : "outline"}
              onClick={() => setViewMode("sharedWithMe")}
              className={cn(
                "rounded-xl px-6 py-3 font-medium transition-all duration-200 flex items-center gap-2",
                viewMode === "sharedWithMe"
                  ? "bg-purple-400 hover:bg-purple-500 text-white shadow-lg shadow-purple-200 border-purple-400"
                  : "border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400"
              )}
            >
              <Users className="h-4 w-4" />
              Shared Journal
            </Button>
          </div>

          {viewMode === "personal" && complaints.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white border-none rounded-xl flex items-center gap-2 focus:outline-none focus:ring-0"
                >
                  <Share2 className="h-4 w-4" />
                  Share with
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <div className="px-2 py-1 text-sm font-medium text-pink-600">
                  Select a user to share with:
                </div>
                {users.map((user) => (
                  <DropdownMenuItem
                    key={user._id}
                    onClick={() => shareWithUser(user._id)}
                    className="flex items-center gap-3 cursor-pointer py-3"
                  >
                    <div className="bg-gradient-to-br from-pink-300 to-purple-300 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">
                        {user.avatar}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-8 border-2 border-pink-200 relative overflow-hidden journal-page">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-pink-100 rounded-full opacity-50" />
          <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-purple-100 rounded-full opacity-50" />

          <div className="relative">
            <AnimatePresence mode="popLayout">
              {viewMode === "personal" && complaints.length > 0 ? (
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
              ) : viewMode === "sharedWithMe" &&
                sharedComplaints?.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {sharedComplaints.map((sharedComplaint) => (
                    <motion.div
                      key={sharedComplaint._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 shadow-sm journal-entry border-2 border-purple-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-purple-400" />
                          <span className="journal-date text-sm text-purple-600">
                            {format(
                              new Date(sharedComplaint.createdAt),
                              "MMMM d, yyyy 'at' h:mm a"
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="bg-gradient-to-br from-purple-300 to-pink-300 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold">
                            {sharedComplaint.user.name
                              ?.charAt(0)
                              .toLowerCase() || "?"}
                          </span>
                        </div>

                        <div className="flex-1">
                          <p className="text-purple-600 whitespace-pre-wrap mb-3">
                            {sharedComplaint.message}
                          </p>
                          <div className="text-xs text-purple-500 bg-purple-100 rounded-lg px-3 py-2 inline-block">
                            💕 Shared by{" "}
                            {sharedComplaint.user.name || "Someone special"}
                          </div>
                        </div>
                      </div>
                    </motion.div>
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
