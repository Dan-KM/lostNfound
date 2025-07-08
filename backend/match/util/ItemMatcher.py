from inventory.models import UserItem
from .vectorDB import VectorDB
from ..models import LostFoundMatch

ItemMatcher = VectorDB()

def save_matches(userItem: UserItem, is_lost : bool = False, threshold: float = 0.85):
    is_lost = userItem.serial_id.startswith("LST")
    
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

    save_matches(userItem= userItem)


# def initialize_database(is_lost: bool = True, threshold: float = 0.5):
#     print(f"Initializing database for {'lost' if is_lost else 'found'} items...")

#     # Optionally clear old matches (you can comment this out if not needed)
#     LostFoundMatch.objects.all().delete()

#     # Filter only lost or found items based on serial_id
#     prefix = "LST" if is_lost else "FND"
#     filtered_items = UserItem.objects.filter(serial_id__startswith=prefix)
#     print(f"Filtered items: {filtered_items.count()}")

#     for item in filtered_items:
#         try:
#             save_matches(userItem=item, is_lost=is_lost, threshold=threshold)
#         except Exception as e:
#             print(f"Error processing item {item.serial_id}: {e}")

#     print("Initialization complete.")

def initialize_database(threshold: float = 0.5):
    print("Initializing database with match records...")

    # Optionally clear old matches if you want to start fresh
    LostFoundMatch.objects.all().delete()

    # Go through all items and attempt to find matches
    all_items = UserItem.objects.all()
    print(f"Total items: {all_items.count()}")

    for item in all_items:
        try:
            save_matches(userItem=item, threshold=threshold)
        except Exception as e:
            print(f"Error processing item {item.serial_id}: {e}")

    print("Initialization complete.")