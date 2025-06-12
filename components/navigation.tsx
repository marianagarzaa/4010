"use client"

import { Home, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex justify-around py-2">
        <Link
          href="/"
          className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
            pathname === "/" ? "text-emerald-600 bg-emerald-50" : "text-gray-600 hover:text-emerald-600"
          }`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home Status</span>
        </Link>
        <Link
          href="/shopping"
          className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
            pathname === "/shopping" ? "text-emerald-600 bg-emerald-50" : "text-gray-600 hover:text-emerald-600"
          }`}
        >
          <ShoppingCart className="h-6 w-6" />
          <span className="text-xs mt-1">Shopping</span>
        </Link>
      </div>
    </nav>
  )
}
