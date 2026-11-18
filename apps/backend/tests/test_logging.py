import logging

import pytest

from app.logging_config import configure_logging


def test_configure_logging_sets_root_level() -> None:
    configure_logging("DEBUG")

    assert logging.getLogger().level == logging.DEBUG

