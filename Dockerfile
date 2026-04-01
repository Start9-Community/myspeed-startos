FROM germannewsmaker/myspeed:1.0.9

RUN apk add --no-cache tini

ENTRYPOINT ["tini", "--"]
CMD ["node", "server"]
