export function convertGUID(guid: any) {
  return guid.split('/')[guid.split('/').length - 1];
}

export {WishlistBadge, WishlistWidget} from './WishlistTrigger';
export {ReviewBadge, ReviewWidget} from './ReviewTrigger';
export {SledgeGlobalScript} from './Global';
export {SledgeDemoContainer} from './MouckupContainer';
export {SearchResult} from './SearchResult';
export {SearchProductFilter} from './SearchResult';
