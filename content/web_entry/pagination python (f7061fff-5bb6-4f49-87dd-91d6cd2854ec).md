# Simple Pagination in Python

This guide demonstrates how to implement basic pagination functionality in Python. Pagination is useful when dealing with large datasets or when you want to display a limited number of items per page.

## Basic Pagination Function

Here's a simple function that implements pagination:

```python
def paginate(items, page_size, page_number):
    """
    Paginate a list of items.

    :param items: List of items to paginate
    :param page_size: Number of items per page
    :param page_number: Page number (1-indexed)
    :return: List of items for the specified page
    """
    start = (page_number - 1) * page_size
    end = start + page_size
    return items[start:end]
```

## Usage Example

Here's an example of how to use the pagination function:

```python
# Sample data
all_items = list(range(1, 101))  # List of numbers from 1 to 100

# Pagination parameters
items_per_page = 10
current_page = 3

# Get items for the current page
page_items = paginate(all_items, items_per_page, current_page)

print(f"Page {current_page}:")
print(page_items)
```

This will output:

```text
Page 3:
[21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
```

## Pagination Class

For more advanced use cases, you can create a Pagination class:

```python
class Pagination:
    def __init__(self, items, page_size):
        self.items = items
        self.page_size = page_size
        self.total_pages = -(-len(items) // page_size)  # Ceiling division

    def get_page(self, page_number):
        start = (page_number - 1) * self.page_size
        end = start + self.page_size
        return self.items[start:end]

    def get_total_pages(self):
        return self.total_pages
```

Usage of the Pagination class:

```python
# Create a Pagination object
paginator = Pagination(list(range(1, 101)), 10)

# Get items for page 3
page_3_items = paginator.get_page(3)
print("Page 3:", page_3_items)

# Get total number of pages
total_pages = paginator.get_total_pages()
print("Total pages:", total_pages)
```

This will output:

```text
Page 3: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
Total pages: 10
```

These examples provide a simple way to implement pagination in Python. For more complex scenarios, consider using libraries like Django's Paginator or SQLAlchemy's pagination features if you're working with databases.
