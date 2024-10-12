FROM node:22-alpine
 
RUN apk add --no-cache libc6-compat
 
WORKDIR /app
 
COPY . .
 
ENV NODE_ENV production
 
ENV NEXT_TELEMETRY_DISABLED 1
 
ENV NEXT_PRIVATE_STANDALONE true
 
# If I don't install next, I get an error next: not found
RUN npm i next sharp
 
EXPOSE 3001
 
ENV PORT 3001
 
CMD HOSTNAME="0.0.0.0" node server.js