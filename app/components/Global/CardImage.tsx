interface CardImageInterface {
    image: string,
    title: string,
    descripton: string
}

export function CardImage({ image = '', title = '', descripton = '' }: CardImageInterface) {
    return (
        <div className="relative flex w-full max-w-full lg:max-w-[500px] h-[100vw] md:h-[560px] rounded-[32px]">
            <span aria-hidden="true" className="absolute inset-0">
                <img src={image} className="h-full w-full object-cover object-center rounded-[32px]" />
            </span>
            <div className='relative text-white mt-auto mx-[20px] lg:mx-[40px] mb-[32px]'>
                <span className="font-sledge-font-family-1 text-[12px] md:text-[16px] leading-[26px]">{title}</span>
                <h4 className='mt-[12px] text-[20px] md:text-[24px]'>{descripton}</h4>
            </div>
        </div>
    )
}