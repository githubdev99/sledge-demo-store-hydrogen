import {Link} from '../Global/Link';

export function TopBar() {
  return (
    <div className="flex bg-sledge-color-primary-green-3 text-center py-[8px] px-5 md:px-0">
      <p className="mx-auto text-white font-sledge-font-family-1 font-[400] text-[14px] leading-[15.4px]">
        Sign Up and GET 10% DISCOUNT for your first order.
        <Link className="ml-2 text-white underline" to="/account/register">
          Sign Up Now
        </Link>
      </p>
    </div>
  );
}
