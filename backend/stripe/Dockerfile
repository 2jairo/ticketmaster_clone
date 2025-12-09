FROM stripe/stripe-cli:latest

WORKDIR /app

COPY run-stripe-listener.sh .

RUN chmod +x run-stripe-listener.sh

ENTRYPOINT [ "/bin/sh", "-c" ]
CMD ["/app/run-stripe-listener.sh"]