interface ISkeletonProps {
  type?: 'productCard' | 'text';
  className?: any;
}

export function ProductCardSkeleton({className = ''}: ISkeletonProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex lg:grid grid-cols-2 lg:grid-cols-4 gap-[16px] overflow-y-hidden overflow-scroll md:overflow-hidden">
        {[0, 1, 2, 3].map((i) => {
          return (
            <div key={i} className="w-[300px] h-[457px] rounded-[24px]">
              <div className="animate-pulse flex flex-col gap-[16px]">
                <div className="w-full h-[180px] lg:h-[300px] bg-sledge-color-grey-3 rounded-[24px]"></div>
                <div className="flex flex-col justify-between gap-[16px]">
                  <div className="flex gap-[16px]">
                    <div className="bg-sledge-color-grey-3 rounded-[24px] w-[70%] h-[28px]"></div>
                    <div className="bg-sledge-color-grey-3 rounded-[24px] w-[30%] h-[28px]"></div>
                  </div>
                  <div className="bg-sledge-color-grey-3 rounded-[24px] w-[190px] h-[46px]"></div>
                  <div className="bg-sledge-color-grey-3 rounded-[24px] w-[117px] h-[40px]"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Skeleton({type, className = ''}: ISkeletonProps) {
  return (
    (type === 'productCard' && (
      <ProductCardSkeleton className={className} />
    )) || <div>Loading</div>
  );
}
