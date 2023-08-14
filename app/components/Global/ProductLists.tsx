import {Global, GlobalProduct} from '..';

interface IProductListsProps {
  title: string;
  products: any;
}

import dummyProducts from '~/data/products.json';

export function ProductLists({products, title}: IProductListsProps) {
  return (
    <>
      <div className="container pt-[16px] sm:pt-[24px]">
        <h4 className="font-bold tracking-tight text-gray-900">{title}</h4>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products &&
            products.map((product: any, index: any) => {
              return (
                <GlobalProduct.ProductCard
                  dummyData={dummyProducts[index]}
                  product={product}
                  key={index}
                />
              );
            })}
        </div>
        <Global.Button
          text="Show All"
          type={'link'}
          link={'/collections/all'}
          textColor="text-white"
          color="bg-sledge-color-primary-green-3"
          position="center"
          isArrow={true}
          className={'mt-[46px]'}
        />
      </div>
    </>
  );
}
