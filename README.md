# Atipera

## Project Overview

This project involves creating a web application for Atipera that features an editable table of chemical elements. The key requirement is that all operations on the data are performed immutably. The application allows users to edit values in the table and updates the view without mutating the original data.

## Key Features

- **Editable Table:**

  - Displays chemical element data with columns: Number, Name, Weight, Symbol.
  - Allows editing of any record in the table via a dialog.
  - Ensures immutability by not directly mutating the original data.

- **Loading and Error Handling:**

  - Implements a loading spinner and error messages for HTTP request handling.
  - Provides feedback to users about data loading states and any errors that may occur.

- **Configuration Variables:**
  - In the `/const` folder, you will find configuration variables responsible for:
    - **Delays:** Simulate server response times.
    - **Debounce:** Control the frequency of server requests.
    - **Error Chance:** Simulate random errors that may occur during HTTP requests.

## Implementation

- **Table Component:** Uses Angular Material to render the table and manage data.
- **Edit Dialog:** Provides a form for editing record values.
- **HTTP Service:** Handles data retrieval and element updates with simulated delays and errors.
- **Error and Loading Handling:** Integrated spinner and error messages to enhance user experience.

The project demonstrates data editing, loading, and error management while ensuring that all data operations are performed immutably.

## Development server

Run `yarn start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## CI/CD

- `yarn prettier` for use prettier,
- `yarn lint` for linting application
