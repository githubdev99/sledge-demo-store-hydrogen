export function SubscribeInput() {
    return (
        <div className="flex mt-[24px] border-[1px] border-[#6F6F6F] border-solid rounded-[360px] p-[3px]">
            <div className="relative flex flex-grow items-stretch focus-within:z-10 text-[#6F6F6F] font-sledge-font-family-1 text-[16px] leading-[18px] tracking-[-0.02em]">
                <input type="email" name="subscribe" id="subscribe" className="border-0 block w-full focus:outline-none pl-[24px] bg-transparent placeholder:text-[#6F6F6F] placeholder:font-sledge-font-family-1 placeholder:text-[16px] placeholder:leading-[18px] placeholder:tracking-[-0.02em] focus:border-none focus:box-shadow-none" placeholder="John@gmail.com" />
            </div>
            <button type="button" className="relative -ml-px inline-flex items-center py-[12px] px-[18px] bg-[--sledge-color-primary-green-3] rounded-[360px] hover:opacity-70 transition duration-200">
                <span className="text-white text-[12px] md:text-[16px] leading-[18px] tracking=[-0.02em] font-sledge-font-family-2 font-bold">Subscribe</span>
            </button>
        </div>
    )
}