export default function PagesIndex() {
  return (
    <div className="container">
      <div className="flex flex-wrap gap-[40px] m-auto items-center">
        <div className="flex-auto">
          <a
            href="/pages/wishlist"
            className="w-full block p-16 text-center text-white bg-sledge-color-primary-green-1 rounded-[36px]"
          >
            Wishlist
          </a>
        </div>
        <div className="flex-auto">
          <a
            href="/pages/contact"
            className="w-full block p-16 text-center text-white bg-sledge-color-primary-green-1 rounded-[36px]"
          >
            Contact
          </a>
        </div>
      </div>
    </div>
  );
}
