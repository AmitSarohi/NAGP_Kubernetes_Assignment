# Build & Push Docker Images

# Backend
cd backend
docker build -t yourdockerhubuser/backend:latest .
docker push yourdockerhubuser/backend:latest

# Frontend
cd ../frontend
docker build -t yourdockerhubuser/frontend:latest .
docker push yourdockerhubuser/frontend:latest


# Deploying on Kubernetes

kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/init-sql-configmap.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/api-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml
