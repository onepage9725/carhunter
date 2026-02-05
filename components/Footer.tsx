
import Image from 'next/image';
import TransitionLink from './TransitionLink';

export default function Footer() {
    return (
        <footer className="bg-white pt-24 pb-12 overflow-hidden relative">
            <div className="container mx-auto px-6 relative z-10">

                {/* Contact Section */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <div className="flex justify-center mb-8">
                        <Image
                            src="/assets/byride-logo.png"
                            alt="Byride Logo"
                            width={80}
                            height={80}
                            className="object-contain"
                        />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 tracking-tight leading-tight">
                        Need help finding <br />
                        your perfect car today?
                    </h2>
                    <p className="text-gray-500 mb-10 text-lg">
                        Our team is ready to guide you through models, financing options,
                        and exclusive offers to make your next purchase effortless.
                    </p>

                    {/* Profile Removed as requested */}

                    <a
                        href="https://wa.me/601119453913"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                    >
                        Contact Our Team
                    </a>
                </div>

                {/* Bottom Section with Watermark */}
                <div className="mt-8 flex flex-col items-center">

                    {/* Large Watermark Text - In flow now for spacing */}
                    <div className="w-full text-center pointer-events-none select-none mb-10">
                        <span className="text-[5rem] sm:text-8xl md:text-[12rem] lg:text-[18rem] font-bold tracking-tighter leading-none block" style={{ color: '#e0e0e0' }}>
                            byride
                        </span>
                    </div>

                    {/* Copyright */}
                    <div className="w-full flex justify-center items-center text-sm text-gray-400 text-center">
                        <span>We are based in Kuala Lumpur and Selangor, but we serve clients across Malaysia.</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
