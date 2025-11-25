# Running project MaidCafeNatal:

## Running only backend:

- docker build -t maid-backend ./backend

- docker run -p 3000:3000 maid-backend

## Stopping only backend:

- docker stop maid-backend

## Running all project:

- docker-compose up --build

## Stopping all project:

- docker-compose down

## Stopping all project and remove volumes:

- docker-compose down -v
