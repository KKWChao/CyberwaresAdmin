import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "../Spinner";

export default function DummyChart() {
  const [dummy, setDummy] = useState();
  const [randomNumber, setRandomNumber] = useState();

  async function PopularItem() {
    await axios
      .get("/api/charts?chart=popular")
      .then((response) => setDummy(response.data))
      .catch((error) => console.log(error));
  }

  async function DummyPopularItem() {
    await axios
      .get("/api/products/")
      .then(
        (response) => (
          setDummy(response.data),
          setRandomNumber(Math.floor(Math.random() * response.data.length))
        )
      )
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    DummyPopularItem();
  }, []);

  return (
    <div className="overflow-hidden flex flex-col justify-center align-middle h-full">
      <h1 className="text-center md:text-3xl md:font-bold">
        Dummy Best Seller
      </h1>
      {(dummy && (
        <div className="flex justify-center gap-4">
          <div className="text-center pt-5 md:pt-10">
            <h2 className="text-lg">{dummy[randomNumber].title}</h2>
            <a className="">sold:</a>
            {/* {dummy[randomNumber]?.sold} */}
            <p className="text-4xl font-bold">{randomNumber}</p>
          </div>

          <div className="">
            <img
              src={dummy[randomNumber].images[0]}
              className="hidden md:inline-flex"
            />
          </div>
        </div>
      )) || (
        <div>
          <Spinner />
          Loading
        </div>
      )}
    </div>
  );
}
