from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta

from database import engine, Base, get_db
import models

# Automatically create all SQLite tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Duolingo Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Schemas ---
class LessonCompleteRequest(BaseModel):
    hearts_left: int
    xp_earned: int

class SimulateDayRequest(BaseModel):
    days_to_advance: int


# --- Endpoints ---

@app.get("/health")
def health_check():
    return {"status": "ok", "app": "Duolingo Clone API"}


@app.get("/api/user")
def get_current_user(db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.get("/api/units")
def get_units_with_lessons(db: Session = Depends(get_db)):
    completed_lessons = {
        p.lesson_id for p in db.query(models.UserLessonProgress).filter_by(user_id=1, is_completed=True).all()
    }

    units = db.query(models.Unit).order_by(models.Unit.order).all()
    result = []

    is_next_available = True
    for unit in units:
        unit_data = {
            "id": unit.id,
            "title": unit.title,
            "description": unit.description,
            "order": unit.order,
            "lessons": []
        }
        lessons = db.query(models.Lesson).filter_by(unit_id=unit.id).order_by(models.Lesson.order).all()

        for lesson in lessons:
            is_completed = lesson.id in completed_lessons
            
            # A lesson is unlocked if it's already completed or if it is the very next available lesson
            status = "LOCKED"
            if is_completed:
                status = "COMPLETED"
            elif is_next_available:
                status = "ACTIVE"
                is_next_available = False

            unit_data["lessons"].append({
                "id": lesson.id,
                "title": lesson.title,
                "order": lesson.order,
                "status": status
            })

        result.append(unit_data)
    return result


@app.get("/api/lessons/{lesson_id}")
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(models.Lesson).filter_by(id=lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    exercises = db.query(models.Exercise).filter_by(lesson_id=lesson_id).order_by(models.Exercise.order).all()
    return {
        "id": lesson.id,
        "title": lesson.title,
        "exercises": [
            {
                "id": ex.id,
                "order": ex.order,
                "type": ex.type,
                "prompt": ex.prompt,
                "content": ex.content
            }
            for ex in exercises
        ]
    }


@app.post("/api/lessons/{lesson_id}/complete")
def complete_lesson(lesson_id: int, req: LessonCompleteRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter_by(id=1).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update XP and hearts
    user.xp += req.xp_earned
    user.hearts = max(0, min(5, req.hearts_left))

    # Advance streak by +1 on completion
    if not user.streak or user.streak < 1:
        user.streak = 1
    else:
        user.streak += 1

    user.last_active = datetime.utcnow()

    # Mark lesson completed
    progress = db.query(models.UserLessonProgress).filter_by(user_id=1, lesson_id=lesson_id).first()
    if not progress:
        progress = models.UserLessonProgress(user_id=1, lesson_id=lesson_id, is_completed=True)
        db.add(progress)
    else:
        progress.is_completed = True

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "status": "success",
        "new_xp": user.xp,
        "hearts": user.hearts,
        "streak": user.streak
    }


@app.post("/api/user/refill-hearts")
def refill_hearts(db: Session = Depends(get_db)):
    user = db.query(models.User).filter_by(id=1).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Costs 50 gems to refill hearts to 5 (with fallback for testing)
    if user.gems >= 50:
        user.gems -= 50
        user.hearts = 5
    else:
        user.hearts = 5
    
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"hearts": user.hearts, "gems": user.gems}


@app.post("/api/user/simulate-day")
def simulate_day(req: SimulateDayRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter_by(id=1).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Shift last_active back in time
    user.last_active = datetime.utcnow() - timedelta(days=req.days_to_advance)
    
    # Missing 2 or more days breaks the streak back to 1
    if req.days_to_advance >= 2:
        user.streak = 1
    elif req.days_to_advance == 1:
        if user.streak < 1:
            user.streak = 1

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "status": "success",
        "streak": user.streak,
        "days_shifted": req.days_to_advance,
        "last_active": user.last_active.isoformat()
    }


@app.post("/api/user/reset-progress")
def reset_progress(db: Session = Depends(get_db)):
    user = db.query(models.User).filter_by(id=1).first()
    if user:
        user.xp = 120
        user.streak = 3
        user.hearts = 5
        user.gems = 450
        user.last_active = datetime.utcnow()
        db.add(user)

    # Clear all progress records
    db.query(models.UserLessonProgress).filter_by(user_id=1).delete()

    # Mark only Lesson 1 as completed so Lesson 2 starts as the active one
    first_progress = models.UserLessonProgress(user_id=1, lesson_id=1, is_completed=True)
    db.add(first_progress)

    db.commit()
    return {"status": "reset", "streak": 3, "xp": 120, "message": "Progress reset to demo state!"}


@app.get("/api/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    user = db.query(models.User).filter_by(id=1).first()
    competitors = [
        {"id": 101, "username": "Carlos_S", "xp": 420, "avatar": "🦊", "is_user": False},
        {"id": 102, "username": "Marie_Duval", "xp": 310, "avatar": "🐼", "is_user": False},
        {"id": 1, "username": user.username if user else "You", "xp": user.xp if user else 150, "avatar": "🦉", "is_user": True},
        {"id": 103, "username": "Kenji_99", "xp": 110, "avatar": "🦁", "is_user": False},
        {"id": 104, "username": "Sophia_L", "xp": 80, "avatar": "🐨", "is_user": False},
        {"id": 105, "username": "Alex_Dev", "xp": 45, "avatar": "🐸", "is_user": False},
    ]
    competitors.sort(key=lambda x: x["xp"], reverse=True)
    for index, c in enumerate(competitors, start=1):
        c["rank"] = index
    return competitors