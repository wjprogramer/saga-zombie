FROM python:3-slim

ADD . /app

RUN cd /app \
      && \
      pip install -r requirements.txt \
      && \
      echo done

WORKDIR /app

EXPOSE 8080

VOLUME [ "/app/data", "/app/configs" ]

CMD [ "python", "-u", "main.py" ]
