# modular-pets

[![License](https://img.shields.io/github/license/ViniciusCestarii/modular-pets)](https://github.com/ViniciusCestarii/modular-pets/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/ViniciusCestarii/modular-pets)](https://github.com/ViniciusCestarii/modular-pets/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/ViniciusCestarii/modular-pets)](https://github.com/ViniciusCestarii/modular-pets/issues)
[![Dependabot](https://badgen.net/badge/Dependabot/enabled/green?icon=dependabot)](https://dependabot.com/)

[![Build Status](https://github.com/ViniciusCestarii/modular-pets/actions/workflows/build-check.yml/badge.svg)](https://github.com/ViniciusCestarii/modular-pets/actions/workflows/build-check.yml)
[![Lint Status](https://github.com/ViniciusCestarii/modular-pets/actions/workflows/lint-check.yml/badge.svg)](https://github.com/ViniciusCestarii/modular-pets/actions/workflows/lint-check.yml)
[![Type Check Status](https://github.com/ViniciusCestarii/modular-pets/actions/workflows/types-check.yml/badge.svg)](https://github.com/ViniciusCestarii/modular-pets/actions/workflows/types-check.yml)
[![Test Unit Status](https://github.com/ViniciusCestarii/modular-pets/actions/workflows/test-unit.yml/badge.svg)](https://github.com/ViniciusCestarii/modular-pets/actions/workflows/test-unit.yml)
[![Test E2E Status](https://github.com/ViniciusCestarii/modular-pets/actions/workflows/test-e2e.yml/badge.svg)](https://github.com/ViniciusCestarii/modular-pets/actions/workflows/test-e2e.yml)

## Overview

Modular Pets is a comprehensive system designed to manage various aspects of a pet store or adoption center. The system is modular, allowing for easy customization and extension. It will include modules for managing pets, customers, adoptions, medical records, inventory, orders, shipping, notifications, and payments.

## Modules

### 1. Pet Module

- **Responsibilities**: Manages pets' information like their ID, name, species, breed, age, etc.
- **Key Features**:
  - Add, update, and delete pets.
  - Store pet details (e.g., name, breed, birthdate).
  - Handle pet-related events (e.g., adoption, medical history).

### 2. Customer Module

- **Responsibilities**: Manages customer details such as names, contact information, and pet-related history (like adoptions).
- **Key Features**:
  - Add, update, and remove customers.
  - Manage customer addresses, phone numbers, and emails.
  - Track customer interactions with pets (e.g., adoption history, customer preferences).

### 3. Adoption Module

- **Responsibilities**: Handles the process of pet adoptions.
- **Key Features**:
  - Track adoption status (e.g., available, pending, adopted).
  - Manage adoption applications.
  - Handle adoption agreements and paperwork.

### 4. Medical (Health) Module

- **Responsibilities**: Keeps track of pet health records, vaccinations, appointments, etc.
- **Key Features**:
  - Record and manage medical history.
  - Schedule vet appointments.
  - Manage vaccinations and treatments.
  - Track health conditions or ongoing treatments.

### 5. Inventory (Products) Module

- **Responsibilities**: Manages the products available in the store, such as pet food, toys, grooming supplies, etc.
- **Key Features**:
  - Add, update, and remove products.
  - Track stock levels and inventory.
  - Manage product categories (e.g., food, accessories, medicine).

### 6. Orders & Transactions Module

- **Responsibilities**: Handles the sales of products and pet adoptions.
- **Key Features**:
  - Track product purchases, cart management, and order history.
  - Handle payment and transaction processing.
  - Issue receipts and invoices.

### 7. Shipping & Delivery Module

- **Responsibilities**: Manages the logistics of delivering pet products or delivering pets after adoption.
- **Key Features**:
  - Track shipping addresses and delivery preferences.
  - Integrate with third-party delivery services.
  - Monitor delivery status and logistics.

### 8. Notification Module

- **Responsibilities**: Handles sending notifications to customers or staff.
- **Key Features**:
  - Send notifications for order updates, pet adoption status, reminders for medical appointments, etc.
  - Integrate with email, SMS, and in-app messaging systems.

### 9. Payments Module

- **Responsibilities**: Manages all financial transactions, including payments for products or services.
- **Key Features**:
  - Integrate with payment gateways (e.g., Stripe, PayPal).
  - Track payment history and generate reports.
  - Manage refunds or cancellations.

## Getting Started

### Prerequisites

- Node.js
- Bun

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/ViniciusCestarii/modular-pets.git
    cd modular-pets
    ```

2. Install dependencies:
    ```sh
    bun install
    ```

### Running the Project

Clone .env.example to .env and fill in the necessary environment variables.
```sh	
cp .env.example .env
```

To start the project, run:
```sh
bun dev
```

To build the project for production, run:
```sh
bun run build
```

To run in production mode, run:
```sh
bun start
```

## Testing

To run unit tests, use the following command:
```sh
bun run test
```

To run end-to-end tests, use the following command:
```sh
bun run test:e2e
```

## Running with Docker

To run the project using Docker, use the following commands:

1. Build the Docker image:
    ```sh
    docker build -t modular-pets .
    ```

2. Run the Docker container:
    ```sh
    docker run -p 3333:3333 --env-file .env modular-pets
    ```

OR

1. Use Docker Compose to build and run the project:
    ```sh
    docker-compose up
    ```

- OBS1: Don't forget to fill in the necessary environment variables in the `.env` file. 

- OBS2: Use the hostname `host.docker.internal` instead of `localhost` to connect to the host machine from the Docker container.
