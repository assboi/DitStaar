from flask import Blueprint
routes = Blueprint("routes", __name__)

from .index import *
from .login import *
from .logout import *
from .triptable import *
from .map import *