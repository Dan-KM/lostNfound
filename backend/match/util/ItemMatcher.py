from inventory.models import UserItem
from .vectorDB import VectorDB
from ..models import LostFoundMatch

ItemMatcher = VectorDB()

def save_matches(userItem: UserItem, is_lost : bool = False, threshold: float = 0.85):
    is_lost = userItem.serial_id.startswith("FND")
    
    matches = ItemMatcher.find_matches_with_serial_id(
        query_item_id=userItem.serial_id,
        is_lost=is_lost,
        threshold=threshold
    )

    if not matches:
        return

    # Extract serial_ids and bulk-fetch matched items
    matched_ids = [match["item_id"] for match in matches]
    matched_items = {
        item.serial_id: item
        for item in UserItem.objects.filter(serial_id__in=matched_ids)
    }

    # Determine item roles based on whether the user item is lost
    for match in matches:
        matched_item = matched_items.get(match["item_id"])
        if not matched_item:
            continue  # Skip if not found in DB

        lost_item = userItem if is_lost else matched_item
        found_item = matched_item if is_lost else userItem

        LostFoundMatch.objects.create(
            lost_item=lost_item,
            found_item=found_item,
            score=match["similarity"]
        )


def embed_user_item(userItem: UserItem):
    if userItem.serial_id.startswith("FND"):
        ItemMatcher.add_found_item(item=userItem)
    else:
        # If it doesn't start with "FND", assume it's a lost item
        ItemMatcher.add_lost_item(item=userItem)
