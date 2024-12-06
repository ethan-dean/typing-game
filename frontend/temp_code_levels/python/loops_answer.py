# Your spaceship requires energy crystals to power up for the journey ahead.
# You must mine asteroids to gather as many energy crystals as possible!

# Instructions
# Modify this program to calculate the total number of energy crystals collected.
# Use a loop to collect crystals from each asteroid.

# Input
# The total number of asteroids 'N'
# For each asteroid, the number of energy crystals it contains

# Output
# The total number of energy crystals collected

def main():
    # Getting the number of asteroids
    n = int(input("Enter the number of asteroids: "))

    total_crystals = 0  # Variable to store the total number of crystals

    # --- User Submission Area ---
    # Loop to get the number of crystals from each asteroid
    for i in range(n):
        crystals = int(input(f"Enter the number of crystals in asteroid {i + 1}: "))

        # Add the number of crystals from the current asteroid to the total
        total_crystals += crystals

    # Output the total number of energy crystals collected
    print(total_crystals)
    # --- End of User Submission Area ---

if __name__ == "__main__":
    main()