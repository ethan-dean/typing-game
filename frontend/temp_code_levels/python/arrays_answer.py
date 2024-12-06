# The Space Fleet needs your help to analyze their inventory of spare parts!
# Your task is to organize and manage a list of spare parts names.

# Instructions
# Write a program that allows the user to:
# 1. Add spare parts to the inventory.
# 2. Remove a spare part if it is no longer needed.
# 3. Display the current inventory of spare parts.

# Input
# Commands from the user: "add [part_name]", "remove [part_name]", "show", or "exit".
# Use these commands to modify the inventory list.

# Output
# The updated inventory after each operation.

def main():
    inventory = []  # List to store spare parts

    while True:
        command = input("Enter a command (add/remove/show/exit): ")

        # Split the command to separate the action and the part name
        parts = command.split(" ", 1)
        action = parts[0]
        part_name = parts[1] if len(parts) > 1 else ""

        if action == "add":
            inventory.append(part_name)  # Add part to the list
            print(f"{part_name} added to the inventory.")
        elif action == "remove":
            if part_name in inventory:
                inventory.remove(part_name)  # Remove part from the list
                print(f"{part_name} removed from the inventory.")
            else:
                print(f"{part_name} not found in the inventory.")
        elif action == "show":
            print("Current inventory:", inventory)
        elif action == "exit":
            print("Exiting the program. Final inventory:", inventory)
            break
        else:
            print("Invalid command. Try again.")

main()