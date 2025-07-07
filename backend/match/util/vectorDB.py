import chromadb # type: ignore
from inventory.models import UserItem

client = chromadb.PersistentClient(path="lost_and_found_db")

class VectorDB:
    def __init__(self):
        self.lost_items_collection = client.get_or_create_collection(name="lost_items")
        self.found_items_collection = client.get_or_create_collection(name="found_items")


    def make_description(self, user_item: UserItem) -> str:
        """
        Create a description string for the item, including its name, location, categories, and description.
        """
        if not user_item.item:
            return "Item not found."
        
        if not user_item.item.name or not user_item.item.description:
            return "Item name or description is missing."
        
        s = f"{user_item.item.name}, [LOC: {user_item.item.location}], [{user_item.item.category.name}, {user_item.item.subcategory.name}] {user_item.item.description}"
        print(f"Generated description: {s}")  # Debugging line
        return str(s)


    def add_lost_item(self, item: UserItem):
        self.lost_items_collection.add(
            documents=[self.make_description(item)],
            metadatas=[{"location": item.item.location, 
                        "category": item.item.category.name,
                        "subcategory": item.item.subcategory.name, 
                        "type": item.item.item_type, 
                        "item_id": item.item.id,
                        "reported_date": item.reported_date.isoformat()  # ✅ fixed
                        }],
            ids=[item.serial_id],
        )
    


    def add_found_item(self, item: UserItem):
        self.found_items_collection.add(
            documents=[self.make_description(item)],
            metadatas=[{"location": item.item.location, 
                        "category": item.item.category.name,
                        "subcategory": item.item.subcategory.name, 
                        "type": item.item.item_type, 
                        "item_id": item.item.id,
                        "reported_date": item.reported_date.isoformat()  # ✅ fixed
                        }],
            ids=[item.serial_id],
        )



    def find_matches_with_serial_id(self, query_item_id: str, is_lost : bool = False, threshold: float = 0.7):
        
        """
        Find matches for a lost or found item.
        
        Args:
            query_item_id: ID of the item to match
            is_lost: True if searching for lost item, False for found
            threshold: similarity threshold (0-1)
            
        Returns:
            List of matching items with similarity scores
        """
        is_lost = query_item_id.startswith("LST")
        
        target_collection= self.found_items_collection if is_lost else self.lost_items_collection
        source_collection= self.lost_items_collection if is_lost else self.found_items_collection
        
        
        # Get the query item's embedding
        query_item = source_collection.get(ids=[query_item_id], include=["embeddings"])
        print("query_item -> ", query_item)
        query_embedding = query_item["embeddings"][0]
        
        # Search for similar items in the target collection
        results = target_collection.query(
            query_embeddings=[query_embedding],
            n_results=10,
            include=["metadatas", "distances"]
        )

        print('results -> ', results)
        
        # Filter results by threshold and format

        matches = []
        for i, (distance, metadata, match_id) in enumerate( zip(results["distances"][0], results["metadatas"][0], results["ids"][0])):
            similarity = 1 - distance
            if similarity >= threshold:
                matches.append({
                    "query_item_id" : query_item_id,
                    "item_id": results["ids"][0][i],
                    "similarity": similarity,
                    "metadata": metadata
                })

        return matches

 


    def find_matches_of(self, **kwargs):
        """
        Find matches for a lost or found item.
        
        Args:
            item: UserItem instance to match
            threshold: similarity threshold (0-1)
            
        Returns:
            List of matching items with similarity scores
        """
        if "item" not in kwargs:
            raise ValueError("Item must be provided to find matches.")
        item : UserItem = kwargs["item"]
        threshold = kwargs.get("threshold", 0.85)
        

        return self.find_matches_with_serial_id(item.serial_id, threshold)



    def get_all(self):
        """
        Get all items in the database.
        
        Returns:
            List of all items with their metadata
        """
        lost_items = self.lost_items_collection.get(include=["metadatas"])
        found_items = self.found_items_collection.get(include=["metadatas"])
        
        return {
            "lost_items": lost_items,
            "found_items": found_items
        }



    def initialize_embeddings(self):
        """
        Initialize ChromaDB with existing UserItem data from the database.
        This should be run once to populate the vector database.
        """
        print("Initializing vector database with existing items...")

        # Fetch all UserItem records with related item info
        all_items = UserItem.objects.select_related("item__category", "item__subcategory").all()

        for user_item in all_items:
            try:
                # Check if already exists to avoid duplicates (optional)
                collection = (
                    self.lost_items_collection if user_item.serial_id.startswith("LST")
                    else self.found_items_collection
                )

                existing = collection.get(ids=[user_item.serial_id])
                if existing.get("ids"):
                    print(f"Item {user_item.serial_id} already exists in vector DB. Skipping.")
                    continue

                # Add to the right collection
                if user_item.serial_id.startswith("LST"):
                    self.add_lost_item(user_item)
                    print(f"Embedded lost item: {user_item.serial_id}")
                elif user_item.serial_id.startswith("FND"):
                    self.add_found_item(user_item)
                    print(f"Embedded found item: {user_item.serial_id}")
                else:
                    print(f"Unknown prefix in serial_id: {user_item.serial_id}")
            except Exception as e:
                print(f"Failed to embed item {user_item.serial_id}: {e}")