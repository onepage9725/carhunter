import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-white pt-24 pb-12 overflow-hidden relative">
            <div className="container mx-auto px-6 relative z-10">

                {/* Contact Section */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 tracking-tight leading-tight">
                        Need help finding <br />
                        your perfect car today?
                    </h2>
                    <p className="text-gray-500 mb-10 text-lg">
                        Our team is ready to guide you through models, financing options,
                        and exclusive offers to make your next purchase effortless.
                    </p>

                    {/* Profile */}
                    <div className="flex flex-col items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100">
                            {/* Placeholder or reuse one of the client avatars */}
                            <Image
                                src="/assets/branden-profile.jpg"
                                alt="Branden"
                                width={64}
                                height={64}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-black text-lg">Branden</div>
                            <div className="text-gray-400 text-sm">Sales Director</div>
                        </div>
                    </div>

                    <Link
                        href="/contact"
                        className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                    >
                        Contact Branden
                    </Link>
                </div>

                {/* Bottom Section with Watermark */}
                <div className="mt-8 flex flex-col items-center">

                    {/* Large Watermark Text - In flow now for spacing */}
                    <div className="w-full text-center pointer-events-none select-none mb-10">
                        <span className="text-[12rem] md:text-[18rem] font-bold tracking-tighter leading-none block" style={{ color: '#e0e0e0' }}>
                            byride
                        </span>
                    </div>

                    {/* Copyright */}
                    <div className="w-full flex justify-center items-center text-sm text-gray-400">
                        <span>© 2025 All Rights Reserved</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
