import Image from 'next/image'

const bands = [
    { name: 'BMW', logo: 'https://cdn.simpleicons.org/bmw/000000' },
    { name: 'Porsche', logo: 'https://cdn.simpleicons.org/porsche/000000' },
    { name: 'Mercedes-Benz', logo: '/assets/brands/mercedes-custom.png' },
    { name: 'Land Rover', logo: '/assets/brands/landrover-custom.png' },
    { name: 'Honda', logo: 'https://cdn.simpleicons.org/honda/000000' },
    { name: 'Toyota', logo: 'https://cdn.simpleicons.org/toyota/000000' },
    { name: 'Mitsubishi', logo: 'https://cdn.simpleicons.org/mitsubishi/000000' },
    { name: 'Proton', logo: '/assets/brands/proton-custom.jpg' },
    { name: 'Lamborghini', logo: '/assets/brands/lamborghini-custom.jpg' },
    { name: 'Ferrari', logo: 'https://cdn.simpleicons.org/ferrari/000000' },
]

export default function BrandTicker() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6 text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-black">
                    We offer vehicles from <br />
                    the world’s most iconic brands
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                    Our success is driven by people who share a passion for cars,
                    precision, and exceptional service.
                </p>
            </div>

            <div className="relative w-full">
                {/* Gradients for smooth fade */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

                {/* Marquee Container */}
                <div className="flex w-full overflow-hidden">
                    {/* Inner sliding track - doubled for seamless loop */}
                    <div className="flex animate-marquee whitespace-nowrap">
                        {[...bands, ...bands, ...bands].map((brand, i) => (
                            <div key={i} className="mx-12 md:mx-16 flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity duration-300">
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 max-w-[100px]"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
