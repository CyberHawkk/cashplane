import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Payment from "../pages/Payment";
// ...import others

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/payment" element={<Payment />} />
        {/* Add other routes */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
