from werkzeug.security import check_password_hash, generate_password_hash

class Users(db.Model):
    __tablename__ = 'user'
    username = db.Column(db.String(50), primary_key=True)
    password = db.Column(db.String(200), nullable=False)

    def __init__(self, username, password):
        self.username = username
        self.set_password(password)

    def _set_password(self, password):
         self.password = generate_password_hash(password)

    def _check_password(self, password):
        return check_password_hash(self.password, password)
        

def add_user(self, username, password):
    user = Users(username, password)
    db.session.add(user)
    db.session.commit()

def user_not_in_db(self, username):
    query = Users.query.filter_by(username=username)
    for each in query:
        if username == each.username:
            return False
    return True

def valid_login(self, username, password):
    user = Users.query.filter_by(username=username).first()
    if user:
        return user.check_password(password)
    return False
