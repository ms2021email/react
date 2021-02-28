FROM node:alpine

# Create-react-app does have an open issue tracking this: https://github.com/facebook/create-react-app/issues/8688
# Solution/work-around is to add the following line
ENV CI=true

WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./

CMD ["npm", "start"]
