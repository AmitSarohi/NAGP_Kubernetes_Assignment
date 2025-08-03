# Step 1: Build the React app using .env.production
FROM node:18 AS build

WORKDIR /app

# Copy dependencies first
COPY package.json package-lock.json ./
RUN npm install

# Copy the full project including .env.production
COPY . .

# Ensure .env.production is used during the build
# CRA (Create React App) automatically picks it up if REACT_APP_ variables are used
RUN npm run build

# Step 2: Serve the built app with Nginx
FROM nginx:alpine

# Copy built React files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose default Nginx port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
