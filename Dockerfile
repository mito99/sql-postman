ARG ORACLE_VER=12.2.0.1.0
ARG ORACLE_SHORT_VER=12_2

FROM node:20-alpine AS build
ARG ORACLE_VER
ARG ORACLE_SHORT_VER

WORKDIR /app

COPY . .

RUN apk add --no-cache libaio libc6-compat libnsl
RUN mkdir -p /opt/oracle && \
    cp ./docker/oracle_client/instantclient-basic-linux.x64-${ORACLE_VER}.zip /opt/oracle
RUN cd /opt/oracle && \
    unzip instantclient-basic-linux.x64-${ORACLE_VER}.zip && \
    rm -f instantclient-basic-linux.x64-${ORACLE_VER}.zip

ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_${ORACLE_SHORT_VER}/lib:$LD_LIBRARY_PATH
ENV ORACLE_HOME=/opt/oracle/instantclient_${ORACLE_SHORT_VER}

RUN ln -s /usr/lib/libnsl.so.3 /usr/lib/libnsl.so.1 && \
    mkdir -p ${ORACLE_HOME}/lib && \
    mv -f ${ORACLE_HOME}/*.so ${ORACLE_HOME}/lib && \
    mv -f ${ORACLE_HOME}/*.so.* ${ORACLE_HOME}/lib && \
    ln -s ${ORACLE_HOME}/lib/libclntsh.so.12.1 ${ORACLE_HOME}/lib/libclntsh.so && \
    ln -s ${ORACLE_HOME}/lib/libocci.so.12.1 ${ORACLE_HOME}/lib/libocci.so

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build

FROM node:20-alpine AS runtime
ARG ORACLE_VER
ARG ORACLE_SHORT_VER

WORKDIR /app

RUN npm install -g pnpm

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public /app/public

RUN apk add --no-cache libaio libc6-compat libnsl && \
    cp -r /usr/lib/libnsl.so.3 /usr/lib/libnsl.so.1
COPY --from=build /opt/oracle /opt/oracle
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_${ORACLE_SHORT_VER}/lib:$LD_LIBRARY_PATH
ENV ORACLE_HOME=/opt/oracle/instantclient_${ORACLE_SHORT_VER}

EXPOSE 3000

CMD ["pnpm", "start"]
