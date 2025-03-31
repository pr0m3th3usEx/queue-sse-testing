# RabbitMQ RPC Proof of Concept

This project is a proof of concept (PoC) demonstrating Remote Procedure Calls (RPC) using RabbitMQ. The repository includes a structured monorepo setup with an RPC client and server, enabling communication via RabbitMQ message queues.

## Features
- Implements RPC Server & Client using RabbitMQ
- Uses `pnpm` workspaces for monorepo management

## Prerequisites
- Node.js (LTS recommended)
- `pnpm` package manager
- Docker & Docker Compose

## Installation

Clone the repository and install dependencies:
```sh
git clone https://github.com/pr0m3th3usEx/rabbit-rpc-testing.git
cd rabbit-rpc-testing
pnpm install
```

## Running the Project

Start RabbitMQ and services using Docker Compose:
```sh
docker-compose up -d
```

### Running the RPC Server
```sh
cd apps/rpc-server
pnpm dev
```

### Running the RPC Client
```sh
cd apps/rpc-client
pnpm dev
```

## Project Structure
```
.
├── apps/
│   ├── rpc-server/        # RPC Server implementation
│   ├── rpc-client/        # RPC Client implementation
├── packages/
│   ├── rabbitmq/          # RabbitMQ utility package
│   ├── eslint-config/     # Custom ESLint configuration
│   ├── prettier-config/   # Custom Prettier configuration
├── docker-compose.yaml    # Docker setup for RabbitMQ
├── package.json           # Root package manager file
└── pnpm-workspace.yaml    # Monorepo workspace configuration
```

## License
This project is licensed under the MIT License.

## Contributing
Contributions are welcome! Please follow the existing coding style and open an issue or pull request.

## Contact
For any questions, feel free to reach out or create an issue in this repository.

