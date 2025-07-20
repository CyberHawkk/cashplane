// src/components/BackButton.jsx
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5"; // ✅ Built-in icon

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center text-sm text-gray-200 hover:text-white mb-4"
    >
      <IoArrowBack className="mr-1" />
      Back
    </button>
  );
}
