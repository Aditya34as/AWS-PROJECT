# AWS ECS Fargate Demo App

This is a simple full-stack demo application using React + Vite for the frontend and Node.js + Express for the backend. It's designed to be deployed on AWS ECS Fargate.

## Folder Structure

- `frontend/`: React application using Vite. Includes Dockerfile and Nginx configuration.
- `backend/`: Node.js + Express backend API. Includes Dockerfile.
- `docker-compose.yml`: For local testing with Docker Compose.

## Local Development

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose

### Running Locally without Docker
1. **Backend**:
   ```bash
   cd backend
   npm install
   npm start # or node server.js
   ```
   Server will run on `http://localhost:5000`

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   App will run on `http://localhost:5173`

### Running Locally with Docker Compose
```bash
docker-compose up --build
```
- Frontend: `http://localhost:80`
- Backend: `http://localhost:5000`

## AWS Deployment Steps

### 1. Build and Push Docker Images to ECR
1. Create two ECR repositories: `demo-frontend` and `demo-backend`.
2. Authenticate Docker to your Amazon ECR registry.
3. Build the backend image:
   ```bash
   docker build -t demo-backend ./backend
   docker tag demo-backend:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/demo-backend:latest
   docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/demo-backend:latest
   ```
4. Build the frontend image. **Note:** Make sure to set `VITE_API_URL` to your Load Balancer's DNS name or let it use a relative path if routing via ALB:
   ```bash
   docker build --build-arg VITE_API_URL=http://<ALB_DNS_NAME>/api -t demo-frontend ./frontend
   docker tag demo-frontend:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/demo-frontend:latest
   docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/demo-frontend:latest
   ```

### 2. Create ECS Cluster
1. Navigate to Amazon ECS.
2. Create a new Cluster (e.g., `Demo-ECS-Cluster`) using AWS Fargate.

### 3. Create Application Load Balancer (ALB)
1. Go to EC2 -> Load Balancers -> Create Application Load Balancer.
2. Select VPC and at least 2 subnets.
3. Create a Security Group allowing HTTP (Port 80) from anywhere.
4. Create two Target Groups:
   - `frontend-tg`: Port 80, Target type: IP
   - `backend-tg`: Port 5000, Target type: IP
5. Set up Listeners on the ALB:
   - Default action on Port 80: Forward to `frontend-tg`.
   - Add a rule on Port 80: If Path is `/api/*`, forward to `backend-tg`.

### 4. Create Task Definitions
1. **Backend Task**:
   - Create new Task Definition -> Fargate.
   - Container name: `backend-container`
   - Image URI: `<ecr_backend_image_uri>`
   - Port mappings: `5000` (TCP)
   - Environment variables: `PORT=5000`
2. **Frontend Task**:
   - Create new Task Definition -> Fargate.
   - Container name: `frontend-container`
   - Image URI: `<ecr_frontend_image_uri>`
   - Port mappings: `80` (TCP)

### 5. Create ECS Services
1. Go to your ECS Cluster -> Create Service.
2. **Backend Service**: Select the Backend Task Definition, configure networking, assign a Security Group allowing port 5000 from the ALB, attach the `backend-tg` target group.
3. **Frontend Service**: Select the Frontend Task Definition, configure networking, assign a Security Group allowing port 80 from the ALB, attach the `frontend-tg` target group.

### 6. Verify Deployment
Navigate to the Application Load Balancer DNS name in your browser. You should see the React app loading data from the Express backend!
