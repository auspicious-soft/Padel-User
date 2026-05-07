import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: [
      {
        id: "1",
        name: "Printed Tennis Cotton Tee",
        image: "/assets/curvedMainImg.png",
        description: "This printed t-shirt is perfect for custom merchandise. Comfortable and stylish.",
        price: 50,
        quantity: 1,
        status: "Fulfilled",
      },
      {
        id: "2",
        name: "Printed Tennis Cotton Tee",
        image: "/assets/curvedMainImg.png",
        description: "This printed t-shirt is perfect for custom merchandise. Comfortable and stylish.",
        price: 50,
        quantity: 1,
        status: "Fulfilled",
      },
      {
        id: "3",
        name: "Printed Tennis Cotton Tee",
        image: "/assets/curvedMainImg.png",
        description: "This printed t-shirt is perfect for custom merchandise. Comfortable and stylish.",
        price: 50,
        quantity: 1,
        status: "Fulfilled",
      }
    ]
  });
}
