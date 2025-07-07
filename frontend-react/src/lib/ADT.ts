interface ItemDetails {
  color: string;
  item_type: string;
  contents: string;
}

interface Item {
  id: number;
  name: string;
  description: string;
  item_image: string | null;
  location: string;
  item_type: string;
  other_details: ItemDetails;
  category: number;
  subcategory: number;
}

interface LostItem {
  user: number;
  serial_id: string;
  status: string;
  reported_date: string;
  item: Item;
  updated_at: string;
}

interface PotentialMatch {
  lost_item: LostItem;
  score: number;
  status: string;
}

interface FoundItemData {
  serial_id: string;
  item: Item;
  status: string;
  reported_date: string;
  updated_at: string;
  potential_matches: PotentialMatch[];
}

// Export the main type
export type { FoundItemData, PotentialMatch, LostItem, Item, ItemDetails };