"use client"
import styles from "@/styles/style";
import { Navbar, Hero, Stats, Pricing, Business, Billing, CardDeal, Testimonials, Clients, CTA, Footer } from "@/components/landing"
const Home: React.FC = () => {
  return (
    <>
      <div className="bg-[#0a0a23] w-full min-h-screen overflow-hidden">
        <div className={`${styles.paddingX} ${styles.flexCenter}`}> 
          <div className={`${styles.boxWidth}`}> 
            <Navbar />
          </div>
        </div>
        <div className={`bg-gradient-to-br  ${styles.flexStart}`}> 
          <div className={`${styles.boxWidth}`}> 
            <Hero />
          </div>
        </div>
        <div className={`bg-[#0a0a23] ${styles.paddingX} ${styles.flexStart}`}> 
          <div className={`${styles.boxWidth}`}> 
            <Stats />
            <Business />
            <Pricing/>
            <Billing />
            <CardDeal />
            <Testimonials />
            <Clients />
            <CTA />
            <Footer />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home