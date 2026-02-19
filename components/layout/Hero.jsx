import Image from "next/image";

export default function Hero() {

  return (
    <section>
        <h1>Everything you need for the perfect pizza experience</h1>
        <p>Discover our delicious menu, place your order, and enjoy the best pizza in town!</p>
        <Image src="/pizza-hero.jpg" alt="Pizza Hero Image" width={600} height={400} className="" />
               
    </section> 
  )
}
