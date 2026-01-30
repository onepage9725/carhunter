import Link from 'next/link'
import Image from 'next/image'
import { Phone } from 'lucide-react'

export default function Navbar() {
    return (
        <nav className="w-full bg-white py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
            {/* Logo */}
            <Link href="/" className="relative h-8 w-32 flex-shrink-0">
                <Image
                    src="/assets/logo.png"
                    alt="CarHunter Logo"
                    fill
                    className="object-contain object-left"
                    priority
                />
            </Link>

            {/* Desktop Nav - Centered & Simple */}
            <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
                <Link href="/services" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Services</Link>
                <Link href="#" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Cases</Link>
                <Link href="#" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Before & After</Link>
                <Link href="#" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Contact</Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                <button className="hidden md:flex items-center justify-center w-10 h-10 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Phone className="w-4 h-4 text-gray-600" />
                </button>
                <Link
                    href="#"
                    className="bg-zinc-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-black transition-colors"
                >
                    Ask on WhatsApp
                </Link>
            </div>
        </nav>
    )
}
