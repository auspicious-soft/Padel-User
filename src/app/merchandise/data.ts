export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
};

export const products: Product[] = [
  {
    id: "1",
    name: "Natural Hair Growth Spray",
    price: 50,
    image: "/assets/AuthImage.png",
    description: "Professional formula designed for visible growth and healthier-looking hair.",
  },
  {
    id: "2",
    name: "Herbal Volume Shampoo",
    price: 45,
    image: "/assets/Rectangle.png",
    description: "Gentle cleansing with botanical extracts to support fuller and stronger hair.",
  },
  {
    id: "3",
    name: "Daily Care Conditioner",
    price: 38,
    image: "/assets/curvedMainImg.png",
    description: "Hydrating conditioner for smooth texture and reduced hair breakage.",
  },
  {
    id: "4",
    name: "Scalp Nutrition Serum",
    price: 42,
    image: "/assets/AuthImage.png",
    description: "Lightweight serum that nourishes scalp and supports natural growth cycles.",
  },
  {
    id: "5",
    name: "Protein Hair Mask",
    price: 55,
    image: "/assets/Rectangle.png",
    description: "Weekly treatment that repairs dry and damaged strands.",
  },
  {
    id: "6",
    name: "Anti-Frizz Leave In",
    price: 35,
    image: "/assets/curvedMainImg.png",
    description: "Daily leave-in cream for better shine, softness, and control.",
  },
];

export const reviews = Array.from({ length: 3 }).map((_, idx) => ({
  id: String(idx + 1),
  name: "Kathrin R",
  city: "Chandigarh",
  text: "I couldn't be happier with this hair growth spray. It arrived on time, and it has exceeded my expectations. With consistent morning and evening application, I've already witnessed a visible transformation after just 2 weeks!",
}));
