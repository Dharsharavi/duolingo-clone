from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, JSON, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, default="Learner")
    xp = Column(Integer, default=0)
    streak = Column(Integer, default=1)
    hearts = Column(Integer, default=5)
    gems = Column(Integer, default=500)
    last_active = Column(DateTime, default=datetime.utcnow)

    progress = relationship("UserLessonProgress", back_populates="user")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    code = Column(String, unique=True, index=True)
    units = relationship("Unit", back_populates="course")

class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    order = Column(Integer, default=1)
    title = Column(String, nullable=False)
    description = Column(String)

    course = relationship("Course", back_populates="units")
    lessons = relationship("Lesson", back_populates="unit")

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"))
    order = Column(Integer, default=1)
    title = Column(String, nullable=False)

    unit = relationship("Unit", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson")

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    order = Column(Integer, default=1)
    type = Column(String, nullable=False)
    prompt = Column(String, nullable=False)
    content = Column(JSON, nullable=False)

    lesson = relationship("Lesson", back_populates="exercises")

class UserLessonProgress(Base):
    __tablename__ = "user_lesson_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="progress")