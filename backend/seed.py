from database import SessionLocal, engine, Base
import models
from datetime import datetime

def seed_data():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    print("Seeding full course with 3 Units and 10 Lessons...")

    # 1. Default Learner (Pre-set to start at Lesson 2)
    user = models.User(
        id=1,
        username="DuoLearner",
        xp=120,
        streak=3,
        hearts=5,
        gems=450,
        last_active=datetime.utcnow()
    )
    db.add(user)

    # 2. Spanish Course
    course = models.Course(id=1, title="Spanish", code="es")
    db.add(course)
    db.flush()

    # ================= UNIT 1 =================
    u1 = models.Unit(
        id=1, course_id=course.id, order=1,
        title="Unit 1: Intro & Basics",
        description="Learn common greetings and basic food words."
    )
    db.add(u1)
    db.flush()

    l1 = models.Lesson(id=1, unit_id=u1.id, order=1, title="Greetings")
    l2 = models.Lesson(id=2, unit_id=u1.id, order=2, title="Food & Drinks")
    l3 = models.Lesson(id=3, unit_id=u1.id, order=3, title="Animals")
    db.add_all([l1, l2, l3])
    db.flush()

    exercises_u1 = [
        models.Exercise(
            lesson_id=l1.id, order=1, type="SELECT_ONE",
            prompt='Select the correct translation for "The boy"',
            content={"options": ["El niño", "La niña", "La manzana", "El agua"], "correct": "El niño"}
        ),
        models.Exercise(
            lesson_id=l1.id, order=2, type="TRANSLATE",
            prompt='Translate "Hello, good morning"',
            content={"tokens": ["Hola", "adiós", "buenos", "días", "por", "favor"], "correct": ["Hola", "buenos", "días"]}
        ),
        models.Exercise(
            lesson_id=l1.id, order=3, type="MATCH_PAIRS",
            prompt="Tap the matching pairs",
            content={"pairs": [
                {"left": "Hello", "right": "Hola"},
                {"left": "Goodbye", "right": "Adiós"},
                {"left": "Morning", "right": "Mañana"},
                {"left": "Night", "right": "Noche"}
            ]}
        ),
        models.Exercise(
            lesson_id=l2.id, order=1, type="SELECT_ONE",
            prompt='Which one of these is "Apple"?',
            content={"options": ["Manzana", "Leche", "Pan", "Agua"], "correct": "Manzana"}
        ),
        models.Exercise(
            lesson_id=l2.id, order=2, type="TRANSLATE",
            prompt='Translate "I drink water"',
            content={"tokens": ["Yo", "bebo", "como", "agua", "leche"], "correct": ["Yo", "bebo", "agua"]}
        ),
        models.Exercise(
            lesson_id=l2.id, order=3, type="TYPE_ANSWER",
            prompt='Type the Spanish word for "Bread"',
            content={"correct": ["pan", "el pan"]}
        ),
        models.Exercise(
            lesson_id=l3.id, order=1, type="SELECT_ONE",
            prompt='Which one is "The dog"?',
            content={"options": ["El perro", "El gato", "El caballo", "El pájaro"], "correct": "El perro"}
        ),
        models.Exercise(
            lesson_id=l3.id, order=2, type="FILL_BLANK",
            prompt='Complete the sentence: "El ___ come pescado." (The cat eats fish)',
            content={"options": ["gato", "perro", "caballo", "oso"], "correct": "gato"}
        )
    ]
    db.add_all(exercises_u1)

    # ================= UNIT 2 =================
    u2 = models.Unit(
        id=2, course_id=course.id, order=2,
        title="Unit 2: Daily Life & Routines",
        description="Master ordering food, asking directions, and describing family."
    )
    db.add(u2)
    db.flush()

    l4 = models.Lesson(id=4, unit_id=u2.id, order=1, title="Family")
    l5 = models.Lesson(id=5, unit_id=u2.id, order=2, title="Restaurant")
    l6 = models.Lesson(id=6, unit_id=u2.id, order=3, title="Directions")
    db.add_all([l4, l5, l6])
    db.flush()

    exercises_u2 = [
        models.Exercise(
            lesson_id=l4.id, order=1, type="MATCH_PAIRS",
            prompt="Match the family members",
            content={"pairs": [
                {"left": "Mother", "right": "Madre"},
                {"left": "Father", "right": "Padre"},
                {"left": "Brother", "right": "Hermano"},
                {"left": "Sister", "right": "Hermana"}
            ]}
        ),
        models.Exercise(
            lesson_id=l4.id, order=2, type="TRANSLATE",
            prompt='Translate "My mother is nice"',
            content={"tokens": ["Mi", "madre", "es", "simpática", "padre", "amigo"], "correct": ["Mi", "madre", "es", "simpática"]}
        ),
        models.Exercise(
            lesson_id=l5.id, order=1, type="SELECT_ONE",
            prompt='How do you say "A table for two, please"?',
            content={"options": ["Una mesa para dos, por favor", "La cuenta, por favor", "Dos vasos de agua", "El menú"], "correct": "Una mesa para dos, por favor"}
        ),
        models.Exercise(
            lesson_id=l6.id, order=1, type="TYPE_ANSWER",
            prompt='Type the Spanish word for "Where is..."',
            content={"correct": ["donde esta", "¿dónde está?", "donde está"]}
        )
    ]
    db.add_all(exercises_u2)

    # ================= UNIT 3 =================
    u3 = models.Unit(
        id=3, course_id=course.id, order=3,
        title="Unit 3: Travel & Adventures",
        description="Navigate airports, hotel check-ins, and shopping in Spanish."
    )
    db.add(u3)
    db.flush()

    l7 = models.Lesson(id=7, unit_id=u3.id, order=1, title="Airport")
    l8 = models.Lesson(id=8, unit_id=u3.id, order=2, title="Hotel")
    l9 = models.Lesson(id=9, unit_id=u3.id, order=3, title="Shopping")
    l10 = models.Lesson(id=10, unit_id=u3.id, order=4, title="Emergency")
    db.add_all([l7, l8, l9, l10])
    db.flush()

    exercises_u3 = [
        models.Exercise(
            lesson_id=l7.id, order=1, type="SELECT_ONE",
            prompt='Select the translation for "The passport"',
            content={"options": ["El pasaporte", "El boleto", "La maleta", "El avión"], "correct": "El pasaporte"}
        ),
        models.Exercise(
            lesson_id=l7.id, order=2, type="TRANSLATE",
            prompt='Translate "My flight is late"',
            content={"tokens": ["Mi", "vuelo", "está", "retrasado", "temprano", "tren"], "correct": ["Mi", "vuelo", "está", "retrasado"]}
        ),
        models.Exercise(
            lesson_id=l8.id, order=1, type="MATCH_PAIRS",
            prompt="Match the hotel vocabulary",
            content={"pairs": [
                {"left": "Room", "right": "Habitación"},
                {"left": "Key", "right": "Llave"},
                {"left": "Bed", "right": "Cama"},
                {"left": "Shower", "right": "Ducha"}
            ]}
        ),
        models.Exercise(
            lesson_id=l9.id, order=1, type="FILL_BLANK",
            prompt='Complete: "¿___ cuesta esto?" (How much does this cost?)',
            content={"options": ["Cuánto", "Cómo", "Dónde", "Quién"], "correct": "Cuánto"}
        ),
        models.Exercise(
            lesson_id=l10.id, order=1, type="TYPE_ANSWER",
            prompt='Type the Spanish word for "Help!"',
            content={"correct": ["ayuda", "socorro", "¡ayuda!"]}
        )
    ]
    db.add_all(exercises_u3)

    # Initial state: Only Lesson 1 is completed so Lesson 2 is Active and playable
    demo_progress = models.UserLessonProgress(user_id=user.id, lesson_id=l1.id, is_completed=True)
    db.add(demo_progress)

    db.commit()
    db.close()
    print("Database seeded with 3 Units and 10 Lessons!")

if __name__ == "__main__":
    seed_data()