import { NextRequest } from "next/server";
import { prisma } from "../../prisma";

type CoinGeckoResponse = {
  alephium: {
    usd: number;
  };
};

export async function GET(request: NextRequest) {
  const savedPrice = await prisma.alphPrice.findFirst({});
  const priceTimestamp =
    savedPrice?.updatedAt.getTime() || savedPrice?.createdAt.getTime() || 0;
  const maxInterval = 1000 * 60 * 5; // 5 minutes

  if (savedPrice && Date.now() - priceTimestamp < maxInterval)
    return Response.json({ price: savedPrice.priceInUsd });

  const price = await fetchAlphPrice();

  if (savedPrice) {
    await prisma.alphPrice.update({
      where: {
        id: savedPrice.id
      },
      data: {
        priceInUsd: price,
      },
    });
  } else {
    await prisma.alphPrice.create({
      data: {
        priceInUsd: price,
      },
    });
  }

  return Response.json({ price });
}

async function fetchAlphPrice(): Promise<number> {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=alephium&vs_currencies=usd",
    {
      headers: {
        "Content-Type": "application/json",
        "x-cg-demo-api-key": process.env.COIN_GECKO_API_KEY || "",
      },
    },
  );

  const data: CoinGeckoResponse = await res.json();

  return data.alephium.usd;
}
