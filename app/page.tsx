import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import BrandTicker from '@/components/BrandTicker'
import CarGrid from '@/components/CarGrid'
import SellCarCTA from '@/components/SellCarCTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-900 selection:text-white">
      <Navbar />
      <Hero />
      <BrandTicker />
      <CarGrid />
      <SellCarCTA />
      <Footer />
    </main>
  )
}
