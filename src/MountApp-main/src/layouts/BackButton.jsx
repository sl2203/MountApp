import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate(-1)}
      className="absolute left-4 p- w-7 h-7 rounded-full" >
      <ChevronLeft />
    </motion.button>
  );
}
