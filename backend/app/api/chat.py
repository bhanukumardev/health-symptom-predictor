"""
Chat API endpoints for AI-powered health assistant
Handles secure chatbot interactions through backend
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from app.services.llm_service import ask_health_assistant
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


class ChatMessage(BaseModel):
    """Chat message model"""
    role: str = Field(..., description="Role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")


class ChatRequest(BaseModel):
    """Request model for chat endpoint"""
    message: str = Field(..., min_length=1, max_length=2000, description="User's message")
    history: Optional[List[ChatMessage]] = Field(default=None, description="Chat history for context")


class ChatResponse(BaseModel):
    """Response model for chat endpoint"""
    response: str = Field(..., description="AI-generated response")
    status: str = Field(default="success", description="Response status")


@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(request: ChatRequest):
    """
    Chat with AI health assistant
    
    This endpoint processes user messages and returns AI-generated responses.
    The API key is securely stored on the backend.
    
    - **message**: User's health-related question
    - **history**: Optional previous conversation for context
    
    Returns AI-generated health guidance with appropriate disclaimers.
    """
    try:
        logger.info(f"Chat request received: {request.message[:50]}...")
        
        # Convert history to dict format if provided
        history_dict = None
        if request.history:
            history_dict = [
                {"role": msg.role, "content": msg.content}
                for msg in request.history
            ]
        
        # Generate AI response
        ai_response = await ask_health_assistant(
            message=request.message,
            history=history_dict
        )
        
        logger.info("Chat response generated successfully")
        
        return ChatResponse(
            response=ai_response,
            status="success"
        )
        
    except Exception as e:
        logger.error(f"Chat endpoint error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate response: {str(e)}"
        )


@router.get("/chat/health")
async def health_check():
    """
    Health check endpoint for chat service
    
    Returns the status of the chat service and LLM integration.
    """
    try:
        from app.services.llm_service import llm_service
        from app.core.config import settings
        
        return {
            "status": "healthy",
            "service": "chat",
            "llm_model": llm_service.model,
            "api_key_configured": bool(settings.GROQ_API_KEY)
        }
    except Exception as e:
        logger.error(f"Chat health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "error": str(e)
        }
