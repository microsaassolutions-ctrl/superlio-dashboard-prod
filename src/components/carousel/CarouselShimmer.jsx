const CarouselShimmer = () => {
    const shimmerItem = (
        <div className="w-[90px] min-w-[90px] min-h-[110px] rounded-md bg-[#acb8c9] animate-pulse relative">
            <div className="absolute top-0 right-0 w-5 h-5 bg-gray-200 opacity-60 rounded-md m-1" />
            <div className="py-8">
                <div className="px-3 w-2/3 h-4 bg-gray-200 opacity-60 rounded-full mx-1 my-2" />
                <div className="px-3 w-4/5 h-2 bg-gray-200 opacity-60 rounded-full m-1" />
                <div className="px-3 w-2/3 h-2 bg-gray-200 opacity-60 rounded-full m-1" />
            </div>
        </div>
    );

    return (
        <div className="flex gap-2 w-max justify-center mx-auto" >
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index}>{shimmerItem}</div>
            ))}
        </div>
    );
};

export default CarouselShimmer;