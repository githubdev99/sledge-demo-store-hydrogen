export function OurBrand({data}: any) {
  const {brand_top, brand_bottom} = data;

  return (
    <div>
      <div className="container flex flex-wrap mt-[30px] lg:mt-[80px]">
        <div className="mr-0 md:mr-[107px]">
          <h1>Our Brand</h1>
        </div>
        <div className="max-w-[740px]">
          <p className="text-[#6C6C6C] text-[12px] md:text-[16px] leading-[26px] tracking-[-0.02em]">
            Faucibus semper tincidunt cras imperdiet sit est. Massa eu ultricies
            ultrices quam ornare. Velit eget quisque penatibus non sollicitudin
            enim. Non nec suspendisse eu vestibulum.
          </p>
        </div>
      </div>
      <div className="marquee-wrapper mt-[48px]">
        <div className="marquee">
          <div className="marquee__group">
            {brand_top.references.edges.map((item: any, index: number) => (
              <div key={index}>
                <img src={item.node.image.url} alt="" />
              </div>
            ))}
          </div>
          <div aria-hidden="true" className="marquee__group">
            {brand_bottom.references.edges.map((item: any, index: number) => (
              <div key={index}>
                <img src={item.node.image.url} alt="" />
              </div>
            ))}
          </div>
        </div>
        <div className="marquee marquee--reverse">
          <div className="marquee__group">
            {brand_top.references.edges.map((item: any, index: number) => (
              <div key={index}>
                <img src={item.node.image.url} alt="" />
              </div>
            ))}
          </div>
          <div aria-hidden="true" className="marquee__group">
            {brand_bottom.references.edges.map((item: any, index: number) => (
              <div key={index}>
                <img src={item.node.image.url} alt="" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
