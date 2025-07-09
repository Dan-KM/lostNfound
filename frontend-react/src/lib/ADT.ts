// interface ItemDetails {
//   color: string;
//   item_type: string;
//   contents: string;
// }

// interface Item {
//   id: number;
//   name: string;
//   description: string;
//   item_image: string | null;
//   location: string;
//   item_type: string;
//   other_details: ItemDetails;
//   category: number;
//   subcategory: number;
// }

// interface LostItem {
//   user: number;
//   serial_id: string;
//   status: string;
//   reported_date: string;
//   item: Item;
//   updated_at: string;
// }

// interface PotentialMatch {
//   lost_item: LostItem;
//   score: number;
//   status: string;
// }

// interface FoundItemData {
//   serial_id: string;
//   item: Item;
//   status: string;
//   reported_date: string;
//   updated_at: string;
//   potential_matches: PotentialMatch[];
// }

// // Export the main type
// export type { FoundItemData, PotentialMatch, LostItem, Item, ItemDetails };


export type Category = {
  id: number;
  name: string;
};

export type Subcategory = {
  id: number;
  category: number;
  name: string;
};

export type Item = {
  id: number;
  name: string;
  description: string;
  category: Category;
  subcategory: Subcategory;
  location: string;
};

export type LostItem = {
  user: number;
  serial_id: string;
  status: string;
  reported_date: string;
  item: Item;
  updated_at: string;
};

export type PotentialMatch = {
  lost_item: LostItem;
  score: number;
  status: "pending" | "matched" | string;
};

export type FoundItemResponse = {
  id: number;
  serial_id: string;
  item: Item;
  status: string;
  reported_date: string;
  updated_at: string;
  potential_matches: PotentialMatch[];
};


export type QuestionnaireQuestion = {
  id: number;
  question_text: string;
  is_required: boolean;
};

export type Questionnaire = {
  id: number;
  found_item: number;
  created_at: string;
  questions: QuestionnaireQuestion[];
};

export type Answer = {
  id: number;
  answer_text: string;
  created_at: string; // ISO timestamp
  question: {
    id: number;
    text: string;
    is_required: boolean;
    questionnaire: number;
  };
  lost_item: number;
};
