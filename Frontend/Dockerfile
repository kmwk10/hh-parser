FROM node:lts

ENV PATH="/app/node_modules/.bin:$PATH"

EXPOSE 5173

ENTRYPOINT npm install --include=dev && npm run dev