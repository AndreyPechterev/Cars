"use client";

import Image from "next/image";
import { CustomFiter, Hero, SearchBar, CarCard } from "@/components";
import ShowMore from "@/components/ShowMore";
import { fuels, yearsOfProduction } from "@/constants";
import { fetchCars } from "@/utils";
import { useEffect, useState } from "react";

export default function Home() {
    const [allCars, setAllCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [manufacturer, setManufacturer] = useState("");
    const [model, setModel] = useState("");

    const [fuel, setFuel] = useState("");
    const [year, setYear] = useState(2022);

    const [limit, setLimit] = useState(10);

    const getCars = async () => {
        try {
            setLoading(true);
            const result = await fetchCars({
                manufacturer: manufacturer || "",
                year: year || 2022,
                fuel: fuel || "",
                limit: limit || 10,
                model: model || "",
            });

            setAllCars(result);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCars();
    }, [limit, fuel, manufacturer, model, year]);

   

    return (
        <main className="overflow-hidden">
            <Hero />

            <div className="mt-12 padding-x padding-y max-width" id="discover">
                <div className="home__text-container">
                    <h1 className="text-4xl font-extrabold">Car catalogue</h1>
                    <p>Explore the cars you might like</p>
                </div>

                <div className="home__filters">
                    <SearchBar
                        setManufacturer={setManufacturer}
                        setModel={setModel}
                    />

                    <div className="home__filter-container">
                        <CustomFiter
                            setFilter={setFuel}
                            title="fuel"
                            options={fuels}
                        />
                        <CustomFiter
                            setFilter={setYear}
                            title="year"
                            options={yearsOfProduction}
                        />
                    </div>
                </div>

                {allCars.length > 0 ? (
                    <section>
                        <div className="home__cars-wrapper">
                            {allCars?.map((car) => (
                                <CarCard car={car} />
                            ))}
                        </div>

                        {loading && (
                            <div className="mt-16 w-full d-flex justify-center items-center">
                                <Image
                                    src="/loader.svg"
                                    alt="loader"
                                    width={50}
                                    height={50}
                                    className="object-contain justify-center"
                                />
                            </div>
                        )}
                        <ShowMore
                            pageNumber={(limit) / 10}
                            isNext={(limit ) > allCars.length}
                            setLimit={setLimit}
                        />
                    </section>
                ) : (
                    <div className="home__error-container">
                        <h2 className="text-black text-xl font-bold">
                            oops,no results
                        </h2>
                    </div>
                )}
            </div>
        </main>
    );
}