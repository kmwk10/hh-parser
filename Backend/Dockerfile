ARG PYTHON_VERSION=3.11.5
FROM python:${PYTHON_VERSION}-slim AS base

WORKDIR /app

ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=requirements.txt,target=requirements.txt \
    python -m pip install -r requirements.txt

USER appuser

EXPOSE 8000

CMD gunicorn -k uvicorn.workers.UvicornWorker src.main:app --bind=0.0.0.0:8000 --reload