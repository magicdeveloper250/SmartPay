 

const PayHistorySkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* Filter options */}
      <div className="bg-gray-100 p-4 rounded-lg animate-pulse">
        <div className="flex gap-4">
          <div className="h-5 w-20 bg-gray-300 rounded"></div>
          <div className="h-5 w-24 bg-gray-300 rounded"></div>
          <div className="h-5 w-24 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex border-b animate-pulse">
        <div className="py-2 px-4 bg-gray-300 rounded-tl-lg w-16"></div>
        <div className="py-2 px-4 bg-gray-200 w-24 mx-1"></div>
        <div className="py-2 px-4 bg-gray-200 w-16 mx-1"></div>
        <div className="py-2 px-4 bg-gray-200 w-24 mx-1"></div>
        <div className="py-2 px-4 bg-gray-200 w-20 mx-1"></div>
        <div className="py-2 px-4 bg-gray-200 w-20 mx-1"></div>
      </div>

      {/* Payment list item placeholders */}
      {[1, 2, 3].map((item) => (
        <div key={item} className="border rounded-lg p-4 animate-pulse">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-5 w-24 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-56 bg-gray-200 rounded"></div>
            </div>
            <div className="h-5 w-28 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PayHistorySkeleton;