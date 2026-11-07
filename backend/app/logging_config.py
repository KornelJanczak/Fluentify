import logging
import logging.config


def configure_logging(level: str) -> None:
    normalized_level = level.upper()
    if normalized_level not in logging.getLevelNamesMapping():
        raise ValueError(f"Unsupported log level: {level}")

    logging.config.dictConfig({
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "default": {
                "format": "%(asctime)s | %(levelname)s | %(name)s | %(message)s",
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "formatter": "default",
            },
        },
        "root": {
            "level": normalized_level,
            "handlers": ["console"],
        },
    })
