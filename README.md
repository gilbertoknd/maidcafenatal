# Running project MaidCafeNatal:

## Running only backend:

- docker build -t maid-backend ./backend

- docker run -p 3000:3000 maid-backend

## Running only frontend:

- docker build -t maid-frontend ./frontend

- docker run -p 5173:5173 maid-frontend

## Running all project:

- docker-compose up --build

