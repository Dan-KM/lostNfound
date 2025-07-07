from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Item, UserItem

# from notification.utility import send_test_email

from match.util.ItemMatcher import save_matches, embed_user_item

import threading
from concurrent.futures import ThreadPoolExecutor

@receiver(post_save, sender=UserItem)
def embed_item_report(sender, instance, created, **kwargs):
    if created:
        print(f"ItemReport created for item: {instance.item.name} with status: {instance.status}")
        
        if instance.status == 'submitted':
            # Define the async operations
            def async_operations():
                print(f"New UserItem Saved Successfully")
                with ThreadPoolExecutor(max_workers=4) as executor:
                    # Submit all tasks
                    futures = []
                    
                    # Item matching

                    # if instance.item.type == 'found':
                    #     futures.append(executor.submit(ItemMatcher.add_found_item, instance))
                    # else:
                    #     futures.append(executor.submit(ItemMatcher.add_lost_item, instance))

                    futures.append(executor.submit(embed_user_item, instance))
                    
                    # # Broadcasting
                    # futures.append(executor.submit(
                    #     broadcaster.publish, 
                    #     f"New notification: {instance.item.name}"
                    # ))
                    
                    # Save matches
                    futures.append(executor.submit(save_matches, userItem=instance))
                    
                    # Wait for all to complete (optional)
                    # for future in futures:
                    #     future.result()
            
            # Run in background thread
            thread = threading.Thread(target=async_operations)
            thread.daemon = True
            thread.start()
            
            print(f"ItemReport tasks started asynchronously")