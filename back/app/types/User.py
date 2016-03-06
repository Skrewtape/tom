# pylint: disable=no-name-in-module
# pylint can't read the types from passlib.hash
"""Model object for a user"""
from app import DB
from passlib.hash import sha512_crypt
from sqlalchemy.exc import ArgumentError
from flask_restless.helpers import to_dict
from app.types import util

Role_user_mapping = DB.Table(
    'role_user',
    DB.Column('user_id', DB.Integer, DB.ForeignKey('user.user_id')),
    DB.Column('role_id', DB.Integer, DB.ForeignKey('role.role_id'))
)

class User(DB.Model):
# pylint: disable=no-init
# pylint can't find SQLAlchemy's __init__() method for some reason
    """Model object for a user"""
    user_id = DB.Column(DB.Integer, primary_key=True)
    username = DB.Column(DB.String(80), unique=True, nullable=False)
    email = DB.Column(DB.String(120), unique=True, nullable=False)
    password_crypt = DB.Column(DB.String(134))
    @DB.validates('email')
    def validate_email_wrapper(self,key,address):
        return util.validate_email(key,address)
#    def validate_email(self,key,address):
#        if re.match(r"[^@]+@[^@]+\.[^@]+",address):
#            return address
#        raise ArgumentError
        
    @DB.validates('username')
    def validate_username(self,key,username):
        if len(username) <= 25:
            return username
        raise ArgumentError                
    
    def crypt_password(self, password):
        """Encrypt a plaintext password and store it"""
        self.password_crypt = sha512_crypt.encrypt(password)

    roles = DB.relationship(
        'Role',
        secondary=Role_user_mapping,
        backref=DB.backref('users', lazy='dynamic')
    )

    def verify_password(self, password):
        """Check to see if a plaintext password matches our crypt"""
        return sha512_crypt.verify(password, self.password_crypt)

    def __repr__(self):
        return '<User %r>' % self.username

    @staticmethod
    def is_authenticated():
        """Users are always authenticated"""
        return True

    @staticmethod
    def is_active():
        """Users are always active"""
        return True

    @staticmethod
    def is_anonymous():
        """No anon users"""
        return False

    def get_id(self):
        """Get the user's id"""
        return self.user_id

    def to_dict_simple(self):
        user = to_dict(self)
        del user['password_crypt']
        #if Admin_permission.can() or self.user_id == current_user.user_id:
        #    user['roles'] = [r.name for r in self.roles]
        return user
            
