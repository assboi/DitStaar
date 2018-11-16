

# Get and error but it will work
# Something with SQLAlchemy
class Tur(db.Model):
    __tablename__ = "adventure"

    aid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, nullable=False)
    distance = db.Column(db.Integer, nullable=False)
    date = db.Column(db.String, nullable=False)
    route = db.Column(db.String, nullable=False)

    def __init__(self, name, distance, date, route):
        self.name = name
        self.distance = distance
        self.date = date
        self.route = route

    def getTrips(self):
        data = []
        query = Tur.query.all()
        for trip in query:
            data.append({
                "name": trip.name,
                "distance": trip.distance
            })
        return data
