// Global
import {Button} from './Global/Button';
import {SubscribeInput} from './Global/SubscribeInput';
import {CardImage} from './Global/CardImage';
import {Input} from './Global/Input';
import {CartDrawer} from './Global/CartDrawer';
import {OrderCard, ORDER_CARD_FRAGMENT} from './Global/OrderCard';
import {Modal} from './Global/Modal';
import {SledgeProductCard} from './Global/SledgeProductCard';
import {SledgeSuggestionKeywordList} from './Global/SledgeSuggestionKeywordList';
import {SledgeOtherIndexList} from './Global/SledgeOtherIndexList';
import {SledgeSearchViewMoreResult} from './Global/SledgeSearchViewMoreResult';
import {SledgeWishlistWidgetAlert} from './Global/SledgeWishlistWidgetAlert';

// Account
import {AccountDetails} from './Account/AccountDetails';
import {AccountAddressBook} from './Account/AccountAddressBook';

//GlobalProduct
import {ProductLists} from './Global/ProductLists';
import {ProductCard} from './Global/ProductCard';
import {AddToCartButton} from './Global/AddToCartButton';

//pages
import {Contact} from './Pages/Contact';
import {NotFound} from './Pages/NotFound';
import {GenericError} from './Pages/GenericError';

//cart
import {CartComponents} from './Cart/CartComponents';

//pagination
import {
  Pagination,
  getPaginationVariables,
  usePagination,
} from './Global/Pagination';

// Remix Link
import {Link} from './Global/Link';

const Global = {
  Button,
  SubscribeInput,
  CardImage,
  Input,
  CartDrawer,
  Modal,
};

const AccountComponent = {
  OrderCard,
  ORDER_CARD_FRAGMENT,
  AccountDetails,
  AccountAddressBook,
};

const GlobalProduct = {
  ProductLists,
  ProductCard,
  AddToCartButton,
  SledgeProductCard,
  SledgeSuggestionKeywordList,
  SledgeOtherIndexList,
  SledgeSearchViewMoreResult,
  SledgeWishlistWidgetAlert,
};

const Pages = {
  Contact,
  NotFound,
  GenericError,
};

const PaginationComponent = {
  Pagination,
  getPaginationVariables,
  usePagination,
};

export {
  Global,
  AccountComponent,
  GlobalProduct,
  Pages,
  CartComponents,
  PaginationComponent,
  Link,
};

// Icon
export * from './Global/Icon';
